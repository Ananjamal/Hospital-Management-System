import {
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
  ADD_USER_REQUEST,
  ADD_USER_SUCCESS,
  ADD_USER_FAILURE,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILURE,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILURE,
  ///////////
  FETCH_DOCTOR_REQUEST,
  FETCH_DOCTOR_SUCCESS,
  FETCH_DOCTOR_FAILURE,
  ADD_DOCTOR_REQUEST,
  ADD_DOCTOR_SUCCESS,
  ADD_DOCTOR_FAILURE,
  UPDATE_DOCTOR_REQUEST,
  UPDATE_DOCTOR_SUCCESS,
  UPDATE_DOCTOR_FAILURE,
  DELETE_DOCTOR_REQUEST,
  DELETE_DOCTOR_SUCCESS,
  DELETE_DOCTOR_FAILURE,
  /////////////
  FETCH_PATIENT_REQUEST,
  FETCH_PATIENT_SUCCESS,
  FETCH_PATIENT_FAILURE,
  ADD_PATIENT_REQUEST,
  ADD_PATIENT_SUCCESS,
  ADD_PATIENT_FAILURE,
  UPDATE_PATIENT_REQUEST,
  UPDATE_PATIENT_SUCCESS,
  UPDATE_PATIENT_FAILURE,
  DELETE_PATIENT_REQUEST,
  DELETE_PATIENT_SUCCESS,
  DELETE_PATIENT_FAILURE,
  /////////////
  FETCH_APPOINTMENT_REQUEST,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_APPOINTMENT_FAILURE,
  ADD_APPOINTMENT_REQUEST,
  ADD_APPOINTMENT_SUCCESS,
  ADD_APPOINTMENT_FAILURE,
  UPDATE_APPOINTMENT_REQUEST,
  UPDATE_APPOINTMENT_SUCCESS,
  UPDATE_APPOINTMENT_FAILURE,
  DELETE_APPOINTMENT_REQUEST,
  DELETE_APPOINTMENT_SUCCESS,
  DELETE_APPOINTMENT_FAILURE,
  //////////////////
  FETCH_DEPARTMENT_REQUEST,
  FETCH_DEPARTMENT_SUCCESS,
  FETCH_DEPARTMENT_FAILURE,
  ADD_DEPARTMENT_REQUEST,
  ADD_DEPARTMENT_SUCCESS,
  ADD_DEPARTMENT_FAILURE,
  UPDATE_DEPARTMENT_REQUEST,
  UPDATE_DEPARTMENT_SUCCESS,
  UPDATE_DEPARTMENT_FAILURE,
  DELETE_DEPARTMENT_REQUEST,
  DELETE_DEPARTMENT_SUCCESS,
  DELETE_DEPARTMENT_FAILURE,
  ///////////////
  FETCH_EMPLOYEE_REQUEST,
  FETCH_EMPLOYEE_SUCCESS,
  FETCH_EMPLOYEE_FAILURE,
  ADD_EMPLOYEE_REQUEST,
  ADD_EMPLOYEE_SUCCESS,
  ADD_EMPLOYEE_FAILURE,
  UPDATE_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_SUCCESS,
  UPDATE_EMPLOYEE_FAILURE,
  DELETE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_SUCCESS,
  DELETE_EMPLOYEE_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  /////
  FETCH_ATTACHMENT_REQUEST,
  FETCH_ATTACHMENT_SUCCESS,
  FETCH_ATTACHMENT_FAILURE,
  ADD_ATTACHMENT_REQUEST,
  ADD_ATTACHMENT_SUCCESS,
  ADD_ATTACHMENT_FAILURE,
  UPDATE_ATTACHMENT_REQUEST,
  UPDATE_ATTACHMENT_SUCCESS,
  UPDATE_ATTACHMENT_FAILURE,
  DELETE_ATTACHMENT_REQUEST,
  DELETE_ATTACHMENT_SUCCESS,
  DELETE_ATTACHMENT_FAILURE,
  FETCH_PATIENT_ATTACHMENTS_REQUEST,
  FETCH_PATIENT_ATTACHMENTS_SUCCESS,
  FETCH_PATIENT_ATTACHMENTS_FAILURE,
} from "./Types";

