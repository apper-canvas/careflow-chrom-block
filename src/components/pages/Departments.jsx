import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import departmentService from "@/services/api/departmentService";
import { cn } from "@/utils/cn";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  if (loading) return <Loading rows={6} />;
  if (error) return <Error message={error} onRetry={loadDepartments} />;

  const getOccupancyColor = (rate) => {
    if (rate >= 90) return "danger";
    if (rate >= 70) return "warning";
    return "success";
  };

  const getOccupancyGradient = (rate) => {
    if (rate >= 90) return "from-red-500 to-red-600";
    if (rate >= 70) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
        <p className="text-gray-600 mt-1">Monitor department capacity and bed availability</p>
      </div>

      {departments.length === 0 ? (
        <Empty 
          icon="Building2" 
          title="No Departments Found" 
          description="Department information is currently unavailable."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <motion.div
              key={dept.Id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Card hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-3">
                      <ApperIcon name="Building2" className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">Floor {dept.floor}</p>
                    </div>
                  </div>
                  <Badge variant={getOccupancyColor(dept.occupancyRate)}>
                    {dept.occupancyRate}%
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Bed Occupancy</span>
                      <span className="font-semibold text-gray-900">
                        {dept.occupiedBeds}/{dept.totalBeds}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={cn(
                          "h-full bg-gradient-to-r transition-all duration-500 rounded-full",
                          getOccupancyGradient(dept.occupancyRate)
                        )}
                        style={{ width: `${dept.occupancyRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="UserCheck" size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">Head Doctor</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{dept.headDoctorName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Available</p>
                      <p className="text-xl font-bold text-green-700">
                        {dept.totalBeds - dept.occupiedBeds}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Occupied</p>
                      <p className="text-xl font-bold text-blue-700">{dept.occupiedBeds}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Departments;