import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    danger: "from-red-500 to-red-600",
    info: "from-blue-500 to-blue-600"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16}
                className={cn(
                  "transition-colors",
                  trend === "up" ? "text-green-600" : "text-red-600"
                )}
              />
              <span className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : "text-red-600"
              )}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg bg-gradient-to-br shadow-md",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;