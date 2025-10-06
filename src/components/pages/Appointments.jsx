import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import DataTable from "@/components/molecules/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import AppointmentFormModal from "@/components/organisms/AppointmentFormModal";
import appointmentService from "@/services/api/appointmentService";
import { format } from "date-fns";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await appointmentService.update(id, { status });
      toast.success(`Appointment ${status.toLowerCase()} successfully`);
      loadAppointments();
    } catch (err) {
      toast.error(err.message || "Failed to update appointment");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await appointmentService.delete(id);
      toast.success("Appointment cancelled successfully");
      loadAppointments();
    } catch (err) {
      toast.error(err.message || "Failed to cancel appointment");
    }
  };

  const filteredAppointments = filterStatus === "all" 
    ? appointments 
    : appointments.filter(apt => apt.status === filterStatus);

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

  const columns = [
    {
      header: "Patient",
      accessor: "patientName",
      render: (appointment) => (
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-full p-2">
            <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{appointment.patientName}</p>
          </div>
        </div>
      )
    },
    {
      header: "Doctor",
      accessor: "doctorName",
      render: (appointment) => (
        <span className="text-sm text-gray-900">{appointment.doctorName}</span>
      )
    },
    {
      header: "Department",
      accessor: "department",
      render: (appointment) => (
        <Badge variant="primary">{appointment.department}</Badge>
      )
    },
    {
      header: "Date & Time",
      accessor: "date",
      render: (appointment) => (
        <div>
          <p className="text-sm text-gray-900">{format(new Date(appointment.date), "MMM dd, yyyy")}</p>
          <p className="text-xs text-gray-600">{appointment.timeSlot}</p>
        </div>
      )
    },
    {
      header: "Reason",
      accessor: "reason",
      render: (appointment) => (
        <span className="text-sm text-gray-700">{appointment.reason}</span>
      )
    },
    {
      header: "Status",
      accessor: "status",
      render: (appointment) => getStatusBadge(appointment.status)
    }
  ];

  if (loading) return <Loading rows={8} />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and schedule patient appointments</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <ApperIcon name="CalendarPlus" size={20} className="mr-2" />
          Schedule Appointment
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button
            variant={filterStatus === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Button>
          <Button
            variant={filterStatus === "Scheduled" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("Scheduled")}
          >
            Scheduled
          </Button>
          <Button
            variant={filterStatus === "Completed" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("Completed")}
          >
            Completed
          </Button>
          <Button
            variant={filterStatus === "Cancelled" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("Cancelled")}
          >
            Cancelled
          </Button>
        </div>

        {filteredAppointments.length === 0 ? (
          <Empty 
            icon="Calendar" 
            title="No Appointments Found" 
            description="Start by scheduling your first appointment."
            action={() => setShowModal(true)}
            actionLabel="Schedule First Appointment"
          />
        ) : (
          <DataTable
            columns={columns}
            data={filteredAppointments}
            actions={(appointment) => (
              <>
                {appointment.status === "Scheduled" && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateStatus(appointment.Id, "Completed")}
                    >
                      <ApperIcon name="CheckCircle" size={16} className="text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(appointment.Id)}
                    >
                      <ApperIcon name="XCircle" size={16} className="text-red-600" />
                    </Button>
                  </>
                )}
              </>
            )}
          />
        )}
      </Card>

      {showModal && (
        <AppointmentFormModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadAppointments();
          }}
        />
      )}
    </div>
  );
};

export default Appointments;