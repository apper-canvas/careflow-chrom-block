import prescriptionsData from "@/services/mockData/prescriptions.json";

let prescriptions = [...prescriptionsData];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const prescriptionService = {
  async getAll() {
    await delay(800);
    return prescriptions.map((p) => ({ ...p }));
  },

  async getById(id) {
    await delay(800);
    const prescription = prescriptions.find((p) => p.Id === parseInt(id));
    if (!prescription) {
      throw new Error("Prescription not found");
    }
    return { ...prescription };
  },

  async getByPatientId(patientId) {
    await delay(800);
    return prescriptions
      .filter((p) => p.patientId === parseInt(patientId))
      .map((p) => ({ ...p }));
  },

  async create(prescriptionData) {
    await delay(800);
    const newId = prescriptions.length > 0 
      ? Math.max(...prescriptions.map((p) => p.Id)) + 1 
      : 1;

    const newPrescription = {
      ...prescriptionData,
      Id: newId,
      patientId: parseInt(prescriptionData.patientId),
      quantity: parseInt(prescriptionData.quantity),
      prescribedDate: new Date().toISOString(),
      refillDate: calculateRefillDate(
        new Date(),
        parseInt(prescriptionData.quantity),
        prescriptionData.frequency
      )
    };

    prescriptions.push(newPrescription);
    return { ...newPrescription };
  },

  async update(id, prescriptionData) {
    await delay(800);
    const index = prescriptions.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Prescription not found");
    }

    const updatedPrescription = {
      ...prescriptions[index],
      ...prescriptionData,
      Id: parseInt(id),
      patientId: parseInt(prescriptionData.patientId),
      quantity: parseInt(prescriptionData.quantity),
      refillDate: calculateRefillDate(
        new Date(prescriptions[index].prescribedDate),
        parseInt(prescriptionData.quantity),
        prescriptionData.frequency
      )
    };

    prescriptions[index] = updatedPrescription;
    return { ...updatedPrescription };
  },

  async delete(id) {
    await delay(800);
    const index = prescriptions.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Prescription not found");
    }
    prescriptions.splice(index, 1);
    return { success: true };
  }
};

function calculateRefillDate(prescribedDate, quantity, frequency) {
  const daysSupply = calculateDaysSupply(quantity, frequency);
  const refillDate = new Date(prescribedDate);
  refillDate.setDate(refillDate.getDate() + daysSupply);
  return refillDate.toISOString();
}

function calculateDaysSupply(quantity, frequency) {
  const freqLower = frequency.toLowerCase();
  if (freqLower.includes("once")) return quantity;
  if (freqLower.includes("twice")) return Math.floor(quantity / 2);
  if (freqLower.includes("three")) return Math.floor(quantity / 3);
  if (freqLower.includes("four")) return Math.floor(quantity / 4);
  return quantity;
}

export default prescriptionService;