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
  getheatScoreLists,
  addHeatScoreList,
  deleteScoreList,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const HeatScoreList = () => {
  const { showSnackbar } = useSnackbar();

  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialogs
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // form states
  const [id, setId] = useState(null);
  const [heatValue, setHeatValue] = useState("");
  const [description, setDescription] = useState("");

  /* ================= FETCH ================= */
  const fetchHeatScores = async () => {
    setLoading(true);
    try {
      const res = await getheatScoreLists();
      setScores(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch heat scores", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeatScores();
  }, []);

  /* ================= ADD ================= */
  const handleSave = async () => {
    if (!heatValue || !description.trim()) {
      return showSnackbar("All fields are required", "warning");
    }

    try {
      await addHeatScoreList({
        heat_value: Number(heatValue),
        description,
      });

      showSnackbar("Heat score added successfully", "success");
      setOpen(false);
      resetForm();
      fetchHeatScores();
    } catch {
      showSnackbar("Failed to add heat score", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await deleteScoreList({ id });
      showSnackbar("Heat score deleted", "success");
      fetchHeatScores();
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
    setHeatValue("");
    setDescription("");
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Heat Scores</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} className="bg-color">
          Add Heat Score
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
                <TableCell sx={{py:1}}><b>Heat Value</b></TableCell>
                <TableCell sx={{py:1}}><b>Description</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {scores.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{py:1}}>{row.id}</TableCell>
                  <TableCell sx={{py:1}}>{row.heat_value}</TableCell>
                  <TableCell sx={{py:1}}>{row.description}</TableCell>
                  <TableCell align="center" sx={{py:1}}>
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

              {scores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No heat scores found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          resetForm();
        }}
      >
        <DialogTitle>Add Heat Score</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Heat Value"
              type="number"
              size="small"
              value={heatValue}
              onChange={(e) => setHeatValue(e.target.value)}
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
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this heat score?
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

export default HeatScoreList;
