import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { getBreedingTypes, deleteBreedingType } from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const BreedingLifeCycle = () => {
  const { showSnackbar } = useSnackbar();

  const [heiferTypes, setHeiferTypes] = useState([]);
  const [motherTypes, setMotherTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchBreedingTypes();
  }, []);

  const fetchBreedingTypes = async () => {
    setLoading(true);
    try {
      const res = await getBreedingTypes("Mother");
      const data = res.data || [];

      setHeiferTypes(data.filter(i => i.lifecycle.includes("Heifer")));
      setMotherTypes(data.filter(i => i.lifecycle.includes("Mother")));
    } catch {
      showSnackbar("Failed to load breeding lifecycle", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBreedingType({ id: deleteId });
      showSnackbar("Breeding type deleted", "success");
      fetchBreedingTypes();
    } catch {
      showSnackbar("Failed to delete breeding type", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const renderTable = (data) => (
    <Table size="small" sx={{ maxWidth: 800 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell align="center" sx={{py:1}}><b>ID</b></TableCell>
          <TableCell align="center" sx={{py:1}}><b>Breeding Type</b></TableCell>
          <TableCell align="center" sx={{py:1}}><b>Lifecycle</b></TableCell>
          <TableCell align="center" sx={{py:1}}><b>Action</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id} hover>
            <TableCell align="center"sx={{py:1}}>{row.id}</TableCell>
            <TableCell align="center"sx={{py:1}}>{row.type}</TableCell>
            <TableCell align="center"sx={{py:1}}>
              {row.lifecycle.map((lc) => (
                <Chip key={lc} label={lc} size="small" sx={{ mr: 0.5 }} />
              ))}
            </TableCell>
            <TableCell align="center" sx={{py:1}}>
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
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Breeding Lifecycle
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {/* HEIFER */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">🐄 Heifer</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              {renderTable(heiferTypes)}
            </TableContainer>
          </Box>

          {/* MOTHER */}
          <Box>
            <Typography variant="h6">🐄 Mother</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              {renderTable(motherTypes)}
            </TableContainer>
          </Box>
        </>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this breeding type?
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

export default BreedingLifeCycle;
