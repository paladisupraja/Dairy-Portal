import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const tabStyle = {
  padding: "10px 18px",
  borderRadius: "8px",
  fontWeight: 600,
  textDecoration: "none",
  transition: "all 0.2s ease",
};

const Medicine = () => {
  return (
    <div>
      <h2>Medicine Inventory</h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          background: "#f1f1f1",
          padding: "6px",
          borderRadius: "10px",
          width: "fit-content",
        }}
      >
        {[
          { to: "input", label: "Input Inventory" },
          { to: "output", label: "Output Inventory" },
          { to: "stock", label: "Stock Management" },
        ].map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              ...tabStyle,
              backgroundColor: isActive ? "rgb(42, 8, 11)" : "transparent",
              color: isActive ? "#fff" : "rgb(42, 8, 11)",
            })}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {/* Tab content */}
      <Outlet />
    </div>
  );
};

export default Medicine;
