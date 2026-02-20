import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ import router
import App from "./App";
import './index.css'
import SnackbarProvider from "./context/SnackbarContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AnimalDropdownProvider } from "./context/AnimalDropdownContext";
import { EmployeeProvider } from "./context/EmployeeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider>
      <AnimalDropdownProvider>
        <EmployeeProvider>
        <NotificationProvider>
      <BrowserRouter basename="/Dairy-Portal">
              <App />
            </BrowserRouter>
      </NotificationProvider></EmployeeProvider>
      </AnimalDropdownProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
