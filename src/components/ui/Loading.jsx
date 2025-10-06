import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 5 }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary-200 to-primary-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gradient-to-r from-primary-200 to-primary-300 rounded w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-primary-100 to-primary-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;