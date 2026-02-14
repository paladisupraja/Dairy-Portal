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
import EditIcon from "@mui/icons-material/Edit";

import { useSnackbar } from "../../../context/SnackbarContext";
import {
  getUnits,
  addUnit,
  updateUnit,
  deleteUnit,
} from "../../../services";

const Units = () => {
  const { showSnackbar } = useSnackbar();

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    label: "",
    description: "",
  });

  /* ================= FETCH ================= */
  const fetchUnits = async () => {
    try {
      setLoading(true);
      const res = await getUnits();
      setUnits(res.data.details || []);
    } catch (error) {
      showSnackbar("Failed to load units", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  /* ================= HANDLERS ================= */
  const handleOpenAdd = () => {
    setEditId(null);
    setFormData({ code: "", label: "", description: "" });
    setOpen(true);
  };

  const handleEdit = (row) => {
    setEditId(row.id);
    setFormData({
      code: row.code,
      label: row.label,
      description: row.description || "",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE ================= */
  const handleSubmit = async () => {
    if (!formData.code || !formData.label) {
      showSnackbar("Code and Label are required", "warning");
      return;
    }

    try {
      if (editId) {
        await updateUnit({ id: editId, ...formData });
        showSnackbar("Unit updated successfully", "success");
      } else {
        await addUnit(formData);
        showSnackbar("Unit added successfully", "success");
      }
      handleClose();
      fetchUnits();
    } catch (error) {
      showSnackbar("Operation failed", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;

    try {
      await deleteUnit({ id });
      showSnackbar("Unit deleted successfully", "success");
      fetchUnits();
    } catch (error) {
      showSnackbar("Delete failed", "error");
    }
  };

  /* ================= UI ================= */
  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Units</Typography>
        <Button variant="contained" sx={{
            backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
          }}onClick={handleOpenAdd}>
          Add Unit
        </Button>
      </Stack>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{py:1}}><b>ID</b></TableCell>
                <TableCell sx={{py:1}}><b>Code</b></TableCell>
                <TableCell sx={{py:1}}><b>Label</b></TableCell>
                <TableCell sx={{py:1}}><b>Description</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No units found
                  </TableCell>
                </TableRow>
              ) : (
                units.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{py:1}}>{row.id}</TableCell>
                    <TableCell sx={{py:1}}>{row.code}</TableCell>
                    <TableCell sx={{py:1}}>{row.label}</TableCell>
                    <TableCell sx={{py:1}}>{row.description || "-"}</TableCell>
                    <TableCell align="center" sx={{py:1}}>
                      <IconButton onClick={() => handleEdit(row)}>
                        <EditIcon sx={{color:"rgb(42,8,11)"}} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ================= DIALOG ================= */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? "Edit Unit" : "Add Unit"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Label"
              name="label"
              value={formData.label}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{
            backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
          }}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Units;
