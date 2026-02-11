import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-[oklch(0.35_0.08_220)] to-[oklch(0.70_0.12_180)] text-white shadow-lg hover:shadow-[0_0_25px_oklch(0.70_0.12_180/0.4)] btn-glow',
        secondary:
          'liquid-glass-subtle text-slate-900 dark:text-white hover:bg-white/20 active:bg-white/30',
        destructive: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-lg hover:shadow-[0_0_20px_oklch(0.63_0.24_25/0.4)]',
        outline: 'border-2 border-[oklch(0.35_0.08_220)] text-[oklch(0.35_0.08_220)] hover:bg-[oklch(0.35_0.08_220/0.05)] dark:border-[oklch(0.70_0.12_180)] dark:text-[oklch(0.70_0.12_180)]',
        ghost: 'text-slate-900 dark:text-slate-100 hover:bg-white/10 active:bg-white/20',
        link: 'text-[oklch(0.35_0.08_220)] underline-offset-4 hover:underline dark:text-[oklch(0.70_0.12_180)]',
        fun: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-[0_0_30px_oklch(0.55_0.22_285/0.4)] btn-glow',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
