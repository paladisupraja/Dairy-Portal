import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography
} from "@mui/material";
import { useSnackbar } from "../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import {
  addAnimal,
  getAllPastures,
  getAnimalBreeds,
  getAnimalsByType,
  getAnimalLifecycle
} from "../services";

const AddAnimal = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  const [pastures, setPastures] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [femaleAnimals, setFemaleAnimals] = useState([]);
  const [maleAnimals, setMaleAnimals] = useState([]);
  const [lifecycles, setLifecycles] = useState([]);

  const [formData, setFormData] = useState({
    tag_no: "",
    animal_type: "",
    breed_type: "",
    gender: "",
    dob: "",
    farm_id: null,
    lactation_no: null,
    milking_status: "",
    lifecycle: "",
    breeding_status: "",
    mother_tag: "",
    father_tag: "",
  });

  // ================= LOAD FARMS =================
  useEffect(() => {
    if (!isEmployee) fetchPastures();
    else if (user?.farm_id) {
      setFormData(prev => ({ ...prev, farm_id: parseInt(user.farm_id) }));
    }
  }, []);

  const fetchPastures = async () => {
    try {
      const res = await getAllPastures();
      setPastures(res.data.details || []);
    } catch {
      showSnackbar("Failed to load farms", "error");
    }
  };

  // ================= LOAD BREEDS & PARENTS =================
  useEffect(() => {
    if (formData.animal_type) {
      loadBreeds(formData.animal_type);
      fetchParentAnimals(formData.animal_type);
    }
  }, [formData.animal_type]);

  const loadBreeds = async (type) => {
    try {
      const res = await getAnimalBreeds(type);
      setBreeds(res.data || []);
    } catch {
      showSnackbar("Failed to load breeds", "error");
    }
  };

  const fetchParentAnimals = async (type) => {
    try {
      const femaleRes = await getAnimalsByType({ animalType: type, gender: "Female" });
      const maleRes = await getAnimalsByType({ animalType: type, gender: "Male" });
      setFemaleAnimals(femaleRes.data.details || []);
      setMaleAnimals(maleRes.data.details || []);
    } catch {
      showSnackbar("Failed to load parent animals", "error");
    }
  };

  // ================= LOAD LIFECYCLE =================
  useEffect(() => {
    if (formData.gender) fetchLifecycles(formData.gender);
  }, [formData.gender]);

  const fetchLifecycles = async (gender) => {
    try {
      const res = await getAnimalLifecycle(gender);
      setLifecycles(res.data.details || []);
      setFormData(prev => ({ ...prev, lifecycle: "" }));
    } catch {
      showSnackbar("Failed to load lifecycle", "error");
    }
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Animal Type
    if (name === "animal_type") {
      setFormData(prev => ({
        ...prev,
        animal_type: value,
        breed_type: "",
        mother_tag: "",
        father_tag: ""
      }));
      return;
    }

    // Gender - auto milking
    if (name === "gender") {
      setFormData(prev => ({
        ...prev,
        gender: value,
        milking_status: value === "Female" ? "yes" : "no"
      }));
      return;
    }

    // Number fields
    if (name === "farm_id" || name === "lactation_no") {
      setFormData(prev => ({ ...prev, [name]: value ? parseInt(value) : null }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!formData.tag_no) return showSnackbar("Tag Number required", "error");
    if (!isEmployee && !formData.farm_id) return showSnackbar("Farm required", "error");

    try {
      await addAnimal(formData);
      showSnackbar("Animal Added Successfully", "success");
      navigate("/animals");
    } catch {
      showSnackbar("Failed to add animal", "error");
    }
  };

  return (
    <Card sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Add Animal</Typography>

        <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={2}>

          {/* Tag Number */}
          <TextField
            label="Tag Number"
            name="tag_no"
            value={formData.tag_no}
            onChange={handleChange}
            required
          />

          {/* Animal Type */}
          <TextField
            select
            label="Animal Type"
            name="animal_type"
            value={formData.animal_type}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Buffalo">Buffalo</MenuItem>
            <MenuItem value="Cow">Cow</MenuItem>
          </TextField>

          {/* Breed */}
          <TextField
            select
            label="Breed"
            name="breed_type"
            value={formData.breed_type}
            onChange={handleChange}
            disabled={!formData.animal_type}
          >
            <MenuItem value="">Select</MenuItem>
            {breeds.map(b => (
              <MenuItem key={b.id} value={b.breed}>{b.breed}</MenuItem>
            ))}
          </TextField>

          {/* Gender */}
          <TextField
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          {/* DOB */}
          <TextField
            type="date"
            label="DOB"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Farm */}
          {!isEmployee ? (
            <TextField
              select
              label="Farm"
              name="farm_id"
              value={formData.farm_id ?? ""}
              onChange={handleChange}
            >
              <MenuItem value="">Select</MenuItem>
              {pastures.map(f => (
                <MenuItem key={f.pasture_id} value={f.pasture_id}>{f.name}</MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              label="Farm"
              name="farm_id"
              value={formData.farm_id ?? ""}
              disabled
            />
          )}

          {/* Lactation */}
          <TextField
            select
            label="Lactation"
            name="lactation_no"
            value={formData.lactation_no ?? ""}
            onChange={handleChange}
          >
            <MenuItem value="">Select</MenuItem>
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </TextField>

          {/* Milking */}
          <TextField
            select
            label="Milking Status"
            name="milking_status"
            value={formData.milking_status}
            onChange={handleChange}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>

          {/* Lifecycle */}
          <TextField
            select
            label="Lifecycle"
            name="lifecycle"
            value={formData.lifecycle}
            onChange={handleChange}
            disabled={!formData.gender}
          >
            <MenuItem value="">Select</MenuItem>
            {lifecycles.map(l => (
              <MenuItem key={l.id} value={l.event_type}>{l.event_type}</MenuItem>
            ))}
          </TextField>

          {/* Breeding Status */}
          <TextField
            label="Breeding Status"
            name="breeding_status"
            value={formData.breeding_status}
            onChange={handleChange}
          />

          {/* Mother Tag */}
          <TextField
            select
            label="Mother Tag"
            name="mother_tag"
            value={formData.mother_tag}
            onChange={handleChange}
            disabled={!formData.animal_type}
          >
            <MenuItem value="">Select</MenuItem>
            {femaleAnimals.map(a => (
              <MenuItem key={a.tag_no} value={a.tag_no}>{a.tag_no}</MenuItem>
            ))}
          </TextField>

          {/* Father Tag */}
          <TextField
            select
            label="Father Tag"
            name="father_tag"
            value={formData.father_tag}
            onChange={handleChange}
            disabled={!formData.animal_type}
          >
            <MenuItem value="">Select</MenuItem>
            {maleAnimals.map(a => (
              <MenuItem key={a.tag_no} value={a.tag_no}>{a.tag_no}</MenuItem>
            ))}
          </TextField>

        </Box>

        <Box textAlign="right" mt={3}>
          <Button variant="contained" onClick={handleSubmit}>
            Save Animal
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default AddAnimal;