// Login Actions
export const loginRequest = (credentials, navigate) => {
  return {
    type: LOGIN_REQUEST,
    payload: { credentials, navigate },
  };
};
export const loginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});
export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error,
});
export const logoutRequest = (payload) => ({
  type: LOGOUT_REQUEST,
  payload,
});

export const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

export const logoutFailure = (error) => ({
  type: LOGOUT_FAILURE,
  error,
});

// Register Actions
export const registerRequest = (userData, navigate) => ({
  type: REGISTER_REQUEST,
  payload: { userData, navigate },
});

export const registerSuccess = (user) => ({
  type: REGISTER_SUCCESS,
  payload: user,
});

export const registerFailure = (error) => ({
  type: REGISTER_FAILURE,
  payload: error,
});
////////////
export const fetchUsers = () => ({ type: FETCH_USER_REQUEST });

export const fetchUsersSuccess = (users) => ({
  type: FETCH_USER_SUCCESS,
  payload: users,
});
export const fetchUsersFailure = (error) => ({
  type: FETCH_USER_FAILURE,
  payload: error,
});

// Action creators for adding a user
export const addUser = (user) => ({ type: ADD_USER_REQUEST, payload: user });
export const addUserSuccess = (user) => ({
  type: ADD_USER_SUCCESS,
  payload: user,
});
export const addUserFailure = (error) => ({
  type: ADD_USER_FAILURE,
  payload: error,
});

// Action creators for updating a user
export const updateUser = (id, user) => ({
  type: UPDATE_USER_REQUEST,
  payload: { id, user },
});
export const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user,
});

export const updateUserFailure = (error) => ({
  type: UPDATE_USER_FAILURE,
  payload: error,
});

// Action creators for deleting a user
export const deleteUser = (id) => ({
  type: DELETE_USER_REQUEST,
  payload: id,
});
export const deleteUserSuccess = (id) => ({
  type: DELETE_USER_SUCCESS,
  payload: id,
});
export const deleteUserFailure = (error) => ({
  type: DELETE_USER_FAILURE,
  payload: error,
});

// Fetch doctors
export const fetchDoctors = ({
  page = 1,
  sorter = "id",
  order = "asc",
  searchField = "",
  value = "",
  filters = {}, // Make sure this is being correctly passed
} = {}) => ({
  type: FETCH_DOCTOR_REQUEST,
  payload: { page, sorter, order, searchField, value, filters },
});

export const fetchDoctorsSuccess = (doctors) => ({
  type: FETCH_DOCTOR_SUCCESS,
  payload: doctors,
});

export const fetchDoctorsFailure = (error) => ({
  type: FETCH_DOCTOR_FAILURE,
  payload: error,
});

// Action creators for adding a doctor
export const addDoctor = (doctor) => ({
  type: ADD_DOCTOR_REQUEST,
  payload: doctor,
});
export const addDoctorSuccess = (doctor) => ({
  type: ADD_DOCTOR_SUCCESS,
  payload: doctor,
});
export const addDoctorFailure = (error) => ({
  type: ADD_DOCTOR_FAILURE,
  payload: error,
});

// Action creators for updating a doctor
export const updateDoctor = (id, doctor) => ({
  type: UPDATE_DOCTOR_REQUEST,
  payload: { id, doctor },
});
export const updateDoctorSuccess = (doctor) => ({
  type: UPDATE_DOCTOR_SUCCESS,
  payload: doctor,
});
export const updateDoctorFailure = (error) => ({
  type: UPDATE_DOCTOR_FAILURE,
  payload: error,
});

// Action creators for deleting a doctor
export const deleteDoctor = (id) => ({
  type: DELETE_DOCTOR_REQUEST,
  payload: id,
});
export const deleteDoctorSuccess = (id) => ({
  type: DELETE_DOCTOR_SUCCESS,
  payload: id,
});
export const deleteDoctorFailure = (error) => ({
  type: DELETE_DOCTOR_FAILURE,
  payload: error,
});

// Patient-related action creators
export const fetchPatients = () => ({ type: FETCH_PATIENT_REQUEST });
export const fetchPatientsSuccess = (patients) => ({
  type: FETCH_PATIENT_SUCCESS,
  payload: patients,
});
export const fetchPatientsFailure = (error) => ({
  type: FETCH_PATIENT_FAILURE,
  payload: error,
});

