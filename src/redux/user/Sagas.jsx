import { call, put, takeEvery } from "redux-saga/effects";
import {
  FETCH_USER_REQUEST,
  ADD_USER_REQUEST,
  UPDATE_USER_REQUEST,
  DELETE_USER_REQUEST,
  FETCH_DOCTOR_REQUEST,
  ADD_DOCTOR_REQUEST,
  UPDATE_DOCTOR_REQUEST,
  DELETE_DOCTOR_REQUEST,
  FETCH_PATIENT_REQUEST,
  ADD_PATIENT_REQUEST,
  UPDATE_PATIENT_REQUEST,
  DELETE_PATIENT_REQUEST,
  FETCH_EMPLOYEE_REQUEST,
  ADD_EMPLOYEE_REQUEST,
  UPDATE_EMPLOYEE_REQUEST,
  DELETE_EMPLOYEE_REQUEST,
  FETCH_DEPARTMENT_REQUEST,
  ADD_DEPARTMENT_REQUEST,
  UPDATE_DEPARTMENT_REQUEST,
  DELETE_DEPARTMENT_REQUEST,
  FETCH_APPOINTMENT_REQUEST,
  ADD_APPOINTMENT_REQUEST,
  UPDATE_APPOINTMENT_REQUEST,
  DELETE_APPOINTMENT_REQUEST,
  PAGE_SIZE,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  FETCH_ATTACHMENT_REQUEST,
  ADD_ATTACHMENT_REQUEST,
  UPDATE_ATTACHMENT_REQUEST,
  DELETE_ATTACHMENT_REQUEST,
  FETCH_PATIENT_ATTACHMENTS_REQUEST,
} from "./Types";

import {
  fetchUsersSuccess,
  fetchUsersFailure,
  addUserSuccess,
  addUserFailure,
  updateUserSuccess,
  updateUserFailure,
  deleteUserSuccess,
  deleteUserFailure,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  addDoctorSuccess,
  addDoctorFailure,
  updateDoctorSuccess,
  updateDoctorFailure,
  deleteDoctorSuccess,
  deleteDoctorFailure,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  addPatientSuccess,
  addPatientFailure,
  updatePatientSuccess,
  updatePatientFailure,
  deletePatientSuccess,
  deletePatientFailure,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  addEmployeeSuccess,
  addEmployeeFailure,
  updateEmployeeSuccess,
  updateEmployeeFailure,
  deleteEmployeeSuccess,
  deleteEmployeeFailure,
  fetchDepartmentsSuccess,
  fetchDepartmentsFailure,
  addDepartmentSuccess,
  addDepartmentFailure,
  updateDepartmentSuccess,
  updateDepartmentFailure,
  deleteDepartmentSuccess,
  deleteDepartmentFailure,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  addAppointmentSuccess,
  addAppointmentFailure,
  updateAppointmentSuccess,
  updateAppointmentFailure,
  deleteAppointmentSuccess,
  deleteAppointmentFailure,
  loginSuccess,
  loginFailure,
  registerSuccess,
  registerFailure,
  logoutSuccess,
  logoutFailure,
  fetchAttachmentsSuccess,
  fetchAttachmentsFailure,
  addAttachmentSuccess,
  addAttachmentFailure,
  updateAttachmentSuccess,
  updateAttachmentFailure,
  deleteAttachmentSuccess,
  deleteAttachmentFailure,
  fetchPatientAttachmentsSuccess,
  fetchPatientAttachmentsFailure,
} from "./Actions";

import {
  getUsersAPI,
  addUserAPI,
  updateUserAPI,
  deleteUserAPI,
  getDoctorsAPI,
  addDoctorAPI,
  updateDoctorAPI,
  deleteDoctorAPI,
  getPatientsAPI,
  addPatientAPI,
  updatePatientAPI,
  deletePatientAPI,
  getEmployeesAPI,
  addEmployeeAPI,
  updateEmployeeAPI,
  deleteEmployeeAPI,
  getDepartmentsAPI,
  addDepartmentAPI,
  updateDepartmentAPI,
  deleteDepartmentAPI,
  getAppointmentsAPI,
  addAppointmentAPI,
  updateAppointmentAPI,
  deleteAppointmentAPI,
  loginAPI,
  registerAPI,
  logoutAPI,
  getAttachmentsAPI,
  addAttachmentAPI,
  updateAttachmentAPI,
  deleteAttachmentAPI,
  fetchPatientAttachmentsAPI,
} from "../../Routes/Api";

