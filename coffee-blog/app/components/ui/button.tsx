import React from 'react';

/* Button variants following The Editorial Muse design system */

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  asChild = false,
  ...props
}: ButtonProps & React.ComponentProps<'button'> & React.ComponentProps<'a'>) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50';

  const variantStyles = {
    primary: 'signature-gradient text-on-primary rounded-xl hover:opacity-90',
    secondary: 'ghost-border-strong text-primary rounded-xl hover:bg-surface-low',
    tertiary: 'text-secondary underline-offset-4 hover:underline',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  // If asChild is true and there's a single child (like Link), render it with styles
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      className: `${combinedClassName} ${(children.props as any).className || ''}`,
    });
  }

  return (
    <button
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}
