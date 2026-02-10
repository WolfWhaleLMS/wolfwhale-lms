import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { ValidationError, ApiError } from '@/lib/api/errors';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia',
});

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceId: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  maxUsers: number;
  features: string[];
  recommended?: boolean;
}

// Define subscription plans
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for trying out Wolf Whale LMS',
    priceId: 'free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    maxUsers: 10,
    features: [
      'Up to 10 users',
      'Basic course management',
      'Limited storage',
      'Community support',
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For small schools',
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
    price: 99,
    currency: 'USD',
    interval: 'month',
    maxUsers: 50,
    features: [
      'Up to 50 users',
      'Full course management',
      'Gamification features',
      'Email support',
      '5GB storage',
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For growing schools',
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    price: 299,
    currency: 'USD',
    interval: 'month',
    maxUsers: 500,
    features: [
      'Up to 500 users',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
      '100GB storage',
      'API access',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large districts',
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    price: 999,
    currency: 'USD',
    interval: 'month',
    maxUsers: 10000,
    features: [
      'Unlimited users',
      'Advanced security',
      'Custom integrations',
      '24/7 support',
      'Unlimited storage',
      'Dedicated account manager',
      'Custom SLA',
    ],
  },
];

/**
 * Get all available subscription plans
 */
export function getSubscriptionPlans(): SubscriptionPlan[] {
  return SUBSCRIPTION_PLANS;
}

/**
 * Get a plan by ID
 */
export function getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === planId);
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(
  tenantId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const supabase = await createAdminClient();

  // Get tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id, name, email, stripe_customer_id')
    .eq('id', tenantId)
    .single();

  if (tenantError || !tenant) {
    throw new ValidationError('Tenant not found');
  }

  try {
    let customerId = tenant.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: tenant.email,
        name: tenant.name,
        metadata: {
          tenantId,
        },
      });

      customerId = customer.id;

      // Update tenant with customer ID
      await supabase
        .from('tenants')
        .update({ stripe_customer_id: customerId })
        .eq('id', tenantId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tenantId,
      },
    });

    if (!session.url) {
      throw new ApiError('Failed to create checkout URL', 500, 'CHECKOUT_ERROR');
    }

    return session.url;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new ApiError(`Stripe error: ${error.message}`, 500, 'STRIPE_ERROR');
    }

    throw error;
  }
}

/**
 * Create a customer portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    if (!session.url) {
      throw new ApiError('Failed to create portal URL', 500, 'PORTAL_ERROR');
    }

    return session.url;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      throw new ApiError(`Stripe error: ${error.message}`, 500, 'STRIPE_ERROR');
    }

    throw error;
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const supabase = await createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const tenantId = session.metadata?.tenantId;

      if (!tenantId) {
        console.warn('Missing tenantId in checkout session');
        return;
      }

      // Update tenant subscription status
      await syncSubscriptionStatus(session.subscription as string);
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.created': {
      const subscription = event.data.object as Stripe.Subscription;
      await syncSubscriptionStatus(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const tenantId = subscription.metadata?.tenantId;

      if (tenantId) {
        await supabase
          .from('tenants')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', tenantId);
      }
      break;
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Invoice paid:', invoice.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn('Invoice payment failed:', invoice.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
}

/**
 * Sync subscription status from Stripe
 */
export async function syncSubscriptionStatus(subscriptionId: string | Stripe.Subscription): Promise<void> {
  const supabase = await createAdminClient();

  try {
    let subscription: Stripe.Subscription;

    if (typeof subscriptionId === 'string') {
      subscription = await stripe.subscriptions.retrieve(subscriptionId);
    } else {
      subscription = subscriptionId;
    }

    const tenantId = subscription.metadata?.tenantId;
    if (!tenantId) {
      console.warn('Missing tenantId in subscription');
      return;
    }

    // Determine subscription tier from price
    let tier: 'free' | 'basic' | 'pro' | 'enterprise' = 'free';
    const priceId = (subscription.items.data[0]?.price.id || '').toString();

    if (priceId === process.env.STRIPE_BASIC_PRICE_ID) {
      tier = 'basic';
    } else if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
      tier = 'pro';
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      tier = 'enterprise';
    }

    // Map Stripe status to app status
    const statusMap: Record<string, string> = {
      'active': 'active',
      'past_due': 'past_due',
      'unpaid': 'unpaid',
      'canceled': 'canceled',
      'incomplete': 'incomplete',
      'incomplete_expired': 'incomplete_expired',
      'trialing': 'trialing',
    };

    const status = statusMap[subscription.status] || subscription.status;

    // Get max users for tier
    const plan = getSubscriptionPlan(tier);
    const maxUsers = plan?.maxUsers || 10;

    // Update tenant
    await supabase
      .from('tenants')
      .update({
        subscription_tier: tier,
        subscription_status: status,
        subscription_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        stripe_customer_id: subscription.customer as string,
        stripe_subscription_id: subscription.id,
        max_users: maxUsers,
        updated_at: new Date().toISOString(),
      })
      .eq('id', tenantId);

    console.log(`Synced subscription for tenant ${tenantId}: tier=${tier}, status=${status}`);
  } catch (error) {
    console.error('Error syncing subscription:', error);
    throw error;
  }
}

/**
 * Get invoice history for a customer
 */
export async function getCustomerInvoices(customerId: string): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit: 50,
  });

  return invoices.data;
}

/**
 * Get subscription details
 */
export async function getSubscriptionDetails(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.retrieve(subscriptionId);
}

/**
 * Cancel a subscription immediately
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return stripe.subscriptions.cancel(subscriptionId);
}

/**
 * Update subscription (e.g., change plan)
 */
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
  });
}
