import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { createPasture } from "../../services";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const AddPasture = () => {
  const [form, setForm] = useState({
    name: "",
    category: ""
  });

  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const categories = ["Cow", "Buffalo", "Sheep"];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      showSnackbar("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await createPasture(form);

      if (res.data?.statusCode === 200) {
        showSnackbar("Pasture added successfully", "success");
        navigate("/pastures");
      } else {
        showSnackbar("Failed to add pasture", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to add pasture", "error");
    } finally {
      setLoading(false);
    }
  };
   const handleBack = () => {
    navigate("/pastures");
  };


  return (
    <Box p={3} maxWidth={700} mx="auto">
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
      <Card>
        <CardContent>
         

          <Typography variant="h5" mb={2}>
            Add Pasture
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Pasture Name */}
            <TextField
              label="Pasture Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            />

            {/* Category */}
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
              required
              margin="normal"
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>

            {/* Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
              <Button
               
                onClick={() => navigate("/pastures")} sx={{color:"rgb(42,8,11)"}}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={loading}  sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddPasture;
