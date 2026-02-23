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
  getAllGroupsTypes,
  addGroupType,
  deleteGroupType,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const GroupTypes = () => {
  const { showSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [groupType, setGroupType] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* Fetch group types */
  const fetchGroupTypes = async () => {
    setLoading(true);
    try {
      const res = await getAllGroupsTypes();
      setData(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch group types", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupTypes();
  }, []);

  /* Add group type */
  const handleAdd = async () => {
    if (!groupType.trim()) {
      return showSnackbar("Group type is required", "warning");
    }

    setAdding(true);
    try {
      await addGroupType({ groupType });
      showSnackbar("Group type added successfully", "success");
      setGroupType("");
      setAddOpen(false);
      fetchGroupTypes();
    } catch {
      showSnackbar("Failed to add group type", "error");
    } finally {
      setAdding(false);
    }
  };

  /* Delete group type */
  const handleDelete = async () => {
    try {
      await deleteGroupType({ groupTypeId: deleteId });
      showSnackbar("Group type deleted successfully", "success");
      fetchGroupTypes();
    } catch {
      showSnackbar("Failed to delete group type", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Group Types</Typography>
        <Button size="small" variant="contained" className="bg-color" onClick={() => setAddOpen(true)}>
          Add
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ py: 1 }}>
                  <b>ID</b>
                </TableCell>
                <TableCell align="center" sx={{ py: 1 }}>
                  <b>Group Type</b>
                </TableCell>
                <TableCell align="center" sx={{ py: 1 }}>
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{ py: 1 }}>
                    {row.id}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    {row.group_type}
                  </TableCell>
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

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 1 }}>
                    No records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Dialog */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Group Type</DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <TextField
            label="Group Type"
            fullWidth
            size="small"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button size="small" className="color" onClick={() => setAddOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            className="bg-color"
            onClick={handleAdd}
            disabled={adding}
          >
            {adding ? <CircularProgress size={18} /> : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupTypes;
