import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllAnimalTypes, addAnimalType, deleteAnimalType } from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const AnimalTypes = () => {
  const { showSnackbar } = useSnackbar();
  const [animalTypes, setAnimalTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch animal types
  const fetchAnimalTypes = async () => {
    setLoading(true);
    try {
      const res = await getAllAnimalTypes();
      setAnimalTypes(res.data || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch animal types", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalTypes();
  }, []);

  // Add new type
  const handleAdd = async () => {
    if (!newType.trim()) return showSnackbar("Type cannot be empty", "warning");

    setAdding(true);
    try {
      await addAnimalType({ type: newType });
      showSnackbar("Animal type added successfully", "success");
      setNewType("");
      fetchAnimalTypes();
      setAddDialogOpen(false); // Close dialog after adding
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add animal type", "error");
    } finally {
      setAdding(false);
    }
  };

  // Delete type
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAnimalType({ id: deleteId });
      showSnackbar("Animal type deleted", "success");
      fetchAnimalTypes();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete animal type", "error");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box >
      {/* Header with title and add button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Animal Types</Typography>
        <Button variant="contained" sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }} onClick={() => setAddDialogOpen(true)}>
          Add New Type
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 700, boxShadow: "0 3px 8px rgba(0,0,0,0.1)", borderRadius: 1 }}
        >
          <Table size="small">
  <TableHead>
    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
      <TableCell align="center" sx={{ py: 1.0, fontWeight: 500 }}>
        <b>ID</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1.0, fontWeight: 500 }}>
        <b>Type</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1.0, fontWeight: 500 }}>
        <b>Actions</b>
      </TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {animalTypes.map((animal) => (
      <TableRow
        key={animal.id}
        sx={{
          "&:hover": { backgroundColor: "#f0f8ff" },
          height: 36,           // optional – neat row height
        }}
      >
        <TableCell align="center" sx={{ py: 1.0 }}>
          {animal.id}
        </TableCell>
        <TableCell align="center" sx={{ py: 1.0 }}>
          {animal.type}
        </TableCell>
        <TableCell align="center" sx={{ py: 1.0 }}>
          <IconButton
            color="error"
            size="small"
            onClick={() => confirmDelete(animal.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}

    {animalTypes.length === 0 && (
      <TableRow>
        <TableCell colSpan={3} align="center" sx={{ py: 1 }}>
          No animal types found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

        </TableContainer>
      )}

      {/* Add New Type Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Animal Type</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Type Name"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} sx={{color:"rgb(42, 8, 11)"}}>Cancel</Button>
          <Button
            variant="contained"
             sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }} 
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this animal type?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AnimalTypes;
