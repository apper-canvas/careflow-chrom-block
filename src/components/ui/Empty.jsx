import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Inbox", 
  title = "No Data Found", 
  description = "There's nothing to display here yet.", 
  action,
  actionLabel = "Add New",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-full p-8 mb-4">
        <ApperIcon name={icon} className="w-16 h-16 text-primary-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={20} />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;