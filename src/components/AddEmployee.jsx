import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../context/SnackbarContext";
import {
  addEmployee,
  getAllGenders,
  getEmployeeDropdown,
  getAllPastures,
} from "../services";

/* ================= DEFAULT PAYLOAD ================= */

const DEFAULT_PAYLOAD = {
  employee_name: "",
  age: "",
  aadharcard_no: "",
  pancard_no: "",
  address: "",
  department: "",
  years_of_experience: "",
  joining_date: "",
  salary_amount: "",
  bank_account_details: "",
  gender: "",
  phone: "",
  emergency_no: "",
  employee_type: "",
  job_role: "",
  ifsc_code: "",
  date_of_birth: "",
  farm_id: null,
  password: "",
};

const AddEmployee = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= USER ================= */

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isEmployee = user?.role === "employee";

  const prefilledFarmId =
    location.state?.farm_id || (isEmployee ? user?.farm_id : null);

  /* ================= STATES ================= */

  const [formData, setFormData] = useState({
    ...DEFAULT_PAYLOAD,
    farm_id: prefilledFarmId,
  });

  const [loading, setLoading] = useState(false);
  const [genders, setGenders] = useState([]);
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [pastures, setPastures] = useState([]);

  /* ================= COMMON FIELD PROPS ================= */

  const commonFieldProps = {
    fullWidth: true,
    size: "small",
    variant: "outlined",
  };

  /* ================= NAVIGATION ================= */

  const handleBack = () => {
    navigate("/employees");
  };

  /* ================= AUTO CALCULATIONS ================= */

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateExperience = (joining) => {
    if (!joining) return "";
    const joinDate = new Date(joining);
    const today = new Date();
    let exp = today.getFullYear() - joinDate.getFullYear();

    if (
      today.getMonth() < joinDate.getMonth() ||
      (today.getMonth() === joinDate.getMonth() &&
        today.getDate() < joinDate.getDate())
    ) {
      exp--;
    }
    return exp;
  };

  /* ================= LOAD DROPDOWNS ================= */

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    try {
      const [g, e, d, j, p] = await Promise.all([
        getAllGenders(),
        getEmployeeDropdown("employee_type"),
        getEmployeeDropdown("department"),
        getEmployeeDropdown("job_role"),
        getAllPastures(),
      ]);

      setGenders(g?.data || []);
      setEmployeeTypes(e?.data || []);
      setDepartments(d?.data || []);
      setJobRoles(j?.data || []);
      setPastures(p?.data?.details || []);
    } catch (error) {
      showSnackbar("Failed to load dropdowns", "error");
    }
  };

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "date_of_birth") {
      setFormData((prev) => ({
        ...prev,
        date_of_birth: value,
        age: calculateAge(value),
      }));
      return;
    }

    if (name === "joining_date") {
      setFormData((prev) => ({
        ...prev,
        joining_date: value,
        years_of_experience: calculateExperience(value),
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    if (!formData.employee_name)
      return "Employee name is required";
    if (formData.aadharcard_no.length !== 12)
      return "Aadhar must be 12 digits";
    if (formData.phone.length !== 10)
      return "Mobile must be 10 digits";
    if (!formData.gender)
      return "Gender is required";
    if (!formData.farm_id)
      return "Farm is required";
    if (!formData.password)
      return "Password is required";

    return null;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    const error = validateForm();
    if (error) return showSnackbar(error, "error");

    setLoading(true);

    try {
      await addEmployee(formData);
      showSnackbar("Employee added successfully", "success");
      navigate("/employees");
    } catch (error) {
      showSnackbar("Failed to add employee", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Box p={3} bgcolor="#f4f6f8" minHeight="100vh">
      <Card sx={{ maxWidth: 1000, mx: "auto", borderRadius: 3 }}>
        <CardContent>

          {/* ===== HEADER ===== */}
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
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "#2A080B",
              }}
            >
              Back
            </Button>

            <Typography variant="h5" fontWeight={600}>
              Add Employee
            </Typography>

            <Box width="80px" />
          </Box>

         

          {/* ===== FORM GRID ===== */}
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
            <TextField {...commonFieldProps} label="Employee Name" name="employee_name" value={formData.employee_name} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Date of Birth" type="date" name="date_of_birth" InputLabelProps={{ shrink: true }} value={formData.date_of_birth} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Age" value={formData.age} disabled />
            <TextField {...commonFieldProps} label="Joining Date" type="date" name="joining_date" InputLabelProps={{ shrink: true }} value={formData.joining_date} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Years of Experience" value={formData.years_of_experience} disabled />

            <TextField {...commonFieldProps} select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
              {genders.map((g) => (
                <MenuItem key={g.id} value={g.gender}>
                  {g.gender}
                </MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} inputProps={{ maxLength: 10 }} />
            <TextField {...commonFieldProps} label="Emergency Number" name="emergency_no" value={formData.emergency_no} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Aadhar Number" name="aadharcard_no" value={formData.aadharcard_no} onChange={handleChange} inputProps={{ maxLength: 12 }} />
            <TextField {...commonFieldProps} label="PAN Number" name="pancard_no" value={formData.pancard_no} onChange={handleChange} />
            <TextField {...commonFieldProps} label="IFSC Code" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Salary Amount" type="number" name="salary_amount" value={formData.salary_amount} onChange={handleChange} />
            <TextField {...commonFieldProps} label="Account Number" name="bank_account_details" value={formData.bank_account_details} onChange={handleChange} />

            <TextField {...commonFieldProps} select label="Employee Type" name="employee_type" value={formData.employee_type} onChange={handleChange}>
              {employeeTypes.map((e) => (
                <MenuItem key={e.id} value={e.value}>
                  {e.value}
                </MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} select label="Department" name="department" value={formData.department} onChange={handleChange}>
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.value}>
                  {d.value}
                </MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} select label="Job Role" name="job_role" value={formData.job_role} onChange={handleChange}>
              {jobRoles.map((j) => (
                <MenuItem key={j.id} value={j.value}>
                  {j.value}
                </MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} select label="Farm" name="farm_id" value={formData.farm_id || ""} onChange={handleChange} disabled={isEmployee}>
              {pastures.map((p) => (
                <MenuItem key={p.pasture_id} value={p.pasture_id}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField {...commonFieldProps} label="Address" name="address" value={formData.address} onChange={handleChange} sx={{ flex: "1 1 100%" }} />
            <TextField {...commonFieldProps} label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
          </Box>

          {/* ===== SUBMIT BUTTON ===== */}
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 4,
              height: 50,
              fontWeight: 600,
              backgroundColor: "#2A080B",
              "&:hover": { backgroundColor: "#1c0507" },
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "ADDING..." : "ADD EMPLOYEE"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddEmployee;
