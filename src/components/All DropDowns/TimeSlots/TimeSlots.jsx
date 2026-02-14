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
  Switch,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  timeSlotList,
  addTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const TimeSlots = () => {
  const { showSnackbar } = useSnackbar();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialog states
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    start_time: "",
    end_time: "",
    active: true,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* FETCH */
  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await timeSlotList({ activeOnly: true });
      setSlots(res.data?.time_slots || []);
    } catch {
      showSnackbar("Failed to fetch time slots", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  /* ADD / UPDATE */
  const handleSave = async () => {
    if (!form.name || !form.start_time || !form.end_time) {
      return showSnackbar("All fields are required", "warning");
    }

    try {
      if (isEdit) {
        await updateTimeSlot(form);
        showSnackbar("Time slot updated", "success");
      } else {
        await addTimeSlot(form);
        showSnackbar("Time slot added", "success");
      }
      setOpen(false);
      resetForm();
      fetchSlots();
    } catch {
      showSnackbar("Operation failed", "error");
    }
  };

  /* DELETE */
  const handleDelete = async () => {
    try {
      await deleteTimeSlot({ id: deleteId });
      showSnackbar("Time slot deleted", "success");
      fetchSlots();
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      start_time: "",
      end_time: "",
      active: true,
    });
    setIsEdit(false);
  };

  return (
    <Box>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Time Slots</Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
          }}
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          Add Time Slot
        </Button>
      </Box>

      {/* TABLE */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ py: 1 }}><b>ID</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Name</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Start</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>End</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Active</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {slots.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell align="center" sx={{ py: 1 }}>{s.id}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{s.name}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{s.start_time}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{s.end_time}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    {s.active ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small"
                     sx={{
            color: "rgb(42, 8, 11)",
            
          }}
                      onClick={() => {
                        setForm(s);
                        setIsEdit(true);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteId(s.id);
                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}

              {slots.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No time slots found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{isEdit ? "Edit Time Slot" : "Add Time Slot"}</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              size="small"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <TextField
              label="Start Time"
              type="time"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.start_time}
              onChange={(e) =>
                setForm({ ...form, start_time: e.target.value })
              }
            />
            <TextField
              label="End Time"
              type="time"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.end_time}
              onChange={(e) =>
                setForm({ ...form, end_time: e.target.value })
              }
            />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Active</Typography>
              <Switch
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" sx={{
            backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
          }}onClick={handleSave}>
            {isEdit ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this time slot?</Typography>
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

export default TimeSlots;
