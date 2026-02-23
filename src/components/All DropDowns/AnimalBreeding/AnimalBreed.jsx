import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getAnimalBreeds,
  addAnimalBreed,
  deleteAnimalBreed,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const AnimalBreed = () => {
  const { showSnackbar } = useSnackbar();

  const [animalType, setAnimalType] = useState("Buffalo");
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [breedName, setBreedName] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch breeds
  const fetchBreeds = async (type) => {
    setLoading(true);
    try {
      const res = await getAnimalBreeds(type);
      setBreeds(res.data || []);
    } catch (err) {
      showSnackbar("Failed to fetch breeds", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds(animalType);
  }, [animalType]);

  // Add breed
  const handleAddBreed = async () => {
    if (!breedName.trim())
      return showSnackbar("Breed name is required", "warning");

    setAdding(true);
    try {
      await addAnimalBreed({
        animal_type: animalType,
        breed: breedName,
      });
      showSnackbar("Breed added successfully", "success");
      setBreedName("");
      setAddOpen(false);
      fetchBreeds(animalType);
    } catch (err) {
      showSnackbar("Failed to add breed", "error");
    } finally {
      setAdding(false);
    }
  };

  // Delete breed
  const handleDelete = async () => {
    try {
      await deleteAnimalBreed({ id: deleteId });
      showSnackbar("Breed deleted successfully", "success");
      fetchBreeds(animalType);
    } catch (err) {
      showSnackbar("Failed to delete breed", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box >
      {/* HEADER ROW */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Title */}
        <Typography variant="h5">Animal Breeds</Typography>

        {/* Animal Type Buttons */}
        <Stack direction="row" spacing={2}>
          {["Buffalo", "Cow"].map((type) => (
            <Button
           className="bg-color"
              key={type}
              variant={animalType === type ? "contained" : "outlined"}
              onClick={() => setAnimalType(type)}
            >
              {type}
            </Button>
          ))}
        </Stack>

        {/* Add Button */}
        <Button variant="contained" className="bg-color" onClick={() => setAddOpen(true)}>
          Add Breed
        </Button>
      </Box>

      {/* TABLE */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 800,
            borderRadius: 2,
            boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Table size="small">
  <TableHead>
    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>ID</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>Animal Type</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>Breed</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>Actions</b>
      </TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {breeds.map((row) => (
      <TableRow
        key={row.id}
        sx={{ "&:hover": { backgroundColor: "#f0f8ff" } }}
      >
        <TableCell align="center" sx={{ py: 1 }}>
          {row.id}
        </TableCell>
        <TableCell align="center" sx={{ py: 1 }}>
          {row.animal_type}
        </TableCell>
        <TableCell align="center" sx={{ py: 1 }}>
          {row.breed}
        </TableCell>
        <TableCell align="center" sx={{ py: 1 }}>
          <IconButton
            color="error"
            size="small"
            onClick={() => {
              setDeleteId(row.id);
              setDeleteOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}

    {breeds.length === 0 && (
      <TableRow>
        <TableCell colSpan={4} align="center" sx={{ py: 1 }}>
          No breeds found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

        </TableContainer>
      )}

      {/* ADD DIALOG */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Breed ({animalType})</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Breed Name"
            fullWidth
            size="small"
            value={breedName}
            onChange={(e) => setBreedName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleAddBreed} disabled={adding} className="bg-color">
            {adding ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this breed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnimalBreed;
