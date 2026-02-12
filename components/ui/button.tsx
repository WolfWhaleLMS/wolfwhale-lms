import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95',
  {
    variants: {
      variant: {
        default:
          'bg-[#00BFFF] text-white shadow-lg hover:bg-[#00BFFF]/90 hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] btn-glow',
        secondary:
          'liquid-glass-subtle text-[#0A2540] dark:text-[#E8F8FF] border border-[#00FFFF]/30 hover:border-[#00FFFF]/50 hover:bg-[#00FFFF]/5',
        destructive: 'bg-[#FF3366] text-white hover:bg-[#FF3366]/90 shadow-lg hover:shadow-[0_0_20px_rgba(255,51,102,0.4)]',
        outline: 'border-2 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF]/5 dark:border-[#00BFFF] dark:text-[#00BFFF]',
        ghost: 'text-[#0A2540] dark:text-[#E8F8FF] hover:bg-[#00BFFF]/8 active:bg-[#00BFFF]/15',
        link: 'text-[#00BFFF] underline-offset-4 hover:underline',
        fun: 'bg-gradient-to-r from-[#00BFFF] via-[#33FF33] to-[#00FFFF] text-white text-white-outlined hover:shadow-[0_0_30px_rgba(0,191,255,0.4)] btn-glow animate-ocean-wave bg-[length:200%_200%]',
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
