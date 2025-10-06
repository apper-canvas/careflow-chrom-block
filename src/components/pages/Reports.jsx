import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import departmentService from "@/services/api/departmentService";

const Reports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [patients, appointments, departments] = await Promise.all([
        patientService.getAll(),
        appointmentService.getAll(),
        departmentService.getAll()
      ]);

      const scheduledAppointments = appointments.filter(apt => apt.status === "Scheduled").length;
      const completedAppointments = appointments.filter(apt => apt.status === "Completed").length;
      const cancelledAppointments = appointments.filter(apt => apt.status === "Cancelled").length;

      const totalBeds = departments.reduce((sum, dept) => sum + dept.totalBeds, 0);
      const occupiedBeds = departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0);
      const availableBeds = totalBeds - occupiedBeds;

      setData({
        patients,
        appointments,
        departments,
        stats: {
          totalPatients: patients.length,
          activePatients: patients.filter(p => p.status === "Active").length,
          totalAppointments: appointments.length,
          scheduledAppointments,
          completedAppointments,
          cancelledAppointments,
          totalBeds,
          occupiedBeds,
          availableBeds,
          totalDepartments: departments.length
        }
      });
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  if (loading) return <Loading rows={8} />;
  if (error) return <Error message={error} onRetry={loadReportData} />;

  const reportSections = [
    {
      title: "Patient Statistics",
      icon: "Users",
      color: "from-blue-500 to-blue-600",
      metrics: [
        { label: "Total Patients", value: data.stats.totalPatients },
        { label: "Active Patients", value: data.stats.activePatients }
      ]
    },
    {
      title: "Appointment Statistics",
      icon: "Calendar",
      color: "from-green-500 to-green-600",
      metrics: [
        { label: "Total Appointments", value: data.stats.totalAppointments },
        { label: "Scheduled", value: data.stats.scheduledAppointments },
        { label: "Completed", value: data.stats.completedAppointments },
        { label: "Cancelled", value: data.stats.cancelledAppointments }
      ]
    },
    {
      title: "Bed Capacity",
      icon: "Bed",
      color: "from-purple-500 to-purple-600",
      metrics: [
        { label: "Total Beds", value: data.stats.totalBeds },
        { label: "Occupied", value: data.stats.occupiedBeds },
        { label: "Available", value: data.stats.availableBeds },
        { label: "Occupancy Rate", value: `${Math.round((data.stats.occupiedBeds / data.stats.totalBeds) * 100)}%` }
      ]
    },
    {
      title: "Department Overview",
      icon: "Building2",
      color: "from-orange-500 to-orange-600",
      metrics: [
        { label: "Total Departments", value: data.stats.totalDepartments }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive hospital statistics and analytics</p>
        </div>
        <Button>
          <ApperIcon name="Download" size={20} className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reportSections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`bg-gradient-to-br ${section.color} rounded-lg p-3 shadow-md`}>
                  <ApperIcon name={section.icon} className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {section.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Department Performance</h2>
        <div className="space-y-4">
          {data.departments.map((dept) => (
            <div key={dept.Id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-3">
                  <ApperIcon name="Building2" className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{dept.name}</p>
                  <p className="text-sm text-gray-600">Floor {dept.floor} • {dept.headDoctorName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{dept.occupiedBeds}/{dept.totalBeds} beds</p>
                <p className="text-sm text-gray-600">{dept.occupancyRate}% occupancy</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;