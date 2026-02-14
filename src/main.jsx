import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ import router
import App from "./App";
import './index.css'
import SnackbarProvider from "./context/SnackbarContext";
import { NotificationProvider } from "./context/NotificationContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SnackbarProvider>
      <NotificationProvider>
      <BrowserRouter> {/* ✅ wrap your app */}
        <App />
      </BrowserRouter>
      </NotificationProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
