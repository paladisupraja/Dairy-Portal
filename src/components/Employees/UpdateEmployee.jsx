import React, { useEffect, useState } from "react";
import {
  updateEmployee,
  getAllGenders,
  getEmployeeDropdown,
  getAllPastures,
} from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
} from "@mui/material";
import "../../index.css";

const UpdateEmployee = () => {
  const { showSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  const [formData, setFormData] = useState({
    employee_id: "",
    employee_name: "",
    date_of_birth: "",
    age: "",
    joining_date: "",
    years_of_experience: "",
    gender: "",
    phone: "",
    emergency_no: "",
    department: "",
    job_role: "",
    employee_type: "",
    aadharcard_no: "",
    pancard_no: "",
    salary_amount: "",
    bank_account_details: "",
    ifsc_code: "",
    farm_id: "",
    address: "",
    login_flag: true,
  });

  // Dropdowns
  const [genders, setGenders] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [pastures, setPastures] = useState([]);

  const handleBack=()=>{
    navigate("/employees")
  }
 
  const commonFieldProps = {
    fullWidth: true,
    size: "small",
    variant: "outlined",
    sx: { "& .MuiInputBase-root": { height: 56 } },
  };

  // Load dropdowns
  const loadDropdowns = async () => {
    try {
      const [
        genderRes,
        empTypeRes,
        deptRes,
        jobRoleRes,
        pastureRes,
      ] = await Promise.all([
        getAllGenders(),
        getEmployeeDropdown("employee_type"),
        getEmployeeDropdown("department"),
        getEmployeeDropdown("job_role"),
        getAllPastures(),
      ]);

      setGenders(genderRes.data || []);
      setEmployeeTypes(empTypeRes.data || []);
      setDepartments(deptRes.data || []);
      setJobRoles(jobRoleRes.data || []);
      setPastures(pastureRes.data?.details || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load dropdowns", "error");
    }
  };

  useEffect(() => {
    loadDropdowns();

    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        ...location.state,
        // 🔒 Employee farm locked
        farm_id: isEmployee ? user.farm_id : location.state.farm_id,
      }));
    }
  }, [location.state]);

  // Age calculation
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    )
      age--;
    return age;
  };

  // Experience calculation
  const calculateExperience = (date) => {
    if (!date) return "";
    const join = new Date(date);
    const today = new Date();
    let exp = today.getFullYear() - join.getFullYear();
    if (
      today.getMonth() < join.getMonth() ||
      (today.getMonth() === join.getMonth() &&
        today.getDate() < join.getDate())
    )
      exp--;
    return exp < 0 ? 0 : exp;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };

    if (name === "date_of_birth") updated.age = calculateAge(value);
    if (name === "joining_date")
      updated.years_of_experience = calculateExperience(value);

    setFormData(updated);
  };

  const handleSubmit = async () => {
    if (formData.aadharcard_no && formData.aadharcard_no.length !== 12)
      return showSnackbar("Aadhar must be 12 digits", "error");
    if (formData.pancard_no && formData.pancard_no.length !== 10)
      return showSnackbar("PAN must be 10 characters", "error");
    if (formData.ifsc_code && formData.ifsc_code.length !== 11)
      return showSnackbar("IFSC must be 11 characters", "error");

    // 🔐 Final protection
    if (isEmployee) {
      formData.farm_id = user.farm_id;
    }

    try {
      const res = await updateEmployee(formData);
      if (res.data.statusCode === 200) {
        showSnackbar(res.data.message, "success");
        navigate("/employees");
      } else {
        showSnackbar(res.data.message, "error");
      }
    } catch {
      showSnackbar("Update failed", "error");
    }
  };

  return (
    <Box p={3} bgcolor="#f4f6f8">
      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className="color"
              sx={{
                textTransform: "none",
                fontWeight: 500,
               
              }}
            >
              Back
            </Button>

            <Typography variant="h5" fontWeight={600}>
           Update Employee
            </Typography>

            <Box width="80px" />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              "& > div": { flex: "1 1 45%" },
              "@media (max-width:600px)": {
                "& > div": { flex: "1 1 100%" },
              },
            }}
          >
            <TextField {...commonFieldProps} label="Employee ID" value={formData.employee_id} disabled />
            <TextField {...commonFieldProps} label="Employee Name" name="employee_name" value={formData.employee_name || ""} onChange={handleChange} />

            <TextField {...commonFieldProps} type="date" label="Date of Birth" name="date_of_birth" value={formData.date_of_birth || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField {...commonFieldProps} label="Age" value={formData.age || ""} disabled />

            <TextField {...commonFieldProps} type="date" label="Joining Date" name="joining_date" value={formData.joining_date || ""} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField {...commonFieldProps} label="Experience" value={formData.years_of_experience || ""} disabled />

            <TextField {...commonFieldProps} select label="Gender" name="gender" value={formData.gender || ""} onChange={handleChange}>
              {genders.map((g) => (
                <MenuItem key={g.id} value={g.gender}>{g.gender}</MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} label="Phone" name="phone" value={formData.phone || ""} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Emergency No" name="emergency_no" value={formData.emergency_no || ""} onChange={handleChange} />

            <TextField {...commonFieldProps} select label="Department" name="department" value={formData.department || ""} onChange={handleChange}>
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.value}>{d.value}</MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} select label="Job Role" name="job_role" value={formData.job_role || ""} onChange={handleChange}>
              {jobRoles.map((j) => (
                <MenuItem key={j.id} value={j.value}>{j.value}</MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} select label="Employee Type" name="employee_type" value={formData.employee_type || ""} onChange={handleChange}>
              {employeeTypes.map((e) => (
                <MenuItem key={e.id} value={e.value}>{e.value}</MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} label="Aadhar" name="aadharcard_no" value={formData.aadharcard_no || ""} onChange={handleChange} />
            <TextField {...commonFieldProps} label="PAN" name="pancard_no" value={formData.pancard_no || ""} onChange={handleChange} />
            <TextField {...commonFieldProps} label="IFSC" name="ifsc_code" value={formData.ifsc_code || ""} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Salary" name="salary_amount" value={formData.salary_amount || ""} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Bank Account" name="bank_account_details" value={formData.bank_account_details || ""} onChange={handleChange} />
             <TextField
              {...commonFieldProps}
              select
              label="Login Access"
              name="login_flag"
              value={String(formData.login_flag)}
              onChange={handleChange}
              disabled={isEmployee}
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>

            {/* 🔒 Farm */}
            <TextField
              {...commonFieldProps}
              select
              label="Farm"
              name="farm_id"
              value={formData.farm_id || ""}
              onChange={handleChange}
              disabled={isEmployee}
            >
              {pastures.map((p) => (
                <MenuItem key={p.pasture_id} value={p.pasture_id}>
                  {p.name} ({p.category})
                </MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} label="Address" name="address" value={formData.address || ""} onChange={handleChange} sx={{ flex: "1 1 100%" }} />
          </Box>

          <Button variant="contained" fullWidth  className="bg-color" sx={{ mt: 3, height: 48 }} onClick={handleSubmit}>
            UPDATE EMPLOYEE
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UpdateEmployee;
