import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "../../../context/SnackbarContext";
import { getAnimalLifecycle } from "../../../services";
import axios from "axios";

const API_URL = "YOUR_API_URL_HERE"; // replace with your actual API base URL

const AnimalLists = () => {
  const { showSnackbar } = useSnackbar();

  const [maleList, setMaleList] = useState([]);
  const [femaleList, setFemaleList] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [maleRes, femaleRes] = await Promise.all([
        getAnimalLifecycle("Male"),
        getAnimalLifecycle("Female"),
      ]);

      setMaleList(maleRes.data?.details || []);
      setFemaleList(femaleRes.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch animal lifecycle", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;

    try {
      await axios.post(`${API_URL}/deleteAnimalLifecycle`, { id });
      showSnackbar("Deleted successfully", "success");
      // Refresh lists after deletion
      fetchData();
    } catch {
      showSnackbar("Failed to delete entry", "error");
    }
  };

  /* ================= TABLE ================= */
  const renderTable = (list) => (
    <TableContainer component={Paper} sx={{ maxWidth: 800 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell align="center" sx={{ py: 1 }}><b>ID</b></TableCell>
            <TableCell sx={{ py: 1 }}><b>Event Type</b></TableCell>
            <TableCell sx={{ py: 1 }}><b>Gender</b></TableCell>
            <TableCell align="center" sx={{ py: 1 }}><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell align="center" sx={{ py: 1 }}>{row.id}</TableCell>
              <TableCell sx={{ py: 1 }}>{row.event_type}</TableCell>
              <TableCell>
                {row.gender.map((g) => (
                  <Chip key={g} label={g} size="small" sx={{ mr: 0.5 }} />
                ))}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDelete(row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {list.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Animal Lifecycle
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {/* MALE */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1} color="primary">
              Male Animals
            </Typography>
            {renderTable(maleList)}
          </Grid>

          {/* FEMALE */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" mb={1} color="secondary">
              Female Animals
            </Typography>
            {renderTable(femaleList)}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnimalLists;
