import patientsData from "@/services/mockData/patients.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let patients = [...patientsData];

const patientService = {
  async getAll() {
    await delay(300);
    return [...patients];
  },

  async getById(id) {
    await delay(200);
    const patient = patients.find(p => p.Id === parseInt(id));
    if (!patient) {
      throw new Error("Patient not found");
    }
    return { ...patient };
  },

  async create(patient) {
    await delay(400);
    const maxId = patients.reduce((max, p) => Math.max(max, p.Id), 0);
    const newPatient = {
      ...patient,
      Id: maxId + 1,
      status: "Active"
    };
    patients.push(newPatient);
    return { ...newPatient };
  },

  async update(id, data) {
    await delay(350);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients[index] = { ...patients[index], ...data };
    return { ...patients[index] };
  },

  async delete(id) {
    await delay(300);
    const index = patients.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Patient not found");
    }
    patients.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(250);
    const lowerQuery = query.toLowerCase();
    return patients.filter(p => 
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.email.toLowerCase().includes(lowerQuery) ||
      p.phone.includes(query)
    );
  }
};

export default patientService;