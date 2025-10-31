import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PrescriptionFormModal from "@/components/organisms/PrescriptionFormModal";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import patientService from "@/services/api/patientService";
import appointmentService from "@/services/api/appointmentService";
import prescriptionService from "@/services/api/prescriptionService";
import { format, isWithinInterval, addDays } from "date-fns";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [prescriptions, setPrescriptions] = useState([]);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
const loadPatientData = async () => {
    try {
      setLoading(true);
      setError("");
      const [patientData, appointmentsData, prescriptionsData] = await Promise.all([
        patientService.getById(id),
        appointmentService.getByPatientId(id),
        prescriptionService.getByPatientId(id)
      ]);
      setPatient(patientData);
      setAppointments(appointmentsData);
      setPrescriptions(prescriptionsData);
    } catch (err) {
      setError(err.message || "Failed to load patient details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatientData();
  }, [id]);
  if (loading) return <Loading rows={8} />;
  if (error) return <Error message={error} onRetry={loadPatientData} />;
  if (!patient) return <Error message="Patient not found" />;

const tabs = [
    { id: "info", label: "Patient Information", icon: "User" },
    { id: "appointments", label: "Appointments", icon: "Calendar" },
    { id: "prescriptions", label: "Prescriptions", icon: "Pill" },
    { id: "history", label: "Medical History", icon: "FileText" }
  ];

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    try {
      await prescriptionService.delete(prescriptionId);
      setPrescriptions((prev) => prev.filter((p) => p.Id !== prescriptionId));
      toast.success("Prescription deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete prescription");
    }
  };

  const handleEditPrescription = (prescription) => {
    setEditingPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionSuccess = () => {
    loadPatientData();
  };

  const isRefillDueSoon = (refillDate) => {
    try {
      const refill = new Date(refillDate);
      const today = new Date();
      const sevenDaysFromNow = addDays(today, 7);
      return isWithinInterval(refill, { start: today, end: sevenDaysFromNow });
    } catch {
      return false;
    }
  };

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
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate("/patients")}>
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-start space-x-4">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-full p-4">
              <ApperIcon name="User" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-gray-600">{patient.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={patient.status === "Active" ? "success" : "warning"}>
                  {patient.status}
                </Badge>
                <Badge variant="primary">{patient.bloodGroup}</Badge>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/appointments")}>
            <ApperIcon name="CalendarPlus" size={20} className="mr-2" />
            Schedule Appointment
          </Button>
        </div>

        <div className="flex space-x-1 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <ApperIcon name={tab.icon} size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "info" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <InfoRow label="Date of Birth" value={format(new Date(patient.dateOfBirth), "MMMM dd, yyyy")} />
                <InfoRow label="Gender" value={patient.gender} />
                <InfoRow label="Phone" value={patient.phone} />
                <InfoRow label="Email" value={patient.email} />
                <InfoRow label="Address" value={patient.address} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="space-y-3">
                <InfoRow label="Blood Group" value={patient.bloodGroup} />
                <InfoRow label="Current Department" value={patient.currentDepartment} />
                <InfoRow label="Admission Date" value={format(new Date(patient.admissionDate), "MMMM dd, yyyy")} />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies && patient.allergies.length > 0 ? (
                      patient.allergies.map((allergy, index) => (
                        <Badge key={index} variant="warning">{allergy}</Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No known allergies</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InfoRow label="Name" value={patient.emergencyContact?.name} />
                  <InfoRow label="Relationship" value={patient.emergencyContact?.relationship} />
                  <InfoRow label="Phone" value={patient.emergencyContact?.phone} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "appointments" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="Calendar" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments found for this patient</p>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.Id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100"
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-3">
                      <ApperIcon name="Calendar" className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.reason}</p>
                      <p className="text-sm text-gray-600">{appointment.doctorName} - {appointment.department}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(appointment.date), "MMMM dd, yyyy")} at {appointment.timeSlot}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <p className="text-gray-700">{patient.medicalHistory || "No medical history recorded"}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notes</h3>
              <div className="space-y-3">
                {appointments
                  .filter(apt => apt.notes)
                  .slice(0, 5)
                  .map((appointment) => (
                    <div
                      key={appointment.Id}
                      className="bg-white rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {format(new Date(appointment.date), "MMMM dd, yyyy")}
                        </span>
                        <Badge variant="primary">{appointment.department}</Badge>
                      </div>
                      <p className="text-sm text-gray-700">{appointment.notes}</p>
                      <p className="text-xs text-gray-500 mt-2">{appointment.doctorName}</p>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
)}

        {activeTab === "prescriptions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Active Prescriptions
              </h3>
              <Button
                onClick={() => {
                  setEditingPrescription(null);
                  setShowPrescriptionModal(true);
                }}
              >
                <ApperIcon name="Plus" size={20} className="mr-2" />
                Add Prescription
              </Button>
            </div>

            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Pill" size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Prescriptions
                </h3>
                <p className="text-gray-600 mb-4">
                  This patient has no active prescriptions
                </p>
                <Button
                  onClick={() => {
                    setEditingPrescription(null);
                    setShowPrescriptionModal(true);
                  }}
                >
                  <ApperIcon name="Plus" size={20} className="mr-2" />
                  Add First Prescription
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.Id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {prescription.medicationName}
                          </h4>
                          {isRefillDueSoon(prescription.refillDate) && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <ApperIcon
                                name="AlertCircle"
                                size={14}
                                className="mr-1"
                              />
                              Refill Due Soon
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Dosage:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {prescription.dosage}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Frequency:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {prescription.frequency}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Quantity:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {prescription.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Refill Date:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {format(
                                new Date(prescription.refillDate),
                                "MMM d, yyyy"
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-sm mb-2">
                            <span className="text-gray-600">Prescribed by:</span>
                            <span className="ml-2 font-medium text-gray-900">
                              {prescription.prescribingDoctor}
                            </span>
                          </div>
                          {prescription.notes && (
                            <div className="text-sm">
                              <span className="text-gray-600">Notes:</span>
                              <p className="mt-1 text-gray-700">
                                {prescription.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditPrescription(prescription)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit prescription"
                        >
                          <ApperIcon name="Edit" size={18} />
                        </button>
                        <button
                          onClick={() => handleDeletePrescription(prescription.Id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete prescription"
                        >
                          <ApperIcon name="Trash2" size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {showPrescriptionModal && (
        <PrescriptionFormModal
          patientId={id}
          prescription={editingPrescription}
          onClose={() => {
            setShowPrescriptionModal(false);
            setEditingPrescription(null);
          }}
          onSuccess={handlePrescriptionSuccess}
        />
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
    <p className="text-sm text-gray-900">{value || "N/A"}</p>
  </div>
);

export default PatientDetail;