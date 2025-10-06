import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg shadow-md border border-gray-100",
        hover && "transition-all duration-200 hover:shadow-xl hover:-translate-y-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;