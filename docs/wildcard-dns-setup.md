# Wildcard DNS Setup for wolfwhale.ca on Vercel

## 1. Vercel Domain Setup

1. Go to your Vercel project dashboard.
2. Navigate to **Settings** → **Domains**.
3. Add `*.wolfwhale.ca` as a wildcard domain.
4. Add `wolfwhale.ca` as the root domain.

Vercel will provide DNS records to configure at your registrar.

## 2. DNS Configuration (Domain Registrar)

Log in to your domain registrar and add the following records for `wolfwhale.ca`:

| Type  | Name | Value                    | TTL  |
|-------|------|--------------------------|------|
| CNAME | `*`  | `cname.vercel-dns.com`   | Auto |
| A     | `@`  | `76.76.21.21`            | Auto |

DNS propagation can take up to 48 hours, though it typically resolves within a few minutes to a few hours.

## 3. Verify

Once DNS has propagated:

- Visit `demo.wolfwhale.ca` — it should load the LMS.
- Any subdomain such as `school1.wolfwhale.ca` should route to the app.
- The middleware extracts the subdomain from the request hostname and resolves the corresponding tenant.

## 4. Local Development

Subdomains do not work on `localhost` by default. Use one of these approaches:

**Option A — Query parameter:**

Visit `http://localhost:3000` with a `?tenant=demo` query parameter. The middleware will read the tenant from the query string.

**Option B — /etc/hosts:**

Add an entry to `/etc/hosts`:

```
127.0.0.1 demo.localhost
```

Then visit `http://demo.localhost:3000`. The middleware will extract `demo` as the subdomain.

Both approaches are supported — the middleware checks for a subdomain first, then falls back to the `tenant` query parameter.

## 5. Test Accounts

| Email                      | Role          | Password                 |
|----------------------------|---------------|--------------------------|
| student@wolfwhale.ca       | student       | WolfWhale-Student-2026   |
| teacher@wolfwhale.ca       | teacher       | WolfWhale-Teacher-2026   |
| parent@wolfwhale.ca        | parent        | WolfWhale-Parent-2026    |
| admin@wolfwhale.ca         | school_admin  | WolfWhale-Admin-2026     |
| superadmin@wolfwhale.ca    | super_admin   | WolfWhale-Super-2026     |
