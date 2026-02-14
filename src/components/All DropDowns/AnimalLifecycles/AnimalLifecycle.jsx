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
  getAnimalLifecycle,
  addAnimalLifecycle,
  deleteAnimalLifecycle,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const AnimalLifecycle = () => {
  const { showSnackbar } = useSnackbar();

  const [lifecycles, setLifecycles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [eventType, setEventType] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch lifecycle list
  const fetchLifecycle = async () => {
  setLoading(true);
  try {
    const res = await getAnimalLifecycle();

    // ✅ CORRECT handling
    setLifecycles(res.data?.details || []);
  } catch (err) {
    showSnackbar("Failed to fetch lifecycle data", "error");
    setLifecycles([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchLifecycle();
  }, []);

  // Add lifecycle (ONLY event_type)
  const handleAdd = async () => {
    if (!eventType.trim())
      return showSnackbar("Event type is required", "warning");

    setAdding(true);
    try {
      await addAnimalLifecycle({
        event_type: eventType,
      });

      showSnackbar("Lifecycle added successfully", "success");
      setEventType("");
      setAddOpen(false);
      fetchLifecycle();
    } catch (err) {
      showSnackbar("Failed to add lifecycle", "error");
    } finally {
      setAdding(false);
    }
  };

  // Delete lifecycle
  const handleDelete = async () => {
    try {
      await deleteAnimalLifecycle({ lifecycle_id: deleteId });
      showSnackbar("Lifecycle deleted successfully", "success");
      fetchLifecycle();
    } catch (err) {
      showSnackbar("Failed to delete lifecycle", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Animal Lifecycle</Typography>
        <Button variant="contained" sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }} onClick={() => setAddOpen(true)}>
          Add Event Type
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
                <TableCell align="center"><b>ID</b></TableCell>
                <TableCell align="center"><b>Event Type</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lifecycles.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{row.event_type}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteId(row.id);
                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {lifecycles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No lifecycle events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Lifecycle Event</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Event Type"
            fullWidth
            size="small"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)} sx={{color: "rgb(42, 8, 11)"}}>Cancel</Button>
          <Button variant="contained" sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }} onClick={handleAdd} disabled={adding}>
            {adding ? <CircularProgress size={20} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this lifecycle?
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

export default AnimalLifecycle;
