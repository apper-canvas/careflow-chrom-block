import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-6 mb-4">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Occurred</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;