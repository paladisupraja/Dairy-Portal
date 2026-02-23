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
  getFodderTypes,
  addFodderType,
  deleteFodderType,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const FodderTypes = () => {
  const { showSnackbar } = useSnackbar();

  const [fodders, setFodders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [fodderName, setFodderName] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* Fetch fodder types */
  const fetchFodders = async () => {
    setLoading(true);
    try {
      const res = await getFodderTypes();
      setFodders(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch fodder types", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFodders();
  }, []);

  /* Add fodder type */
  const handleAdd = async () => {
    if (!fodderName.trim()) return showSnackbar("Fodder name is required", "warning");

    setAdding(true);
    try {
      await addFodderType({ food: fodderName });
      showSnackbar("Fodder type added successfully", "success");
      setFodderName("");
      setAddOpen(false);
      fetchFodders();
    } catch {
      showSnackbar("Failed to add fodder type", "error");
    } finally {
      setAdding(false);
    }
  };

  /* Delete fodder type */
  const handleDelete = async () => {
    try {
      await deleteFodderType({ id: deleteId });
      showSnackbar("Fodder type deleted successfully", "success");
      fetchFodders();
    } catch {
      showSnackbar("Failed to delete fodder type", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Fodder Types</Typography>
        <Button size="small" variant="contained" className="bg-color" onClick={() => setAddOpen(true)}>
          Add
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 700 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ py: 1 }}><b>ID</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Fodder</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Min Stock</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Total Quantity</b></TableCell>
                <TableCell align="center" sx={{ py: 1 }}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {fodders.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{ py: 1 }}>{row.id}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{row.food}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{row.min_stock}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{row.total_quantity}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    <IconButton
                      size="small"
                      color="error"
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

              {fodders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 1 }}>
                    No fodder types found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Fodder Type</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Fodder Name"
            fullWidth
            size="small"
            value={fodderName}
            onChange={(e) => setFodderName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setAddOpen(false)} className="color">Cancel</Button>
          <Button size="small" variant="contained" onClick={handleAdd} className="bg-color" disabled={adding}>
            {adding ? <CircularProgress size={18} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this fodder type?</Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button size="small" color="error" variant="contained" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FodderTypes;
