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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getBreedingTypes,
  addBreedingType,
  deleteBreedingType,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const BreedingTypes = () => {
  const { showSnackbar } = useSnackbar();

  const [breedingTypes, setBreedingTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [typeName, setTypeName] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch breeding types
  const fetchBreedingTypes = async () => {
    setLoading(true);
    try {
      const res = await getBreedingTypes();
      setBreedingTypes(res.data || []);
    } catch (err) {
      showSnackbar("Failed to fetch breeding types", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreedingTypes();
  }, []);

  // Add breeding type (ONLY TYPE)
  const handleAdd = async () => {
    if (!typeName.trim())
      return showSnackbar("Type is required", "warning");

    setAdding(true);
    try {
      await addBreedingType({ type: typeName });
      showSnackbar("Breeding type added successfully", "success");
      setTypeName("");
      setAddOpen(false);
      fetchBreedingTypes();
    } catch (err) {
      showSnackbar("Failed to add breeding type", "error");
    } finally {
      setAdding(false);
    }
  };

  // Delete breeding type
  const handleDelete = async () => {
    try {
      await deleteBreedingType({ id: deleteId });
      showSnackbar("Breeding type deleted", "success");
      fetchBreedingTypes();
    } catch (err) {
      showSnackbar("Failed to delete breeding type", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Breeding Types</Typography>
        <Button variant="contained" className="bg-color" onClick={() => setAddOpen(true)}>
          Add Type
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 700, borderRadius: 2 }}
        >
         <Table size="small">
  <TableHead>
    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
      <TableCell align="center" sx={{ py: 1.0 }}>
        <b>ID</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1.0 }}>
        <b>Type</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1.0 }}>
        <b>Actions</b>
      </TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {breedingTypes.map((row) => (
      <TableRow
        key={row.id}
        hover
        sx={{ height: 36 }}   // 👈 row height reduce
      >
        <TableCell align="center" sx={{ py: 1.0 }}>
          {row.id}
        </TableCell>
        <TableCell align="center" sx={{ py: 1.0 }}>
          {row.type}
        </TableCell>
        <TableCell align="center" sx={{ py: 1.0}}>
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

    {breedingTypes.length === 0 && (
      <TableRow>
        <TableCell colSpan={3} align="center" sx={{ py: 1 }}>
          No breeding types found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Breeding Type</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Type"
            fullWidth
            size="small"
            value={typeName}
            onChange={(e) => setTypeName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} className="color">Cancel</Button>
          <Button
            variant="contained"
         className="bg-color"
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this breeding type?
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

export default BreedingTypes;
