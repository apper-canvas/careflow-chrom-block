import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import appointmentService from "@/services/api/appointmentService";
import patientService from "@/services/api/patientService";
import doctorService from "@/services/api/doctorService";

const AppointmentFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    patientId: "",
    department: "General Medicine",
    doctorId: "",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "09:00 AM",
    reason: "",
    notes: ""
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.department) {
      loadDoctorsByDepartment(formData.department);
    }
  }, [formData.department]);

  useEffect(() => {
    if (formData.doctorId) {
      const doctor = doctors.find(d => d.Id === parseInt(formData.doctorId));
      if (doctor) {
        setAvailableSlots(doctor.availableSlots || []);
      }
    }
  }, [formData.doctorId, doctors]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const patientsData = await patientService.getAll();
      setPatients(patientsData);
    } catch (err) {
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const loadDoctorsByDepartment = async (department) => {
    try {
      const doctorsData = await doctorService.getByDepartment(department);
      setDoctors(doctorsData);
      if (doctorsData.length > 0) {
        setFormData(prev => ({ ...prev, doctorId: doctorsData[0].Id.toString() }));
      }
    } catch (err) {
      toast.error("Failed to load doctors");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.doctorId) newErrors.doctorId = "Doctor is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";
    if (!formData.reason.trim()) newErrors.reason = "Reason is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const appointmentData = {
        ...formData,
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId)
      };

      await appointmentService.create(appointmentData);
      toast.success("Appointment scheduled successfully");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to schedule appointment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="patientId" className="block text-sm font-medium text-gray-700">
                  Patient <span className="text-red-500">*</span>
                </label>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select patient</option>
                  {patients.map(patient => (
                    <option key={patient.Id} value={patient.Id}>
                      {patient.firstName} {patient.lastName}
                    </option>
                  ))}
                </select>
                {errors.patientId && (
                  <p className="text-sm text-red-600">{errors.patientId}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Obstetrics">Obstetrics</option>
                  <option value="Pulmonology">Pulmonology</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={doctors.length === 0}
                >
                  <option value="">Select doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.Id} value={doctor.Id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p className="text-sm text-red-600">{errors.doctorId}</p>
                )}
              </div>

              <FormField
                label="Date"
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                required
              />

              <div className="space-y-2">
                <label htmlFor="timeSlot" className="block text-sm font-medium text-gray-700">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <select
                  id="timeSlot"
                  name="timeSlot"
                  value={formData.timeSlot}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={availableSlots.length === 0}
                >
                  <option value="">Select time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {errors.timeSlot && (
                  <p className="text-sm text-red-600">{errors.timeSlot}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Visit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Regular checkup, Follow-up consultation"
              />
              {errors.reason && (
                <p className="text-sm text-red-600">{errors.reason}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Additional notes or comments..."
              ></textarea>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || loading}>
                {submitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppointmentFormModal;