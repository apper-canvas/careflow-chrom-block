import appointmentsData from "@/services/mockData/appointments.json";
import doctorsData from "@/services/mockData/doctors.json";
import patientsData from "@/services/mockData/patients.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let appointments = [...appointmentsData];
const doctors = [...doctorsData];
const patients = [...patientsData];

const appointmentService = {
  async getAll() {
    await delay(300);
    return appointments.map(apt => ({
      ...apt,
      doctorName: doctors.find(d => d.Id === apt.doctorId)?.name || "Unknown",
      patientName: (() => {
        const patient = patients.find(p => p.Id === apt.patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
      })()
    }));
  },

  async getById(id) {
    await delay(200);
    const appointment = appointments.find(a => a.Id === parseInt(id));
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    return { ...appointment };
  },

  async getByPatientId(patientId) {
    await delay(250);
    return appointments
      .filter(a => a.patientId === parseInt(patientId))
      .map(apt => ({
        ...apt,
        doctorName: doctors.find(d => d.Id === apt.doctorId)?.name || "Unknown"
      }));
  },

  async getTodayAppointments() {
    await delay(250);
    const today = new Date().toISOString().split("T")[0];
    return appointments
      .filter(a => a.date === today)
      .map(apt => ({
        ...apt,
        doctorName: doctors.find(d => d.Id === apt.doctorId)?.name || "Unknown",
        patientName: (() => {
          const patient = patients.find(p => p.Id === apt.patientId);
          return patient ? `${patient.firstName} ${patient.lastName}` : "Unknown";
        })()
      }));
  },

  async create(appointment) {
    await delay(400);
    const maxId = appointments.reduce((max, a) => Math.max(max, a.Id), 0);
    const newAppointment = {
      ...appointment,
      Id: maxId + 1,
      status: "Scheduled"
    };
    appointments.push(newAppointment);
    return { ...newAppointment };
  },

  async update(id, data) {
    await delay(350);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointments[index] = { ...appointments[index], ...data };
    return { ...appointments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = appointments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Appointment not found");
    }
    appointments.splice(index, 1);
    return { success: true };
  }
};

export default appointmentService;