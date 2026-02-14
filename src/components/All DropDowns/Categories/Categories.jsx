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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getMedicineCategories,
  addMedicineCategory,
  updateMedicineCategory,
  deleteMedicineCategory,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const Categories = () => {
  const { showSnackbar } = useSnackbar();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialog states
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // form states
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /* ================= FETCH ================= */
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getMedicineCategories();
      setCategories(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSave = async () => {
    if (!name.trim()) {
      return showSnackbar("Category name is required", "warning");
    }

    try {
      if (isEdit) {
        await updateMedicineCategory({ id, name, description });
        showSnackbar("Category updated successfully", "success");
      } else {
        await addMedicineCategory({ name, description });
        showSnackbar("Category added successfully", "success");
      }

      setOpen(false);
      resetForm();
      fetchCategories();
    } catch {
      showSnackbar("Operation failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await deleteMedicineCategory({ id });
      showSnackbar("Category deleted", "success");
      fetchCategories();
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteOpen(false);
      setId(null);
    }
  };

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setId(null);
    setName("");
    setDescription("");
    setIsEdit(false);
  };

  const openEdit = (row) => {
    setId(row.id);
    setName(row.name);
    setDescription(row.description);
    setIsEdit(true);
    setOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Medicine Categories</Typography>
        <Button variant="contained" sx={{
            backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
          }}onClick={() => setOpen(true)}>
          Add Category
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ py: 1 }}><b>ID</b></TableCell>
                <TableCell sx={{py:1}}><b>Name</b></TableCell>
                <TableCell sx={{py:1}}><b>Description</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{py:1}}>{row.id}</TableCell>
                  <TableCell sx={{py:1}}>{row.name}</TableCell>
                  <TableCell sx={{py:1}}>{row.description || "-"}</TableCell>
                  <TableCell align="center" sx={{py:1}}>
                    <IconButton onClick={() => openEdit(row)}>
                      <EditIcon sx={{color:"rgb(42,8,11)"}} />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setId(row.id);
                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No categories found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm(); }}>
        <DialogTitle>
          {isEdit ? "Edit Category" : "Add Category"}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Category Name"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              size="small"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm(); }} sx={{color:"rgb(42,8,11)"}}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} sx={{
            backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
          }}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this category?</Typography>
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

export default Categories;
