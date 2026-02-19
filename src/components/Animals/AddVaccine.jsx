

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  MenuItem
} from "@mui/material";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { addVaccination, getVaccineTypes } from "../../services";

const AddVaccine = () => {
  const { animalId } = useParams(); // ✅ this is your tag number
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
 
const location = useLocation();
const tagNo = location.state?.tagNo;  // TAG NUMBER


  const [vaccines, setVaccines] = useState([]);
  const [formData, setFormData] = useState({
    animal_id: animalId,
    vaccine_name: "",
    vaccine_type: "",
    vaccine_date: "",
    dosage: ""
  });

  // ================= CHANGE =================
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      await addVaccination({
        ...formData,
        animal_id: parseInt(animalId)
      });

      showSnackbar("Vaccine Added", "success");

      // ✅ Pass animalId as state to AddMedicine
     navigate("/add-medicine", {
  state: { animalTags: [tagNo] }
});


    } catch {
      showSnackbar("Vaccine add failed", "error");
    }
  };

  // ================= FETCH VACCINES =================
  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const res = await getVaccineTypes();
        setVaccines(res.data?.details || []);
      } catch {
        showSnackbar("Failed to get vaccine types", "error");
      }
    };
    fetchVaccines();
  }, [showSnackbar]);

  // ================= SKIP =================
  const handleSkip = () => {
    navigate("/animals");
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          Add Vaccine (Tag: {animalId})
        </Typography>

        <Box display="grid" gap={2}>
          <TextField
            label="Vaccine Name"
            name="vaccine_name"
            value={formData.vaccine_name}
            onChange={handleChange}
          />

          <TextField
            select
            label="Vaccine Type"
            name="vaccine_type"
            value={formData.vaccine_type}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="">Select</MenuItem>
            {vaccines.map((v) => (
              <MenuItem key={v.id} value={v.name}>
                {v.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Vaccine Date"
            name="vaccine_date"
            value={formData.vaccine_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
          />
        </Box>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button onClick={handleSkip} sx={{color:"rgb(42,8,11)"}}>Skip</Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "rgb(42, 8, 11)",
              "&:hover": { backgroundColor: "rgb(30, 5, 5)" }
            }}
          >
            Save Vaccine
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddVaccine;
