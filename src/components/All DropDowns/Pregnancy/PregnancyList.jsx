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

import {
  addPregnancyList,
  deletePregnancyList,
  getPregnancyList,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const PregnancyList = () => {
  const { showSnackbar } = useSnackbar();

  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialogs
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // form states
  const [id, setId] = useState(null);
  const [statusName, setStatusName] = useState("");

  /* ================= FETCH ================= */
  const fetchPregnancyStatuses = async () => {
    setLoading(true);
    try {
      const res = await getPregnancyList();
      setStatuses(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch pregnancy statuses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPregnancyStatuses();
  }, []);

  /* ================= ADD ================= */
  const handleAdd = async () => {
    if (!statusName.trim()) {
      return showSnackbar("Status name is required", "warning");
    }

    try {
      await addPregnancyList({ status_name: statusName });
      showSnackbar("Pregnancy status added successfully", "success");
      setOpen(false);
      resetForm();
      fetchPregnancyStatuses();
    } catch {
      showSnackbar("Failed to add pregnancy status", "error");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    try {
      await deletePregnancyList({ id });
      showSnackbar("Pregnancy status deleted", "success");
      fetchPregnancyStatuses();
    } catch {
      showSnackbar("Delete failed", "error");
    } finally {
      setDeleteOpen(false);
      setId(null);
    }
  };

  /* ================= HELPERS ================= */
  const resetForm = () => {
    setStatusName("");
    setId(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Pregnancy Status</Typography>
        <Button variant="contained" onClick={() => setOpen(true)} className="bg-color">
          Add Status
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }} >
                <TableCell align="center" sx={{py:1}}><b>ID</b></TableCell>
                <TableCell sx={{py:1}}><b>Status Name</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {statuses.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{py:1}}>{row.id}</TableCell>
                  <TableCell sx={{py:1}}>{row.status_name}</TableCell>
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

              {statuses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No pregnancy statuses found
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
        <DialogTitle>Add Pregnancy Status</DialogTitle>
        <DialogContent sx={{ minWidth: 350 }}>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Status Name"
              size="small"
              value={statusName}
              onChange={(e) => setStatusName(e.target.value)}
              fullWidth
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
          <Button variant="contained" onClick={handleAdd} className="bg-color">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this pregnancy status?
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

export default PregnancyList;