export const addPatient = (patient) => ({
  type: ADD_PATIENT_REQUEST,
  payload: patient,
});
export const addPatientSuccess = (patient) => ({
  type: ADD_PATIENT_SUCCESS,
  payload: patient,
});
export const addPatientFailure = (error) => ({
  type: ADD_PATIENT_FAILURE,
  payload: error,
});

export const updatePatient = (id, patient) => ({
  type: UPDATE_PATIENT_REQUEST,
  payload: { id, patient },
});
export const updatePatientSuccess = (patient) => ({
  type: UPDATE_PATIENT_SUCCESS,
  payload: patient,
});
export const updatePatientFailure = (error) => ({
  type: UPDATE_PATIENT_FAILURE,
  payload: error,
});

export const deletePatient = (id) => ({
  type: DELETE_PATIENT_REQUEST,
  payload: id,
});
export const deletePatientSuccess = (id) => ({
  type: DELETE_PATIENT_SUCCESS,
  payload: id,
});
export const deletePatientFailure = (error) => ({
  type: DELETE_PATIENT_FAILURE,
  payload: error,
});
///////////////////////////////////////
export const fetchDepartments = () => ({ type: FETCH_DEPARTMENT_REQUEST });
export const fetchDepartmentsSuccess = (departments) => ({
  type: FETCH_DEPARTMENT_SUCCESS,
  payload: departments,
});
export const fetchDepartmentsFailure = (error) => ({
  type: FETCH_DEPARTMENT_FAILURE,
  payload: error,
});

export const addDepartment = (department) => ({
  type: ADD_DEPARTMENT_REQUEST,
  payload: department,
});
export const addDepartmentSuccess = (department) => ({
  type: ADD_PATIENT_SUCCESS,
  payload: department,
});
export const addDepartmentFailure = (error) => ({
  type: ADD_PATIENT_FAILURE,
  payload: error,
});

export const updateDepartment = (id, department) => ({
  type: UPDATE_DEPARTMENT_REQUEST,
  payload: { id, department },
});
export const updateDepartmentSuccess = (department) => ({
  type: UPDATE_DEPARTMENT_SUCCESS,
  payload: department,
});
export const updateDepartmentFailure = (error) => ({
  type: UPDATE_DEPARTMENT_FAILURE,
  payload: error,
});

export const deleteDepartment = (id) => ({
  type: DELETE_DEPARTMENT_REQUEST,
  payload: id,
});
export const deleteDepartmentSuccess = (id) => ({
  type: DELETE_DEPARTMENT_SUCCESS,
  payload: id,
});
export const deleteDepartmentFailure = (error) => ({
  type: DELETE_DEPARTMENT_FAILURE,
  payload: error,
});
//////////////////////////
// Fetch Appointments Actions
export const fetchAppointments = () => ({ type: FETCH_APPOINTMENT_REQUEST });
export const fetchAppointmentsSuccess = (appointments) => ({
  type: FETCH_APPOINTMENT_SUCCESS,
  payload: appointments,
});
export const fetchAppointmentsFailure = (error) => ({
  type: FETCH_APPOINTMENT_FAILURE,
  payload: error,
});

// Add Appointment Actions
export const addAppointment = (appointment) => ({
  type: ADD_APPOINTMENT_REQUEST,
  payload: appointment,
});
export const addAppointmentSuccess = (appointment) => ({
  type: ADD_APPOINTMENT_SUCCESS,
  payload: appointment,
});
export const addAppointmentFailure = (error) => ({
  type: ADD_APPOINTMENT_FAILURE,
  payload: error,
});

// Update Appointment Actions
export const updateAppointment = (id, appointment) => ({
  type: UPDATE_APPOINTMENT_REQUEST,
  payload: { id, appointment },
});
export const updateAppointmentSuccess = (appointment) => ({
  type: UPDATE_APPOINTMENT_SUCCESS,
  payload: appointment,
});
export const updateAppointmentFailure = (error) => ({
  type: UPDATE_APPOINTMENT_FAILURE,
  payload: error,
});

