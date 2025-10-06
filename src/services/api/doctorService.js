import doctorsData from "@/services/mockData/doctors.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let doctors = [...doctorsData];

const doctorService = {
  async getAll() {
    await delay(250);
    return [...doctors];
  },

  async getById(id) {
    await delay(200);
    const doctor = doctors.find(d => d.Id === parseInt(id));
    if (!doctor) {
      throw new Error("Doctor not found");
    }
    return { ...doctor };
  },

  async getByDepartment(department) {
    await delay(250);
    return doctors.filter(d => d.department === department);
  }
};

export default doctorService;