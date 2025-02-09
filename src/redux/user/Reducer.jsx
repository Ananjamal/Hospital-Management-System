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

const initialState = {
  loading: false,
  auth: [],
  doctors: [],
  users: [],
  patients: [],
  employees: [],
  appointments: [],
  departments: [],
  searchResults: [],
  sortResults: [],
  attachments: [],
  error: null,
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case LOGOUT_REQUEST:
      return { ...state, loading: true, error: null };
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      return { ...state, loading: false, auth: action.payload, error: null };
    case LOGOUT_SUCCESS:
      localStorage.removeItem("userInfo"); // Remove user data from localStorage
      return {
        ...state,
        auth: null,
        loading: false,
        error: null, // Clear error state
      };
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case LOGOUT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // User actions
    case FETCH_USER_REQUEST:
      return { ...state, loading: true };
    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, users: action.payload };
    case FETCH_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_USER_REQUEST:
      return { ...state, loading: true };
    case ADD_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
      };
    case ADD_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_USER_REQUEST:
      return { ...state, loading: true };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case UPDATE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_USER_REQUEST:
      return { ...state, loading: true };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case DELETE_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    //////////////
    // Doctor actions
    case FETCH_DOCTOR_REQUEST:
      return { ...state, loading: true };
    case FETCH_DOCTOR_SUCCESS:
      return { ...state, loading: false, doctors: action.payload };
    case FETCH_DOCTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_DOCTOR_REQUEST:
      return { ...state, loading: true };
    case ADD_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        doctors: [...state.doctors, action.payload],
      };
    case ADD_DOCTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_DOCTOR_REQUEST:
      return { ...state, loading: true };
    case UPDATE_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        doctors: state.doctors.map((doctor) =>
          doctor.id === action.payload.id ? action.payload : doctor
        ),
      };
    case UPDATE_DOCTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_DOCTOR_REQUEST:
      return { ...state, loading: true };
    case DELETE_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        doctors: state.doctors.filter((doctor) => doctor.id !== action.payload),
      };
    case DELETE_DOCTOR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Patient actions
    case FETCH_PATIENT_REQUEST:
      return { ...state, loading: true };
    case FETCH_PATIENT_SUCCESS:
      return { ...state, loading: false, patients: action.payload };
    case FETCH_PATIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_PATIENT_REQUEST:
      return { ...state, loading: true };
    case ADD_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        patients: [...state.patients, action.payload],
      };
    case ADD_PATIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_PATIENT_REQUEST:
      return { ...state, loading: true };
    case UPDATE_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        patients: state.patients.map((patient) =>
          patient.id === action.payload.id ? action.payload : patient
        ),
      };
    case UPDATE_PATIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_PATIENT_REQUEST:
      return { ...state, loading: true };
    case DELETE_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        patients: state.patients.filter(
          (patient) => patient.id !== action.payload
        ),
      };
    case DELETE_PATIENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Employee actions
    case FETCH_EMPLOYEE_REQUEST:
      return { ...state, loading: true };
    case FETCH_EMPLOYEE_SUCCESS:
      return { ...state, loading: false, employees: action.payload };
    case FETCH_EMPLOYEE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_EMPLOYEE_REQUEST:
      return { ...state, loading: true };
    case ADD_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: [...state.employees, action.payload],
      };
    case ADD_EMPLOYEE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_EMPLOYEE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: state.employees.map((employee) =>
          employee.id === action.payload.id ? action.payload : employee
        ),
      };
    case UPDATE_EMPLOYEE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_EMPLOYEE_REQUEST:
      return { ...state, loading: true };
    case DELETE_EMPLOYEE_SUCCESS:
      return {
        ...state,
        loading: false,
        employees: state.employees.filter(
          (employee) => employee.id !== action.payload
        ),
      };
    case DELETE_EMPLOYEE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Appointment actions
    case FETCH_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
    case FETCH_APPOINTMENT_SUCCESS:
      return { ...state, loading: false, appointments: action.payload };
    case FETCH_APPOINTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
    case ADD_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: [...state.appointments, action.payload],
      };
    case ADD_APPOINTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
    case UPDATE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: state.appointments.map((appointment) =>
          appointment.id === action.payload.id ? action.payload : appointment
        ),
      };
    case UPDATE_APPOINTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_APPOINTMENT_REQUEST:
      return { ...state, loading: true };
    case DELETE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: state.appointments.filter(
          (appointment) => appointment.id !== action.payload
        ),
      };
    case DELETE_APPOINTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // Search appointment actions

    // Department actions
    case FETCH_DEPARTMENT_REQUEST:
      return { ...state, loading: true };
    case FETCH_DEPARTMENT_SUCCESS:
      return { ...state, loading: false, departments: action.payload };
    case FETCH_DEPARTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_DEPARTMENT_REQUEST:
      return { ...state, loading: true };
    case ADD_DEPARTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        departments: [...state.departments, action.payload],
      };
    case ADD_DEPARTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_DEPARTMENT_REQUEST:
      return { ...state, loading: true };
    case UPDATE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        departments: state.departments.map((department) =>
          department.id === action.payload.id ? action.payload : department
        ),
      };
    case UPDATE_DEPARTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_DEPARTMENT_REQUEST:
      return { ...state, loading: true };
    case DELETE_DEPARTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        departments: state.departments.filter(
          (department) => department.id !== action.payload
        ),
      };
    case DELETE_DEPARTMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };
    /////////////
    // Attachment actions
    case FETCH_ATTACHMENT_REQUEST:
      return { ...state, loading: true };
    case FETCH_ATTACHMENT_SUCCESS:
      return { ...state, loading: false, attachments: action.payload };
    case FETCH_ATTACHMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case ADD_ATTACHMENT_REQUEST:
      return { ...state, loading: true };
    case ADD_ATTACHMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        attachments: [...state.attachments, action.payload],
      };
    case ADD_ATTACHMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case UPDATE_ATTACHMENT_REQUEST:
      return { ...state, loading: true };
    case UPDATE_ATTACHMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        attachments: state.attachments.map((attachment) =>
          attachment.id === action.payload.id ? action.payload : attachment
        ),
      };
    case UPDATE_ATTACHMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case DELETE_ATTACHMENT_REQUEST:
      return { ...state, loading: true };
    case DELETE_ATTACHMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        attachments: state.attachments.filter(
          (attachment) => attachment.id !== action.payload
        ),
      };
    case DELETE_ATTACHMENT_FAILURE:
      return { ...state, loading: false, error: action.payload };

      case FETCH_PATIENT_ATTACHMENTS_REQUEST:
        return { ...state, loading: true };
      case FETCH_PATIENT_ATTACHMENTS_SUCCESS:
        return { ...state, loading: false, attachments: action.payload };
      case FETCH_PATIENT_ATTACHMENTS_FAILURE:
        return { ...state, loading: false, error: action.payload , attachments : null  };

    default:
      return state;
  }
};

export default Reducer;
