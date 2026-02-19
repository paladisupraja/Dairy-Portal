import React, { useState, useEffect, useContext } from "react";
import {
  Box, Button, Card, CardContent,
  TextField, Typography, MenuItem
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { animalUpdate, getAnimalById } from "../../services";
import { AnimalDropdownContext } from "../../context/AnimalDropdownContext";

const AnimalEditForm = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const { showSnackbar } = useSnackbar();

  const animalId = location.state?.animalId;

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  const {
    animalTypes, genders, pastures, vendors,
    breeds, femaleAnimals, maleAnimals,
    lifecycles, breedingTypes,
    loadBreeds, loadParentAnimals,
    loadLifecycle, loadBreedingTypes
  } = useContext(AnimalDropdownContext);

  const [formData, setFormData] = useState({
    animal_id: "",
    tag_no: "",
    animal_type: "",
    breed_type: "",
    gender: "",
    dob: "",
    farm_id: "",
    lactation_no: "",
    milking_status: "",
    lifecycle: "",
    breeding_status: "",
    mother_tag: "",
    father_tag: "",
    weight: "",
    vendor_name: ""
  });

  const today = new Date().toISOString().split("T")[0];

  // ✅ Load Animal
  useEffect(() => {
    if (animalId) loadAnimal();
  }, [animalId]);

  const loadAnimal = async () => {
    try {
      const res = await getAnimalById(animalId);
      const a = res.data.details;

      setFormData({
        animal_id: a.animal_id,
        tag_no: a.tag_no,
        animal_type: a.animal_type,
        breed_type: a.breed_type,
        gender: a.gender,
        dob: a.dob,
        farm_id: a.farm_id,
        lactation_no: a.lactation_no,
        milking_status: a.milking_status,
        lifecycle: a.lifecycle,
        breeding_status: a.breeding_status,
        mother_tag: a.mother_tag,
        father_tag: a.father_tag,
        weight: a.weight,
        vendor_name: a.vendor_name
      });

      if (a.animal_type) {
        loadBreeds(a.animal_type);
        loadParentAnimals(a.animal_type);
      }

      if (a.gender) loadLifecycle(a.gender);
      if (a.lifecycle) loadBreedingTypes(a.lifecycle);

    } catch {
      showSnackbar("Animal Load Failed", "error");
    }
  };

  // ✅ Change
  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "animal_type") {
      loadBreeds(value);
      loadParentAnimals(value);
    }

    if (name === "gender") {
      loadLifecycle(value);
      setFormData(p => ({
        ...p,
        milking_status: value === "Female" ? "Yes" : "No"
      }));
    }

    if (name === "lifecycle") loadBreedingTypes(value);

    setFormData(p => ({ ...p, [name]: value }));
  };

  // ✅ Update
  const handleUpdate = async () => {
    try {
      await animalUpdate(formData);
      showSnackbar("Animal Updated", "success");
      navigate("/animals");
    } catch {
      showSnackbar("Update Failed", "error");
    }
  };

  return (
    <Card sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      <CardContent>

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/animals")} sx={{
                textTransform: "none",color: "rgb(42, 8, 11)"
      
              }}>
            Back
          </Button>
          <Typography variant="h5">Edit Animal</Typography>
          <Box width={80} />
        </Box>

        <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={2}>

          <TextField label="Tag" value={formData.tag_no} disabled />

          <TextField select label="Animal Type" name="animal_type"
            value={formData.animal_type} onChange={handleChange}>
            {animalTypes.map(x => <MenuItem key={x.id} value={x.type}>{x.type}</MenuItem>)}
          </TextField>

          <TextField select label="Breed" name="breed_type"
            value={formData.breed_type} onChange={handleChange}>
            {breeds.map(x => <MenuItem key={x.id} value={x.breed}>{x.breed}</MenuItem>)}
          </TextField>

          <TextField select label="Gender" name="gender"
            value={formData.gender} onChange={handleChange}>
            {genders.map(x => <MenuItem key={x.id} value={x.gender}>{x.gender}</MenuItem>)}
          </TextField>

          <TextField type="date" label="DOB" name="dob"
            value={formData.dob} onChange={handleChange}
            InputLabelProps={{ shrink: true }} inputProps={{ max: today }}
          />

          <TextField select label="Lifecycle" name="lifecycle"
            value={formData.lifecycle} onChange={handleChange}>
            {lifecycles.map(x => <MenuItem key={x.id} value={x.event_type}>{x.event_type}</MenuItem>)}
          </TextField>

          <TextField select label="Breeding Status" name="breeding_status"
            value={formData.breeding_status} onChange={handleChange}>
            {breedingTypes.map(x => <MenuItem key={x.id} value={x.type}>{x.type}</MenuItem>)}
          </TextField>

          <TextField select label="Farm" name="farm_id"
            value={isEmployee ? user?.farm_id : formData.farm_id}
            disabled={isEmployee}
            onChange={handleChange}>
            {pastures.map(x => <MenuItem key={x.pasture_id} value={x.pasture_id}>{x.name}</MenuItem>)}
          </TextField>

          <TextField label="Lactation" name="lactation_no"
            value={formData.lactation_no} onChange={handleChange}
          />

          <TextField select label="Milking Status" name="milking_status"
            value={formData.milking_status} onChange={handleChange}>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>

          <TextField select label="Mother Tag" name="mother_tag"
            value={formData.mother_tag} onChange={handleChange}>
            {femaleAnimals.map(x => <MenuItem key={x.tag_no} value={x.tag_no}>{x.tag_no}</MenuItem>)}
          </TextField>

          <TextField select label="Father Tag" name="father_tag"
            value={formData.father_tag} onChange={handleChange}>
            {maleAnimals.map(x => <MenuItem key={x.tag_no} value={x.tag_no}>{x.tag_no}</MenuItem>)}
          </TextField>

          <TextField label="Weight" name="weight"
            value={formData.weight} onChange={handleChange}
          />

          <TextField select label="Vendor" name="vendor_name"
            value={formData.vendor_name} onChange={handleChange}>
            {vendors.map(x => <MenuItem key={x.id} value={x.vendor_name}>{x.vendor_name}</MenuItem>)}
          </TextField>

        </Box>

        <Box textAlign="right" mt={3}>
          <Button variant="contained" onClick={handleUpdate} sx={{backgroundColor: "rgb(42, 8, 11)", "&:hover": { backgroundColor: "rgb(30, 5, 5)" }}}>
            Update Animal
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default AnimalEditForm;
