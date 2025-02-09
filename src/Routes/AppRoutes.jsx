import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";
import Doctors from "../components/doctors/Doctors";
import Patients from "../components/patients/Patients";
import Appointments from "../components/appointments/Appointments";
import Departments from "../components/departments/Departments";
import Attachments from "../components/attachments/attachments";

import Employees from "../components/employees/Employees";
import Users from "../components/users/users";
import MainContent from "../components/MainContent";
import Unauthorized from "../components/Unauthorized";
import { selectUserInfo } from "../redux/user/Selector";

export default function AppRoutes() {
  const auth = useSelector(selectUserInfo);
  // console.log("auth", auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      {auth ? (
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Sub-routes */}
          <Route index element={<MainContent />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="patients" element={<Patients />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="departments" element={<Departments />} />
          <Route path="employees" element={<Employees />} />
          <Route path="users" element={<Users />} />
          <Route path="attachments" element={<Attachments />} />
        </Route>
      ) : (
        <Route>
          <Route
            path="/dashboard/*"
            element={<Unauthorized />}
          />
          <Route path="/login" element={<Login />} />
        </Route>
      )}

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default Route */}
      <Route
        path="/"
        element={auth ? <Dashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}
