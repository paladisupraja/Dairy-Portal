import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { useLocation,useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import {
  addConsumption,
  getMedicineList,
  getEmployees,
  timeSlotList,
  getAllMedicines,
} from "../../services";
import "../../index.css";

const AddMedicine = () => {
  const { showSnackbar } = useSnackbar();
const navigate=useNavigate();
const location = useLocation();
const animalTags = location.state?.animalTags || [];

  
  

  const [medicines, setMedicines] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  const [formData, setFormData] = useState({
    medicine_id: "",
    dosage: "",
    duration: "single-dose",
    time_slot: "",
    employee_id: "",
    supervised_by: "",
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Medicines
        const meds = await getAllMedicines();
        setMedicines(meds.data?.details || []);

        // Employees
        const emps = await getEmployees();
        setEmployees(emps.data?.details || []);

        // Time slots
        const ts = await timeSlotList();
        setTimeSlots(ts.data?.time_slots || []);
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to load data", "error");
      }
    };
    fetchData();
  }, [showSnackbar]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.medicine_id || !formData.dosage || !formData.employee_id || !formData.time_slot) {
      showSnackbar("Please fill all required fields", "warning");
      return;
    }

    if (!animalTags.length) {
      showSnackbar("No animals selected", "error");
      return;
    }

    try {
      await addConsumption({
        ...formData,
        animal_tags: animalTags, // ✅ Send tag_no array
        administered_at: new Date().toISOString(),
      });

      showSnackbar("Medicine consumption recorded", "success");
      setTimeout(() => {
  navigate("/animals");
}, 800)

      setFormData({
        medicine_id: "",
        dosage: "",
        duration: "single-dose",
        time_slot: "",
        employee_id: "",
        supervised_by: "",
      });
    } catch (error) {
      console.error(error);
     showSnackbar(
        err?.response?.data?.message || "Save Failed",
        "error"
      );
    }
  };
   const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };


  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Add Medicine
        </Typography>

        <Box display="grid" gap={2}>
          {/* Medicine */}
          <TextField
            select
            label="Medicine"
            name="medicine_id"
            value={formData.medicine_id}
            onChange={handleChange}
          >
            <MenuItem value="">Select Medicine</MenuItem>

            {medicines.map((m) => {
              const expired = isExpired(m.expiry_date);
              const lowStock =
                m.min_stock && Number(m.quantity) < Number(m.min_stock);

              return (
                <MenuItem
                  key={m.id}
                  value={m.id}
                  disabled={expired || Number(m.quantity) === 0}
                >
                  {m.name} - {m.quantity} {m.unit || ""}
                  {expired && " (Expired)"}
                  {lowStock && !expired && " (Low Stock)"}
                </MenuItem>
              );
            })}
          </TextField>

          {/* Dosage */}
          <TextField
            type="number"
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />

          {/* Duration */}
          <TextField
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          />

          {/* Time Slot */}
          <TextField
            select
            label="Time Slot"
            name="time_slot"
            value={formData.time_slot}
            onChange={handleChange}
          >
            <MenuItem value="">Select Time Slot</MenuItem>
            {timeSlots.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name} ({t.start_time}-{t.end_time})
              </MenuItem>
            ))}
          </TextField>

          {/* Employee */}
          <TextField
            select
            label="Employee"
            name="employee_id"
            value={formData.employee_id}
            onChange={handleChange}
          >
            <MenuItem value="">Select Employee</MenuItem>
            {employees.map((e) => (
              <MenuItem key={e.employee_id} value={e.employee_id}>
                {e.employee_name}
              </MenuItem>
            ))}
          </TextField>

          {/* Supervised By */}
          <TextField
            label="Supervised By"
            name="supervised_by"
            value={formData.supervised_by}
            onChange={handleChange}
          />
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="bg-color"
          >
            Save Medicine
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddMedicine;
