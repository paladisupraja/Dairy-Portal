import React, { createContext, useState, useEffect } from "react";
import { getAllGenders, getEmployeeDropdown, getAllPastures } from "../services";

export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {

  const [genders, setGenders] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pastures, setPastures] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);

  useEffect(() => {
    loadInitialDropdowns();
  }, []);

  const loadInitialDropdowns = async () => {
    try {
      const [g, e, d, p] = await Promise.all([
        getAllGenders(),
        getEmployeeDropdown("employee_type"),
        getEmployeeDropdown("department"),
        getAllPastures(),
      ]);

      setGenders(g?.data || []);
      setEmployeeTypes(e?.data || []);
      setDepartments(d?.data || []);
      setPastures(p?.data?.details || []);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Department change → Job roles load
  const loadJobRoles = async (department) => {
    try {
      const res = await getEmployeeDropdown("job_role", department);
      setJobRoles(res?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <EmployeeContext.Provider
      value={{
        genders,
        employeeTypes,
        departments,
        pastures,
        jobRoles,
        loadJobRoles
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
