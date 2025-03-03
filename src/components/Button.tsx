
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white' | 'outline-white';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  animate = false,
  ...props
}: ButtonProps) => {
  const baseClasses = "relative inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-anondopath-blue to-anondopath-teal text-white shadow hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-anondopath-teal text-anondopath-blue bg-transparent hover:bg-anondopath-teal/10",
    ghost: "text-anondopath-blue hover:bg-anondopath-blue/10",
    white: "bg-white text-anondopath-blue shadow hover:bg-gray-100",
    "outline-white": "border border-white text-white bg-transparent hover:bg-white/10"
  };
  
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-5 py-2",
    lg: "h-12 px-6 py-3 text-lg"
  };
  
  const animateClass = animate ? "button-glow" : "";

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        animateClass,
        "transform transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