function* handleLogin({ payload }) {
  const { credentials, navigate } = payload;
  try {
    const response = yield call(loginAPI, credentials);
    yield put(loginSuccess(response.data));


    navigate("/dashboard");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Login failed";
    yield put(loginFailure(errorMessage));
  }
}

function* handleRegister({ payload }) {
  const { userData, navigate } = payload;
  try {
    const response = yield call(registerAPI, userData);
    yield put(registerSuccess(response.data));

    

    navigate("/dashboard");
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Registration failed";
    yield put(registerFailure(errorMessage));
  }
}
function* handleLogout({ payload }) {
  const { navigate } = payload; // Extract navigate function from payload
  
  try {
     yield call(logoutAPI); // Call your logout API
    yield put(logoutSuccess()); // Dispatch success action
    navigate("/login"); // Redirect to the login page after logout
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Logout failed";
    yield put(logoutFailure(errorMessage)); // Dispatch failure action
  }
}


function* fetchUsers() {
  try {
    const response = yield call(getUsersAPI);
    // console.log(response);
    yield put(fetchUsersSuccess(response.data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

// Worker Saga: Add User
function* addUser(action) {
  try {
    const response = yield call(addUserAPI, action.payload);
    yield put(addUserSuccess(response.data));
  } catch (error) {
    yield put(addUserFailure(error.message));
  }
}

// Worker Saga: Update User
function* updateUser(action) {
  try {
    const { id, user } = action.payload;
    const response = yield call(updateUserAPI, id, user);
    yield put(updateUserSuccess(response.data));
  } catch (error) {
    yield put(updateUserFailure(error.message));
  }
}

// Worker Saga: Delete User
function* deleteUser(action) {
  try {
    yield call(deleteUserAPI, action.payload);
    yield put(deleteUserSuccess(action.payload));
  } catch (error) {
    yield put(deleteUserFailure(error.message));
  }
}
////////
// Worker Saga: Fetch Doctors

function* fetchDoctors(action) {
  const {
    page = 1,
    sorter = "id",
    order = "asc",
    searchField = "",
    value = "",
    filters = {}, // Ensure filters are here
  } = action.payload || {};

  const limit = PAGE_SIZE;
  const skip = (page - 1) * PAGE_SIZE;

  try {
    const response = yield call(
      getDoctorsAPI,
      limit,
      skip,
      searchField,
      value,
      sorter,
      order,
      filters // Ensure filters are passed correctly here
    );
    // console.log('API Response:', response.data);

    yield put(fetchDoctorsSuccess(response.data));
  } catch (error) {
    yield put(fetchDoctorsFailure(error.message));
  }
}

// Worker Saga: Add Doctor
function* addDoctor(action) {
  try {
    const response = yield call(addDoctorAPI, action.payload);
    yield put(addDoctorSuccess(response.data));
  } catch (error) {
    yield put(addDoctorFailure(error.message));
  }
}

// Worker Saga: Update Doctor
function* updateDoctor(action) {
  try {
    const { id, doctor } = action.payload;
    const response = yield call(updateDoctorAPI, id, doctor);
    yield put(updateDoctorSuccess(response.data));
  } catch (error) {
    yield put(updateDoctorFailure(error.message));
  }
}

// Worker Saga: Delete Doctor
function* deleteDoctor(action) {
  try {
    yield call(deleteDoctorAPI, action.payload);
    yield put(deleteDoctorSuccess(action.payload));
  } catch (error) {
    yield put(deleteDoctorFailure(error.message));
  }
}

// Worker Saga: Fetch Patients
function* fetchPatients() {
  try {
    const response = yield call(getPatientsAPI);
    yield put(fetchPatientsSuccess(response.data));
  } catch (error) {
    yield put(fetchPatientsFailure(error.message));
  }
}

// Worker Saga: Add Patient
function* addPatient(action) {
  try {
    const response = yield call(addPatientAPI, action.payload);
    yield put(addPatientSuccess(response.data));
  } catch (error) {
    yield put(addPatientFailure(error.message));
  }
}

// Worker Saga: Update Patient
function* updatePatient(action) {
  try {
    const { id, patient } = action.payload;
    const response = yield call(updatePatientAPI, id, patient);
    yield put(updatePatientSuccess(response.data));
  } catch (error) {
    yield put(updatePatientFailure(error.message));
  }
}

// Worker Saga: Delete Patient
function* deletePatient(action) {
  try {
    yield call(deletePatientAPI, action.payload);
    yield put(deletePatientSuccess(action.payload));
  } catch (error) {
    yield put(deletePatientFailure(error.message));
  }
}

// Worker Saga: Fetch Employees
function* fetchEmployees() {
  try {
    const response = yield call(getEmployeesAPI);
    yield put(fetchEmployeesSuccess(response.data));
  } catch (error) {
    yield put(fetchEmployeesFailure(error.message));
  }
}

// Worker Saga: Add Employee
function* addEmployee(action) {
  try {
    const response = yield call(addEmployeeAPI, action.payload);
    yield put(addEmployeeSuccess(response.data));
  } catch (error) {
    yield put(addEmployeeFailure(error.message));
  }
}

// Worker Saga: Update Employee
function* updateEmployee(action) {
  try {
    const { id, employee } = action.payload;
    const response = yield call(updateEmployeeAPI, id, employee);
    yield put(updateEmployeeSuccess(response.data));
  } catch (error) {
    yield put(updateEmployeeFailure(error.message));
  }
}

// Worker Saga: Delete Employee
function* deleteEmployee(action) {
  try {
    yield call(deleteEmployeeAPI, action.payload);
    yield put(deleteEmployeeSuccess(action.payload));
  } catch (error) {
    yield put(deleteEmployeeFailure(error.message));
  }
}

// Worker Saga: Fetch Departments
function* fetchDepartments() {
  try {
    const response = yield call(getDepartmentsAPI);
    yield put(fetchDepartmentsSuccess(response.data));
  } catch (error) {
    yield put(fetchDepartmentsFailure(error.message));
  }
}

// Worker Saga: Add Department
function* addDepartment(action) {
  try {
    const response = yield call(addDepartmentAPI, action.payload);
    yield put(addDepartmentSuccess(response.data));
  } catch (error) {
    yield put(addDepartmentFailure(error.message));
  }
}

// Worker Saga: Update Department
function* updateDepartment(action) {
  try {
    const { id, department } = action.payload;
    const response = yield call(updateDepartmentAPI, id, department);

    yield put(updateDepartmentSuccess(response.data));
  } catch (error) {
    yield put(updateDepartmentFailure(error.message));
  }
}

// Worker Saga: Delete Department
function* deleteDepartment(action) {
  try {
    yield call(deleteDepartmentAPI, action.payload);
    yield put(deleteDepartmentSuccess(action.payload));
  } catch (error) {
    yield put(deleteDepartmentFailure(error.message));
  }
}

// Worker Saga: Fetch Appointments
function* fetchAppointments() {
  try {
    const response = yield call(getAppointmentsAPI);
    yield put(fetchAppointmentsSuccess(response.data));
  } catch (error) {
    yield put(fetchAppointmentsFailure(error.message));
  }
}

// Worker Saga: Add Appointment
function* addAppointment(action) {
  try {
    const response = yield call(addAppointmentAPI, action.payload);
    yield put(addAppointmentSuccess(response.data));
  } catch (error) {
    yield put(addAppointmentFailure(error.message));
  }
}

// Worker Saga: Update Appointment
function* updateAppointment(action) {
  try {
    const { id, appointment } = action.payload;
    const response = yield call(updateAppointmentAPI, id, appointment);
    yield put(updateAppointmentSuccess(response.data));
  } catch (error) {
    yield put(updateAppointmentFailure(error.message));
  }
}

// Worker Saga: Delete Appointment
function* deleteAppointment(action) {
  try {
    yield call(deleteAppointmentAPI, action.payload);
    yield put(deleteAppointmentSuccess(action.payload));
  } catch (error) {
    yield put(deleteAppointmentFailure(error.message));
  }
}
/////////////////////
function* fetchAttachments() {
  try {
    const response = yield call(getAttachmentsAPI);
    yield put(fetchAttachmentsSuccess(response.data));
  } catch (error) {
    yield put(fetchAttachmentsFailure(error.message));
  }
}

// Worker Saga: Add Attachment
function* addAttachment(action) {
  try {
    const response = yield call(addAttachmentAPI, action.payload);
    yield put(addAttachmentSuccess(response.data));
  } catch (error) {
    yield put(addAttachmentFailure(error.message));
  }
}

// Worker Saga: Update Attachment
function* updateAttachment(action) {
  try {
    const { id, attachment } = action.payload;
    const response = yield call(updateAttachmentAPI, id, attachment);
    yield put(updateAttachmentSuccess(response.data));
  } catch (error) {
    yield put(updateAttachmentFailure(error.message));
  }
}

// Worker Saga: Delete Attachment
function* deleteAttachment(action) {
  try {
    console.log("action.payload",action.payload)
    yield call(deleteAttachmentAPI, action.payload);
    yield put(deleteAttachmentSuccess(action.payload));
  } catch (error) {
    yield put(deleteAttachmentFailure(error.message));
  }
}

function* fetchPatientAttachments(action) {
  try {
    const response = yield call(fetchPatientAttachmentsAPI, action.payload);
    yield put(fetchPatientAttachmentsSuccess(response.data));
  } catch (error) {
    yield put(fetchPatientAttachmentsFailure(error.message));
  }
}

// Watcher Saga
export default function* userSaga() {
  
  yield takeEvery(LOGIN_REQUEST, handleLogin);
  yield takeEvery(REGISTER_REQUEST, handleRegister);
  yield takeEvery(LOGOUT_REQUEST, handleLogout);

  yield takeEvery(FETCH_USER_REQUEST, fetchUsers);
  yield takeEvery(ADD_USER_REQUEST, addUser);
  yield takeEvery(UPDATE_USER_REQUEST, updateUser);
  yield takeEvery(DELETE_USER_REQUEST, deleteUser);
  yield takeEvery(FETCH_DOCTOR_REQUEST, fetchDoctors);
  yield takeEvery(ADD_DOCTOR_REQUEST, addDoctor);
  yield takeEvery(UPDATE_DOCTOR_REQUEST, updateDoctor);
  yield takeEvery(DELETE_DOCTOR_REQUEST, deleteDoctor);
  yield takeEvery(FETCH_PATIENT_REQUEST, fetchPatients);
  yield takeEvery(ADD_PATIENT_REQUEST, addPatient);
  yield takeEvery(UPDATE_PATIENT_REQUEST, updatePatient);
  yield takeEvery(DELETE_PATIENT_REQUEST, deletePatient);
  yield takeEvery(FETCH_EMPLOYEE_REQUEST, fetchEmployees);
  yield takeEvery(ADD_EMPLOYEE_REQUEST, addEmployee);
  yield takeEvery(UPDATE_EMPLOYEE_REQUEST, updateEmployee);
  yield takeEvery(DELETE_EMPLOYEE_REQUEST, deleteEmployee);
  yield takeEvery(FETCH_DEPARTMENT_REQUEST, fetchDepartments);
  yield takeEvery(ADD_DEPARTMENT_REQUEST, addDepartment);
  yield takeEvery(UPDATE_DEPARTMENT_REQUEST, updateDepartment);
  yield takeEvery(DELETE_DEPARTMENT_REQUEST, deleteDepartment);
  yield takeEvery(FETCH_APPOINTMENT_REQUEST, fetchAppointments);
  yield takeEvery(ADD_APPOINTMENT_REQUEST, addAppointment);
  yield takeEvery(UPDATE_APPOINTMENT_REQUEST, updateAppointment);
  yield takeEvery(DELETE_APPOINTMENT_REQUEST, deleteAppointment);
  yield takeEvery(FETCH_ATTACHMENT_REQUEST, fetchAttachments);
  yield takeEvery(ADD_ATTACHMENT_REQUEST, addAttachment);
  yield takeEvery(UPDATE_ATTACHMENT_REQUEST, updateAttachment);
  yield takeEvery(DELETE_ATTACHMENT_REQUEST, deleteAttachment);
  yield takeEvery(FETCH_PATIENT_ATTACHMENTS_REQUEST, fetchPatientAttachments);

}
