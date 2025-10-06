import departmentsData from "@/services/mockData/departments.json";
import doctorsData from "@/services/mockData/doctors.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let departments = [...departmentsData];
const doctors = [...doctorsData];

const departmentService = {
  async getAll() {
    await delay(300);
    return departments.map(dept => ({
      ...dept,
      headDoctorName: doctors.find(d => d.Id === dept.headDoctorId)?.name || "Unknown",
      occupancyRate: Math.round((dept.occupiedBeds / dept.totalBeds) * 100)
    }));
  },

  async getById(id) {
    await delay(200);
    const department = departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  },

  async update(id, data) {
    await delay(350);
    const index = departments.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Department not found");
    }
    departments[index] = { ...departments[index], ...data };
    return { ...departments[index] };
  }
};

export default departmentService;