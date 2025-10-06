import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import patientService from "@/services/api/patientService";

const PatientFormModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    bloodGroup: "A+",
    allergies: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    medicalHistory: "",
    currentDepartment: "General Medicine",
    admissionDate: new Date().toISOString().split("T")[0]
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContactPhone.trim()) newErrors.emergencyContactPhone = "Emergency contact phone is required";

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
      const patientData = {
        ...formData,
        allergies: formData.allergies ? formData.allergies.split(",").map(a => a.trim()) : [],
        emergencyContact: {
          name: formData.emergencyContactName,
          relationship: formData.emergencyContactRelationship,
          phone: formData.emergencyContactPhone
        }
      };

      delete patientData.emergencyContactName;
      delete patientData.emergencyContactRelationship;
      delete patientData.emergencyContactPhone;

      await patientService.create(patientData);
      toast.success("Patient registered successfully");
      onSuccess();
    } catch (err) {
      toast.error(err.message || "Failed to register patient");
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
          className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-gray-900">Register New Patient</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                  required
                />
                <FormField
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                  required
                />
                <FormField
                  label="Date of Birth"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  required
                />
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Phone"
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                <FormField
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
              </div>
              <div className="mt-4">
                <FormField
                  label="Address"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                  required
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <FormField
                  label="Allergies (comma-separated)"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  placeholder="e.g., Penicillin, Peanuts"
                />
                <div className="space-y-2">
                  <label htmlFor="currentDepartment" className="block text-sm font-medium text-gray-700">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="currentDepartment"
                    name="currentDepartment"
                    value={formData.currentDepartment}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Obstetrics">Obstetrics</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                <FormField
                  label="Admission Date"
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mt-4 space-y-2">
                <label htmlFor="medicalHistory" className="block text-sm font-medium text-gray-700">
                  Medical History
                </label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter medical history..."
                ></textarea>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Name"
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  error={errors.emergencyContactName}
                  required
                />
                <FormField
                  label="Relationship"
                  id="emergencyContactRelationship"
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleChange}
                  placeholder="e.g., Spouse, Parent"
                />
                <FormField
                  label="Phone"
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  error={errors.emergencyContactPhone}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Registering..." : "Register Patient"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PatientFormModal;