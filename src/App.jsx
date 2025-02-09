import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import AppRoutes from "./Routes/AppRoutes";
import "./App.css";
import { Provider } from "react-redux";
import store from "./redux/store";
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  return (
    <>
      <Router>
        <Provider store={store}>
          <AppRoutes />
        </Provider>
      </Router>
    </>
  );
}
