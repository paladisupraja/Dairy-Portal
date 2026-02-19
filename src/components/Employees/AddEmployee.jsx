import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { addEmployee } from "../../services";
import { EmployeeContext } from "../../context/EmployeeContext";

/* ================= DEFAULT PAYLOAD ================= */
const DEFAULT_PAYLOAD = {
  employee_name: "",
  age: "",
  date_of_birth: "",
  joining_date: "",
  years_of_experience: "",
  gender: "",
  phone: "",
  emergency_no: "",
  aadharcard_no: "",
  pancard_no: "",
  ifsc_code: "",
  salary_amount: "",
  bank_account_details: "",
  employee_type: "",
  department: "",
  job_role: "",
  farm_id: null,
  address: "",
  password: "",
};

const AddEmployee = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  // ================= CONTEXT =================
  const { genders, employeeTypes, departments, pastures, jobRoles, loadJobRoles } =
    useContext(EmployeeContext);

  // ================= USER INFO =================
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const isEmployee = storedUser?.role === "employee";
  const prefilledFarmId = location.state?.farm_id || (isEmployee ? storedUser?.farm_id : null);

  // ================= STATES =================
  const [formData, setFormData] = useState({ ...DEFAULT_PAYLOAD, farm_id: prefilledFarmId });
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const commonProps = { fullWidth: true, size: "small", variant: "outlined" };

  // ================= NAVIGATION =================
  const handleBack = () => navigate("/employees");

  // ================= AUTO CALCULATIONS =================
  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const todayDate = new Date();
    let age = todayDate.getFullYear() - birth.getFullYear();
    if (
      todayDate.getMonth() < birth.getMonth() ||
      (todayDate.getMonth() === birth.getMonth() && todayDate.getDate() < birth.getDate())
    ) age--;
    return age;
  };

  const calculateExperience = (joining) => {
    if (!joining) return "";
    const joinDate = new Date(joining);
    const todayDate = new Date();
    let exp = todayDate.getFullYear() - joinDate.getFullYear();
    if (
      todayDate.getMonth() < joinDate.getMonth() ||
      (todayDate.getMonth() === joinDate.getMonth() && todayDate.getDate() < joinDate.getDate())
    ) exp--;
    return exp;
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, date_of_birth: value, age }));
      return;
    }

    if (name === "joining_date") {
      setFormData((prev) => ({ ...prev, joining_date: value, years_of_experience: calculateExperience(value) }));
      return;
    }

    if (name === "department") {
      setFormData((prev) => ({ ...prev, department: value, job_role: "" }));
      loadJobRoles(value);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const f = formData;
    if (!f.employee_name) return "Enter employee name";
    if (!f.date_of_birth) return "Enter date of birth";
    if (f.age <= 0) return "Age too young";
    if (!f.joining_date) return "Enter joining date";
    if (!f.gender) return "Select gender";
    if (!f.department) return "Select department";
    if (!f.job_role) return "Select job role";
    if (!f.phone || f.phone.length !== 10) return "Enter valid mobile number (10 digits)";
    if (!f.emergency_no || f.emergency_no.length !== 10) return "Enter valid emergency number (10 digits)";
    if (!f.aadharcard_no || f.aadharcard_no.length !== 12) return "Enter valid Aadhar number (12 digits)";
    if (!f.pancard_no || f.pancard_no.length !== 10) return "Enter valid PAN number (10 chars)";
    if (!f.salary_amount) return "Enter salary amount";
    if (!f.bank_account_details || f.bank_account_details.length !== 16) return "Enter valid bank account (16 digits)";
    if (!f.ifsc_code || f.ifsc_code.length !== 11) return "Enter valid IFSC code (11 chars)";
    if (!f.employee_type) return "Select employee type";
    if (!f.farm_id) return "Select farm";
    if (!f.address) return "Enter address";
    if (!f.password) return "Enter password";
    return null;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return showSnackbar(error, "error");

    setLoading(true);
    try {
      await addEmployee(formData);
      showSnackbar("Employee added successfully", "success");
      navigate("/employees");
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Failed to add employee";
      showSnackbar(msg, "error"); // backend message
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Box p={3} bgcolor="#f4f6f8" minHeight="100vh">
      <Card sx={{ maxWidth: 1000, mx: "auto", borderRadius: 3 }}>
        <CardContent>
          {/* HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ textTransform: "none", fontWeight: 500, color: "rgb(42,8,11)" }}>
              Back
            </Button>
            <Typography variant="h5" fontWeight={600}>Add Employee</Typography>
            <Box width="80px" />
          </Box>

          {/* FORM */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, "& > div": { flex: "1 1 45%", }, "@media (max-width:600px)": { "& > div": { flex: "1 1 100%" } } }}>
            <TextField {...commonProps} label="Employee Name" name="employee_name" value={formData.employee_name} onChange={handleChange} placeholder="Enter Employee Name" />
            <TextField {...commonProps} label="Date of Birth" type="date" name="date_of_birth" InputLabelProps={{ shrink: true }} value={formData.date_of_birth} onChange={handleChange} inputProps={{ max: today }} />
            <TextField {...commonProps} label="Age" value={formData.age} disabled placeholder="Calculated automatically" />
            <TextField {...commonProps} label="Joining Date" type="date" name="joining_date" InputLabelProps={{ shrink: true }} value={formData.joining_date} onChange={handleChange} inputProps={{ max: today }} />
            <TextField {...commonProps} label="Years Of Experience" value={formData.years_of_experience} disabled placeholder="Calculated automatically" />

            <TextField {...commonProps} select label="Gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="Select Gender">
              {genders.map((g) => <MenuItem key={g.id} value={g.gender}>{g.gender}</MenuItem>)}
            </TextField>

            <TextField {...commonProps} label="Mobile" name="phone" value={formData.phone} onChange={handleChange} inputProps={{ maxLength: 10 }} placeholder="10 digits" />
            <TextField {...commonProps} label="Emergency Number" name="emergency_no" value={formData.emergency_no} onChange={handleChange} inputProps={{ maxLength: 10 }} placeholder="10 digits" />
            <TextField {...commonProps} label="Aadhar" name="aadharcard_no" value={formData.aadharcard_no} onChange={handleChange} inputProps={{ maxLength: 12 }} placeholder="12 digits" />
            <TextField {...commonProps} label="PAN" name="pancard_no" value={formData.pancard_no} onChange={handleChange} inputProps={{ maxLength: 10 }} placeholder="10 chars" />
            <TextField {...commonProps} label="IFSC" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} inputProps={{ maxLength: 11 }} placeholder="11 chars" />
            <TextField {...commonProps} label="Salary" type="number" name="salary_amount" value={formData.salary_amount} onChange={handleChange} placeholder="Enter Salary Amount" />
            <TextField {...commonProps} label="Account Number"  name="bank_account_details" value={formData.bank_account_details} onChange={handleChange} inputProps={{ maxLength: 16 }} placeholder="16 digits" />

            <TextField {...commonProps} select label="Employee Type" name="employee_type" value={formData.employee_type} onChange={handleChange} placeholder="Select Employee Type">
              {employeeTypes.map((e) => <MenuItem key={e.id} value={e.value}>{e.value}</MenuItem>)}
            </TextField>
            <TextField {...commonProps} select label="Department" name="department" value={formData.department} onChange={handleChange} placeholder="Select Department">
              {departments.map((d) => <MenuItem key={d.id} value={d.value}>{d.value}</MenuItem>)}
            </TextField>
            <TextField {...commonProps} select label="Job Role" name="job_role" value={formData.job_role} onChange={handleChange} disabled={!formData.department} placeholder="Select Job Role">
              {jobRoles.map((j) => <MenuItem key={j.id} value={j.value}>{j.value}</MenuItem>)}
            </TextField>
            <TextField {...commonProps} select label="Farm" name="farm_id" value={formData.farm_id || ""} onChange={handleChange} disabled={isEmployee} placeholder="Select Farm">
              {pastures.map((p) => <MenuItem key={p.pasture_id} value={p.pasture_id}>{p.name}</MenuItem>)}
            </TextField>
            <TextField {...commonProps} label="Address" name="address" value={formData.address} onChange={handleChange} sx={{ flex: "1 1 100%" }} placeholder="Enter Address" />
            <TextField {...commonProps} label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Password" />
          </Box>

          <Button fullWidth variant="contained" sx={{ mt: 4, backgroundColor: "rgb(42,8,11)", "&:hover": { backgroundColor: "rgb(30,5,5)" } }} onClick={handleSubmit} disabled={loading}>
            {loading ? "ADDING..." : "ADD EMPLOYEE"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddEmployee;
