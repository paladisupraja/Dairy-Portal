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
  getEmployeeDropdown,
  addEmployeeDropdown,
  deleteEmployeeDropdown,
} from  "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const JobRoles = () => {
  const { showSnackbar } = useSnackbar();

  const [type, setType] = useState("job_role");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [value, setValue] = useState("");
  const [parent, setParent] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* Fetch */
  const fetchDropdown = async (selectedType) => {
    setLoading(true);
    try {
      const res = await getEmployeeDropdown(selectedType);
      setData(res.data || []);
    } catch {
      showSnackbar("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDropdown(type);
  }, [type]);

  /* Add */
  const handleAdd = async () => {
    if (!value.trim())
      return showSnackbar("Value is required", "warning");

    setAdding(true);
    try {
      await addEmployeeDropdown({
        type,
        value,
        parent: type === "job_role" ? parent : null,
      });

      showSnackbar("Added successfully", "success");
      setValue("");
      setParent("");
      setAddOpen(false);
      fetchDropdown(type);
    } catch {
      showSnackbar("Failed to add", "error");
    } finally {
      setAdding(false);
    }
  };

  /* Delete */
  const handleDelete = async () => {
    try {
      await deleteEmployeeDropdown({ id: deleteId });
      showSnackbar("Deleted successfully", "success");
      fetchDropdown(type);
    } catch {
      showSnackbar("Failed to delete", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box >
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Employees Roles</Typography>
        <Button variant="contained"  sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}onClick={() => setAddOpen(true)}>
          Add
        </Button>
      </Box>

      {/* Type Switch */}
      <Stack direction="row" spacing={2} mb={3}>
  {["employee_type", "department", "job_role"].map((t) => {
    const isActive = type === t;

    return (
      <Button
        key={t}
        variant={isActive ? "contained" : "outlined"}
        onClick={() => setType(t)}
        sx={{
          backgroundColor: isActive ? "rgb(42, 8, 11)" : "transparent",
          color: isActive ? "#fff" : "rgb(42, 8, 11)",
          borderColor: "rgb(42, 8, 11)",
          "&:hover": {
            backgroundColor: isActive
              ? "rgb(30, 5, 5)"
              : "rgba(42, 8, 11, 0.08)",
          },
        }}
      >
        {t.replace("_", " ").toUpperCase()}
      </Button>
    );
  })}
</Stack>


      {/* Table */}
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center" sx={{ py: 1 }}><b>ID</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Value</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Parent</b></TableCell>
                <TableCell align="center" sx={{py:1}}><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell align="center" sx={{ py: 1 }}>{row.id}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>{row.value}</TableCell>
                  <TableCell align="center" sx={{ py: 1 }}>
                    {row.parent || "-"}
                  </TableCell>
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

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
        <DialogTitle>Add {type.replace("_", " ")}</DialogTitle>
        <DialogContent sx={{ minWidth: 320 }}>
          <TextField
            label="Value"
            fullWidth
            size="small"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            sx={{ mt: 1 }}
          />

          {type === "job_role" && (
            <TextField
              label="Parent (Department)"
              fullWidth
              
              size="small"
              value={parent}
              onChange={(e) => setParent(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={adding}>
            {adding ? <CircularProgress size={20} /> : "Add"}
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
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobRoles;
