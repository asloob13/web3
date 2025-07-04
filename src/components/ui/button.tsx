import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 touch-target',
  {
    variants: {
      variant: {
        default: 'bg-saffron-500 text-white hover:bg-saffron-600 focus-visible:ring-saffron-500',
        destructive: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500',
        outline: 'border border-saffron-500 text-saffron-500 hover:bg-saffron-50 focus-visible:ring-saffron-500',
        secondary: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500',
        ghost: 'text-saffron-700 hover:bg-saffron-50 focus-visible:ring-saffron-500',
        link: 'text-saffron-500 underline-offset-4 hover:underline focus-visible:ring-saffron-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-500',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-10 px-3 text-xs',
        lg: 'h-14 px-8 text-base',
        xl: 'h-16 px-10 text-lg',
        icon: 'h-12 w-12',
      },
      accessibility: {
        default: '',
        large: 'text-accessibility-large min-h-touch-target min-w-touch-target',
        xl: 'text-accessibility-xl min-h-touch-target min-w-touch-target',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      accessibility: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  asChild?: boolean;
  ariaLabel?: string;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    accessibility,
    loading = false, 
    disabled,
    children,
    ariaLabel,
    loadingText = 'Loading...',
    ...props 
  }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, accessibility, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-busy={loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {loading ? loadingText : children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };