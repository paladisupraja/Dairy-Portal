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
import "../../../index.css";

import {
  addMedicineList,
  getMedicineList,
  updateMedicineList,
  deleteMedicineList,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const MedicineList = () => {
  const { showSnackbar } = useSnackbar();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialogs
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // form states
  const [id, setId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  /* ================= FETCH ================= */
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const res = await getMedicineList();
      setMedicines(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch medicines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  /* ================= ADD / UPDATE ================= */
  const handleSave = async () => {
    if (!name.trim()) {
      return showSnackbar("Medicine name is required", "warning");
    }

    try {
      if (isEdit) {
        await updateMedicineList({
          id,
          name,
          description,
        });
        showSnackbar("Medicine updated successfully", "success");
      } else {
        await addMedicineList({
          name,
          description,
        });
        showSnackbar("Medicine added successfully", "success");
      }

      setOpen(false);
      resetForm();
      fetchMedicines();
    } catch {
      showSnackbar("Operation failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await deleteMedicineList({ id });
      showSnackbar("Medicine deleted", "success");
      fetchMedicines();
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
    setDescription(row.description || "");
    setIsEdit(true);
    setOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Medicine List</Typography>
        <Button variant="contained" className="bg-color" onClick={() => setOpen(true)}>
          Add Medicine
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
                <TableCell align="center" sx={{py:1}}><b>ID</b></TableCell>
                <TableCell sx={{py:1}}><b>Name</b></TableCell>
                <TableCell sx={{py:1}}><b>Description</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {medicines.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{py:1}}>{row.id}</TableCell>
                  <TableCell sx={{py:1}}>{row.name}</TableCell>
                  <TableCell sx={{py:1}}>{row.description || "-"}</TableCell>
                  <TableCell align="center" sx={{py:1}}>
                    <IconButton onClick={() => openEdit(row)}>
                      <EditIcon className="color" />
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

              {medicines.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No medicines found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <DialogTitle>
          {isEdit ? "Edit Medicine" : "Add Medicine"}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Medicine Name"
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
          <Button className="color"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} className="bg-color">
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this medicine?
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

export default MedicineList;
