import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import departmentService from "@/services/api/departmentService";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patientsData, appointmentsData, departmentsData] = await Promise.all([
        patientService.getAll(),
        appointmentService.getTodayAppointments(),
        departmentService.getAll()
      ]);

      setPatients(patientsData);
      setAppointments(appointmentsData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading rows={6} />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
  const occupiedBeds = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
  const availableBeds = totalBeds - occupiedBeds;

  const todayScheduled = appointments.filter(apt => apt.status === "Scheduled").length;

  const getStatusBadge = (status) => {
    const statusMap = {
      "Scheduled": { variant: "info", icon: "Clock" },
      "Completed": { variant: "success", icon: "CheckCircle" },
      "Cancelled": { variant: "error", icon: "XCircle" }
    };
    const config = statusMap[status] || statusMap["Scheduled"];
    return (
      <Badge variant={config.variant} className="inline-flex items-center space-x-1">
        <ApperIcon name={config.icon} size={12} />
        <span>{status}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your hospital overview.</p>
        </div>
        <Button onClick={() => navigate("/patients")} className="hidden sm:inline-flex">
          <ApperIcon name="UserPlus" size={20} className="mr-2" />
          Register Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Patients"
          value={patients.length}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Today's Appointments"
          value={todayScheduled}
          icon="Calendar"
          color="info"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Available Beds"
          value={availableBeds}
          icon="Bed"
          color="success"
          trend="down"
          trendValue="-5%"
        />
        <StatCard
          title="Departments"
          value={departments.length}
          icon="Building2"
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Today's Appointments</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/appointments")}>
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          {appointments.length === 0 ? (
            <Empty 
              icon="Calendar" 
              title="No Appointments Today" 
              description="There are no scheduled appointments for today."
              action={() => navigate("/appointments")}
              actionLabel="Schedule Appointment"
            />
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 5).map((appointment) => (
                <motion.div
                  key={appointment.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-3">
                      <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600 truncate">{appointment.doctorName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-gray-900">{appointment.timeSlot}</p>
                      <p className="text-xs text-gray-600">{appointment.department}</p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Department Status</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate("/departments")}>
              View All
              <ApperIcon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="space-y-4">
            {departments.slice(0, 6).map((dept) => {
              const occupancyRate = dept.occupancyRate;
              const getOccupancyColor = () => {
                if (occupancyRate >= 90) return "from-red-500 to-red-600";
                if (occupancyRate >= 70) return "from-yellow-500 to-yellow-600";
                return "from-green-500 to-green-600";
              };

              return (
                <div key={dept.Id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{dept.name}</span>
                    <span className="text-sm text-gray-600">
                      {dept.occupiedBeds}/{dept.totalBeds}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getOccupancyColor()} transition-all duration-300 rounded-full`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate("/patients")}
              className="h-auto py-4 flex-col space-y-2"
            >
              <ApperIcon name="UserPlus" size={24} />
              <span className="text-sm">Register Patient</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/appointments")}
              className="h-auto py-4 flex-col space-y-2"
            >
              <ApperIcon name="CalendarPlus" size={24} />
              <span className="text-sm">Schedule Appointment</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/departments")}
              className="h-auto py-4 flex-col space-y-2"
            >
              <ApperIcon name="Building2" size={24} />
              <span className="text-sm">View Departments</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/reports")}
              className="h-auto py-4 flex-col space-y-2"
            >
              <ApperIcon name="FileText" size={24} />
              <span className="text-sm">Generate Report</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="bg-blue-600 rounded-full p-1.5 mt-0.5">
                <ApperIcon name="UserPlus" size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New patient registered</p>
                <p className="text-xs text-gray-600">Sarah Johnson - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="bg-green-600 rounded-full p-1.5 mt-0.5">
                <ApperIcon name="CheckCircle" size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Appointment completed</p>
                <p className="text-xs text-gray-600">John Smith - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
              <div className="bg-yellow-600 rounded-full p-1.5 mt-0.5">
                <ApperIcon name="Calendar" size={14} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Appointment scheduled</p>
                <p className="text-xs text-gray-600">Emily Davis - 5 hours ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;