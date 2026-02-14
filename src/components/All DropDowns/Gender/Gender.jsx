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
import { getAllGenders, addGender, deleteGender } from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const Gender = () => {
  const { showSnackbar } = useSnackbar();
  const [genders, setGenders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newGender, setNewGender] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch genders
  const fetchGenders = async () => {
    setLoading(true);
    try {
      const res = await getAllGenders();
      setGenders(res.data || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to fetch genders", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenders();
  }, []);

  // Add new gender
  const handleAdd = async () => {
    if (!newGender.trim()) return showSnackbar("Gender cannot be empty", "warning");

    setAdding(true);
    try {
      await addGender({ gender: newGender });
      showSnackbar("Gender added successfully", "success");
      setNewGender("");
      fetchGenders();
      setAddDialogOpen(false); // Close dialog after adding
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add gender", "error");
    } finally {
      setAdding(false);
    }
  };

  // Delete gender
  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGender({ id: deleteId });
      showSnackbar("Gender deleted", "success");
      fetchGenders();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to delete gender", "error");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Gender Details</Typography>
        <Button variant="contained" sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}  onClick={() => setAddDialogOpen(true)}>
          Add Gender
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 700, boxShadow: "0 3px 8px rgba(0,0,0,0.1)", borderRadius: 2 }}
        >
         <Table size="small">
  <TableHead>
    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>ID</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>Gender</b>
      </TableCell>
      <TableCell align="center" sx={{ py: 1, fontWeight: 500 }}>
        <b>Actions</b>
      </TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {genders.map((g) => (
      <TableRow
        key={g.id}
        sx={{ "&:hover": { backgroundColor: "#f0f8ff" } }}
      >
        <TableCell align="center" sx={{ py: 1 }}>
          {g.id}
        </TableCell>
        <TableCell align="center" sx={{ py: 1 }}>
          {g.gender}
        </TableCell>
        <TableCell align="center" sx={{ py: 1 }}>
          <IconButton
            color="error"
            size="small"
            onClick={() => confirmDelete(g.id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
    ))}

    {genders.length === 0 && (
      <TableRow>
        <TableCell colSpan={3} align="center" sx={{ py: 1.5 }}>
          No genders found
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>

        </TableContainer>
      )}

      {/* Add Gender Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Gender</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Gender"
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}  onClick={handleAdd} disabled={adding}>
            {adding ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this gender?</Typography>
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

export default Gender;
