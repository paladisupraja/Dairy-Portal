import React, { useState, useContext } from "react";
import { Box, Button, Card, CardContent, TextField, MenuItem, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { addAnimal } from "../../services";
import { AnimalDropdownContext } from "../../context/AnimalDropdownContext";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MedicationIcon from "@mui/icons-material/Medication";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import "../../index.css";

const AddAnimal = () => {

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    animalTypes, genders, pastures, vendors, breeds,
    femaleAnimals, maleAnimals, lifecycles, breedingTypes,
    loadBreeds, loadParentAnimals, loadLifecycle, loadBreedingTypes
  } = useContext(AnimalDropdownContext);

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  const [animalSaved, setAnimalSaved] = useState(false);
  const [savedAnimalId, setSavedAnimalId] = useState(null);

  const [formData, setFormData] = useState({
    tag_no: "",
    animal_type: "",
    breed_type: "",
    gender: "",
    dob: "",
    farm_id: isEmployee ? Number(user?.farm_id) : "",
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

  // ✅ Validation
  const validate = () => {
    if (!formData.tag_no) return "Tag required";
    if (!formData.animal_type) return "Animal type required";
    if (!formData.gender) return "Gender required";
    if (!formData.farm_id) return "Farm required";
    if (!formData.weight || Number(formData.weight) <= 0)
    return "Weight must be greater than 0";
    return null;
  };

  // ✅ Change
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "weight") {
  if (value === "" || Number(value) <= 0) {
    return setFormData(p => ({ ...p, weight: "" }));
  }
}
    if (name === "animal_type") {
      loadBreeds(value);
      loadParentAnimals(value);
      return setFormData(p => ({ ...p, animal_type: value, breed_type: "", mother_tag: "", father_tag: "" }));
    }

    if (name === "gender") {
      loadLifecycle(value);
      return setFormData(p => ({
        ...p,
        gender: value,
        milking_status: value === "Female" ? "Yes" : "No",
        lifecycle: "",
        breeding_status: ""
      }));
    }

    if (name === "lifecycle") {
      loadBreedingTypes(value);
      return setFormData(p => ({ ...p, lifecycle: value, breeding_status: "" }));
    }

    setFormData(p => ({ ...p, [name]: value }));
  };

  // ✅ Submit
  const handleSubmit = async () => {

    const errMsg = validate();
    if (errMsg) return showSnackbar(errMsg, "error");

    try {
      const res = await addAnimal(formData);

      const id = res?.data?.details?.animal?.animal_id;
      setSavedAnimalId(id);
      setAnimalSaved(true);

      showSnackbar("Animal Added", "success");

    } catch (err) {
      const be = err?.response?.data;
      showSnackbar(be?.error?.join(", ") || be?.message || "Add failed", "error");
    }
  };

  return (
    <Card sx={{ maxWidth: 1100, mx: "auto", mt: 4 }}>
      <CardContent>

        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={3}>
          
          <Button startIcon={<ArrowBackIcon />}  className="color" sx={{
                textTransform: "none",fontWeight: 500
      
              }} onClick={() => navigate("/animals")}>Back</Button>
          <Typography variant="h5">Add Animal</Typography>
          <Box width={80} />
        </Box>

        {/* Form */}
        <Box display="grid" gridTemplateColumns="repeat(3,1fr)" gap={2}>

          <TextField label="Tag" className="label" value={formData.tag_no} onChange={handleChange} name="tag_no" />

          <TextField select label="Animal Type" name="animal_type" value={formData.animal_type} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {animalTypes.map(x => <MenuItem key={x.id} value={x.type}>{x.type}</MenuItem>)}
          </TextField>

          <TextField select label="Breed" name="breed_type" value={formData.breed_type} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {breeds.map(x => <MenuItem key={x.id} value={x.breed}>{x.breed}</MenuItem>)}
          </TextField>

          <TextField select label="Gender" name="gender" value={formData.gender} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {genders.map(x => <MenuItem key={x.id} value={x.gender}>{x.gender}</MenuItem>)}
          </TextField>

          <TextField type="date" label="DOB" name="dob"
            value={formData.dob}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
          />

          <TextField select label="Lifecycle" name="lifecycle" value={formData.lifecycle} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {lifecycles.map(x => <MenuItem key={x.id} value={x.event_type}>{x.event_type}</MenuItem>)}
          </TextField>

          <TextField select label="Breeding Status" name="breeding_status"
            value={formData.breeding_status}
            onChange={handleChange}
            disabled={!formData.lifecycle}>
            <MenuItem value="">Select</MenuItem>
            {breedingTypes.map(x => <MenuItem key={x.id} value={x.type}>{x.type}</MenuItem>)}
          </TextField>

          {/* ✅ Farm */}
          {!isEmployee ? (
            <TextField select label="Farm" name="farm_id" value={formData.farm_id} onChange={handleChange}>
              <MenuItem value="">Select</MenuItem>
              {pastures.map(x => <MenuItem key={x.pasture_id} value={x.pasture_id}>{x.name}</MenuItem>)}
            </TextField>
          ) : (
            <TextField label="Farm" value={formData.farm_id} disabled />
          )}

          {/* ✅ Lactation */}
          <TextField select label="Lactation" name="lactation_no" value={formData.lactation_no} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </TextField>

          {/* ✅ Milking */}
          <TextField select label="Milking Status" name="milking_status"
            value={formData.milking_status} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </TextField>

          {/* ✅ Mother */}
          <TextField select label="Mother Tag" name="mother_tag" value={formData.mother_tag} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {femaleAnimals.map(x => <MenuItem key={x.tag_no} value={x.tag_no}>{x.tag_no}</MenuItem>)}
          </TextField>

          {/* ✅ Father */}
          <TextField select label="Father Tag" name="father_tag" value={formData.father_tag} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {maleAnimals.map(x => <MenuItem key={x.tag_no} value={x.tag_no}>{x.tag_no}</MenuItem>)}
          </TextField>

          {/* ✅ Weight */}
          <TextField label="Weight" type="number"name="weight" value={formData.weight} onChange={handleChange} inputProps={{min:1}}/>

          {/* ✅ Vendor */}
          <TextField select label="Vendor" name="vendor_name" value={formData.vendor_name} onChange={handleChange}>
            <MenuItem value="">Select</MenuItem>
            {vendors.map(x => <MenuItem key={x.id} value={x.vendor_name}>{x.vendor_name}</MenuItem>)}
          </TextField>

        </Box>

        {/* Save */}
        <Box textAlign="right" mt={3}>
          <Button variant="contained" onClick={handleSubmit} className="bg-color">
            Save Animal
          </Button>
        </Box>

        {/* Health Flow */}
        {animalSaved && (
          <Box mt={3} display="flex" justifyContent="space-between">
            <Typography>Add Health Details</Typography>
          <Box display="flex" gap={2}>
  <Button
    variant="contained"
    startIcon={<VaccinesIcon />}
    onClick={() =>
      navigate(`/add-vaccine/${savedAnimalId}`, {
        state: { tagNo: formData.tag_no }
      })
    }
  >
    Vaccine
  </Button>

  <Button
    variant="contained"
    color="success"
    startIcon={<MedicationIcon />}
    onClick={() =>
      navigate("/add-medicine", {
        state: { animalTags: [formData.tag_no] }
      })
    }
  >
    Medicine
  </Button>

  <Button
    variant="outlined"
    color="error"
    startIcon={<SkipNextIcon />}
    onClick={() => navigate("/animals")}
  >
    Skip
  </Button>
</Box>

          </Box>
        )}

      </CardContent>
    </Card>
  );
};

export default AddAnimal;
