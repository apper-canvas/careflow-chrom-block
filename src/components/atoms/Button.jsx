import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  className,
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
    secondary: "bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed",
    danger: "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;