import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress, Paper, TableContainer } from "@mui/material";
import { useSnackbar } from "../../../context/SnackbarContext";
import { getAllAnimalTypes, addAnimalType, deleteAnimalType } from "../../../services";
import AnimalTypeTable from "./AnimalTypeTable";
import AddAnimalTypeDialog from "./AddAnimalTypeDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const AnimalTypes = () => {
  const { showSnackbar } = useSnackbar();

  const [animalTypes, setAnimalTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newType, setNewType] = useState("");
  const [adding, setAdding] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch animal types
  const fetchAnimalTypes = async () => {
    setLoading(true);
    try {
      const res = await getAllAnimalTypes();
      setAnimalTypes(res.data || []);
    } catch (err) {
      showSnackbar("Failed to fetch animal types", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimalTypes();
  }, []);

  // Add
  const handleAdd = async () => {
    if (!newType.trim()) return showSnackbar("Type cannot be empty", "warning");
    setAdding(true);
    try {
      await addAnimalType({ type: newType });
      showSnackbar("Animal type added successfully", "success");
      setNewType("");
      fetchAnimalTypes();
      setAddDialogOpen(false);
    } catch {
      showSnackbar("Failed to add animal type", "error");
    } finally {
      setAdding(false);
    }
  };

  // Delete
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
  if (!deleteId) return;

  try {
    await deleteAnimalType({ id: deleteId });   // ✅ FIXED
    showSnackbar("Animal type deleted", "success");
    fetchAnimalTypes();
  } catch {
    showSnackbar("Failed to delete animal type", "error");
  } finally {
    setDeleteDialogOpen(false);
    setDeleteId(null);
  }
};


  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Animal Types</Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "rgb(42,8,11)", "&:hover": { backgroundColor: "rgb(30,5,5)" } }}
          onClick={() => setAddDialogOpen(true)}
        >
          Add New Type
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 700, boxShadow: "0 3px 8px rgba(0,0,0,0.1)", borderRadius: 1 }}>
          <AnimalTypeTable animalTypes={animalTypes} onDeleteClick={confirmDelete} />
        </TableContainer>
      )}

      {/* Dialogs */}
      <AddAnimalTypeDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        newType={newType}
        setNewType={setNewType}
        onAdd={handleAdd}
        adding={adding}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
};

export default AnimalTypes;
