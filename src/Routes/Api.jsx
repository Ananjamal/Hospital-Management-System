import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api/",
});

// Set up an interceptor to add the token to the request headers
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo); // Parse the stringified JSON object
      const token = parsedUserInfo.token; // Access the token
      // console.log("token", token);
      
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`; // Add token to Authorization header
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Authentication API Functions
export const loginAPI = (credentials) =>
  api.post(`/auth/login`, credentials);

export const registerAPI = (userData) =>
  api.post(`/auth/register`, userData);

export const logoutAPI = () => api.post(`/auth/logout`);

// Users API Functions
export const getUsersAPI = async () => {
  return await api.get(`/users`);
};

export const addUserAPI = async (user) => {
  return await api.post(`/users`, user);
};

export const updateUserAPI = async (id, user) => {
  return await api.put(`/users/${id}`, user);
};

export const deleteUserAPI = async (id) => {
  return await api.delete(`/users/${id}`);
};


// Attachments API Functions
export const getAttachmentsAPI = async () => {
  return await api.get(`/attachments`);
};
export const fetchPatientAttachmentsAPI = async (id) => {
  return await api.get(`/attachments/${id}`);
};

export const addAttachmentAPI = async (attachment) => {
  return await api.post(`/attachments`, attachment);
};

export const updateAttachmentAPI = async (id, attachment) => {
  return await api.put(`/attachments/${id}`, attachment);
};

export const deleteAttachmentAPI = async (id) => {
  return await api.delete(`/attachments/${id}`);
};

// Doctors API Functions
export const getDoctorsAPI = async (
  limit,
  skip,
  searchField,
  value,
  sorter,
  order,
  filters
) => {
  const data = { limit, skip, searchField, value, sorter, order, filters };
  return await api.post(`/doctors/fetch`, data);
};

export const addDoctorAPI = async (doctor) => {
  return await api.post(`/doctors`, doctor);
};

export const updateDoctorAPI = async (id, doctor) => {
  return await api.put(`/doctors/${id}`, doctor);
};

export const deleteDoctorAPI = async (id) => {
  return await api.delete(`/doctors/${id}`);
};

export const searchDoctorAPI = async (field, value) => {
  return await api.get(`/doctors?field=${field}&value=${value}`);
};

export const sortDoctorAPI = async (field, order) => {
  return await api.get(`/doctors?field=${field}&order=${order}`);
};

// Patients API Functions
export const getPatientsAPI = async () => {
  return await api.get(`/patients`);
};

export const addPatientAPI = async (patient) => {
  return await api.post(`/patients`, patient);
};

export const updatePatientAPI = async (id, patient) => {
  return await api.put(`/patients/${id}`, patient);
};

export const deletePatientAPI = async (id) => {
  return await api.delete(`/patients/${id}`);
};

// Employees API Functions
export const getEmployeesAPI = async () => {
  return await api.get(`/employees`);
};

export const addEmployeeAPI = async (employee) => {
  return await api.post(`/employees`, employee);
};

export const updateEmployeeAPI = async (id, employee) => {
  return await api.put(`/employees/${id}`, employee);
};

export const deleteEmployeeAPI = async (id) => {
  return await api.delete(`/employees/${id}`);
};

export const searchEmployeeAPI = async (field, value) => {
  return await api.get(`/employees/search?field=${field}&value=${value}`);
};

export const sortEmployeeAPI = async (field, order) => {
  return await api.get(`/employees?field=${field}&order=${order}`);
};

// Departments API Functions
export const getDepartmentsAPI = async () => {
  return await api.get(`/departments`);
};

export const addDepartmentAPI = async (department) => {
  return await api.post(`/departments`, department);
};

export const updateDepartmentAPI = async (id, department) => {
  return await api.put(`/departments/${id}`, department);
};

export const deleteDepartmentAPI = async (id) => {
  return await api.delete(`/departments/${id}`);
};

export const searchDepartmentAPI = async (field, value) => {
  return await api.get(`/departments/search?field=${field}&value=${value}`);
};

export const sortDepartmentAPI = async (field, order) => {
  return await api.get(`/departments?field=${field}&order=${order}`);
};

// Appointments API Functions
export const getAppointmentsAPI = async () => {
  return await api.get(`/appointments`);
};

export const addAppointmentAPI = async (appointment) => {
  return await api.post(`/appointments`, appointment);
};

export const updateAppointmentAPI = async (id, appointment) => {
  return await api.put(`/appointments/${id}`, appointment);
};

export const deleteAppointmentAPI = async (id) => {
  return await api.delete(`/appointments/${id}`);
};

export const searchAppointmentAPI = async (field, value) => {
  return await api.get(`/appointments/search?field=${field}&value=${value}`);
};

export const sortAppointmentAPI = async (field, order) => {
  return await api.get(`/appointments?field=${field}&order=${order}`);
};
