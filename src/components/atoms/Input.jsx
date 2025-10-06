import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  type = "text", 
  className, 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:bg-gray-100 disabled:cursor-not-allowed",
        error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;