// Delete Appointment Actions
export const deleteAppointment = (id) => ({
  type: DELETE_APPOINTMENT_REQUEST,
  payload: id,
});
export const deleteAppointmentSuccess = (id) => ({
  type: DELETE_APPOINTMENT_SUCCESS,
  payload: id,
});
export const deleteAppointmentFailure = (error) => ({
  type: DELETE_APPOINTMENT_FAILURE,
  payload: error,
});
/////////////////////
// Fetch Employee Actions
export const fetchEmployees = () => ({ type: FETCH_EMPLOYEE_REQUEST });
export const fetchEmployeesSuccess = (employees) => ({
  type: FETCH_EMPLOYEE_SUCCESS,
  payload: employees,
});
export const fetchEmployeesFailure = (error) => ({
  type: FETCH_EMPLOYEE_FAILURE,
  payload: error,
});

// Add Employee Actions
export const addEmployee = (employee) => ({
  type: ADD_EMPLOYEE_REQUEST,
  payload: employee,
});
export const addEmployeeSuccess = (employee) => ({
  type: ADD_EMPLOYEE_SUCCESS,
  payload: employee,
});
export const addEmployeeFailure = (error) => ({
  type: ADD_EMPLOYEE_FAILURE,
  payload: error,
});

// Update Employee Actions
export const updateEmployee = (id, employee) => ({
  type: UPDATE_EMPLOYEE_REQUEST,
  payload: { id, employee },
});
export const updateEmployeeSuccess = (employee) => ({
  type: UPDATE_EMPLOYEE_SUCCESS,
  payload: employee,
});
export const updateEmployeeFailure = (error) => ({
  type: UPDATE_EMPLOYEE_FAILURE,
  payload: error,
});

// Delete Employee Actions
export const deleteEmployee = (id) => ({
  type: DELETE_EMPLOYEE_REQUEST,
  payload: id,
});
export const deleteEmployeeSuccess = (id) => ({
  type: DELETE_EMPLOYEE_SUCCESS,
  payload: id,
});
export const deleteEmployeeFailure = (error) => ({
  type: DELETE_EMPLOYEE_FAILURE,
  payload: error,
});

// Action creators for fetching attachments
export const fetchAttachments = () => ({ type: FETCH_ATTACHMENT_REQUEST });

export const fetchAttachmentsSuccess = (attachments) => ({
  type: FETCH_ATTACHMENT_SUCCESS,
  payload: attachments,
});

export const fetchAttachmentsFailure = (error) => ({
  type: FETCH_ATTACHMENT_FAILURE,
  payload: error,
});

// Action creators for adding an attachment
export const addAttachment = (attachment) => ({
  type: ADD_ATTACHMENT_REQUEST,
  payload: attachment,
});

export const addAttachmentSuccess = (attachment) => ({
  type: ADD_ATTACHMENT_SUCCESS,
  payload: attachment,
});

export const addAttachmentFailure = (error) => ({
  type: ADD_ATTACHMENT_FAILURE,
  payload: error,
});

// Action creators for updating an attachment
export const updateAttachment = (id, attachment) => ({
  type: UPDATE_ATTACHMENT_REQUEST,
  payload: { id, attachment },
});

export const updateAttachmentSuccess = (attachment) => ({
  type: UPDATE_ATTACHMENT_SUCCESS,
  payload: attachment,
});

export const updateAttachmentFailure = (error) => ({
  type: UPDATE_ATTACHMENT_FAILURE,
  payload: error,
});

// Action creators for deleting an attachment
export const deleteAttachment = (id) => ({
  type: DELETE_ATTACHMENT_REQUEST,
  payload: id,
});

export const deleteAttachmentSuccess = (id) => ({
  type: DELETE_ATTACHMENT_SUCCESS,
  payload: id,
});

export const deleteAttachmentFailure = (error) => ({
  type: DELETE_ATTACHMENT_FAILURE,
  payload: error,
});

export const fetchPatientAttachments = (id) => ({
  type: FETCH_PATIENT_ATTACHMENTS_REQUEST,
  payload: id,
});

// Action creator for successful fetching of attachments
export const fetchPatientAttachmentsSuccess = (attachments) => ({
  type: FETCH_PATIENT_ATTACHMENTS_SUCCESS,
  payload: attachments
});

// Action creator for failure in fetching attachments
export const fetchPatientAttachmentsFailure = (error) => ({
  type: FETCH_PATIENT_ATTACHMENTS_FAILURE,
  payload: error
});