import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import prescriptionService from "@/services/api/prescriptionService";

const PrescriptionFormModal = ({ patientId, prescription, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    medicationName: prescription?.medicationName || "",
    dosage: prescription?.dosage || "",
    frequency: prescription?.frequency || "Once daily",
    quantity: prescription?.quantity || "",
    prescribingDoctor: prescription?.prescribingDoctor || "",
    notes: prescription?.notes || ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every other day",
    "As needed"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.medicationName.trim()) {
      newErrors.medicationName = "Medication name is required";
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = "Dosage is required";
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0";
    }

    if (!formData.prescribingDoctor.trim()) {
      newErrors.prescribingDoctor = "Prescribing doctor is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const prescriptionData = {
        ...formData,
        patientId: parseInt(patientId),
        quantity: parseInt(formData.quantity)
      };

      if (prescription) {
        await prescriptionService.update(prescription.Id, prescriptionData);
        toast.success("Prescription updated successfully");
      } else {
        await prescriptionService.create(prescriptionData);
        toast.success("Prescription created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to save prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg p-2">
                <ApperIcon name="Pill" className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {prescription ? "Edit Prescription" : "New Prescription"}
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              <ApperIcon name="X" size={20} className="text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FormField
                  label="Medication Name"
                  id="medicationName"
                  name="medicationName"
                  type="text"
                  value={formData.medicationName}
                  onChange={handleChange}
                  error={errors.medicationName}
                  placeholder="e.g., Lisinopril, Metformin"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <FormField
                label="Dosage"
                id="dosage"
                name="dosage"
                type="text"
                value={formData.dosage}
                onChange={handleChange}
                error={errors.dosage}
                placeholder="e.g., 10mg, 500mg"
                required
                disabled={isSubmitting}
              />

              <div>
                <label
                  htmlFor="frequency"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  {frequencyOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Quantity"
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
                placeholder="Number of pills/units"
                required
                min="1"
                disabled={isSubmitting}
              />

              <FormField
                label="Prescribing Doctor"
                id="prescribingDoctor"
                name="prescribingDoctor"
                type="text"
                value={formData.prescribingDoctor}
                onChange={handleChange}
                error={errors.prescribingDoctor}
                placeholder="e.g., Dr. Sarah Wilson"
                required
                disabled={isSubmitting}
              />

              <div className="md:col-span-2">
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Additional instructions or notes"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <ApperIcon name="Info" size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  The refill date will be automatically calculated based on the quantity and frequency. 
                  You'll receive a reminder when the prescription is due for refill.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <ApperIcon
                      name="Loader2"
                      size={20}
                      className="mr-2 animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={20} className="mr-2" />
                    {prescription ? "Update Prescription" : "Create Prescription"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PrescriptionFormModal;