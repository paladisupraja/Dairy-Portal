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
import AddIcon from "@mui/icons-material/Add";

import { useSnackbar } from "../../../context/SnackbarContext";
import {
  getVaccineTypes,
  addVaccineType,
  deleteVaccineType,
} from "../../../services";
import "../../../index.css";

const Vaccines = () => {
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [vaccines, setVaccines] = useState([]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  /* ===== FETCH ===== */
  const fetchVaccines = async () => {
    try {
      setLoading(true);
      const res = await getVaccineTypes();
      setVaccines(res.data.details || []);
    } catch (err) {
      showSnackbar("Failed to load vaccines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  /* ===== ADD ===== */
  const handleAdd = async () => {
    if (!form.name.trim()) {
      showSnackbar("Vaccine name is required", "warning");
      return;
    }

    try {
      await addVaccineType(form);
      showSnackbar("Vaccine added successfully", "success");
      setOpen(false);
      setForm({ name: "", description: "" });
      fetchVaccines();
    } catch (err) {
      showSnackbar("Failed to add vaccine", "error");
    }
  };

  /* ===== DELETE ===== */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vaccine?")) return;

    try {
      await deleteVaccineType({ id });
      showSnackbar("Vaccine deleted successfully", "success");
      fetchVaccines();
    } catch (err) {
      showSnackbar("Failed to delete vaccine", "error");
    }
  };

  return (
    <Box>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">Vaccine Types</Typography>
        <Button
          variant="contained"
          className="bg-color"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Vaccine
        </Button>
      </Stack>

      {/* TABLE */}
      <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
        {loading ? (
          <Box p={3} textAlign="center">
            <CircularProgress size={24}/>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{py:1}}><b>ID</b></TableCell>
                <TableCell sx={{py:1}}><b>Name</b></TableCell>
                <TableCell sx={{py:1}}><b>Description</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Action</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {vaccines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No vaccines found
                  </TableCell>
                </TableRow>
              ) : (
                vaccines.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell sx={{py:1}}>{row.id}</TableCell>
                    <TableCell sx={{py:1}}>{row.name}</TableCell>
                    <TableCell sx={{py:1}}>{row.description || "-"}</TableCell>
                    <TableCell align="center" sx={{py:1}}>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* ADD DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Vaccine</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Vaccine Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleAdd} className="bg-color">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vaccines;
