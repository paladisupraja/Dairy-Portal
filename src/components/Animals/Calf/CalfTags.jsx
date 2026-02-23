import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import {
  getCalvesByParentTag,
  getAllAnimals,
  addCalf,
} from "../../../services";

import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const CalfTags = () => {
  const { tagNo } = useParams();
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [calves, setCalves] = useState([]);
  const [parentAnimalType, setParentAnimalType] = useState("");
  const [availableCalves, setAvailableCalves] = useState([]); // eligible calves
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    tag_no: "",
    gender: "",
    weight: "",
    calving_date: "",
    calving_time: "",
    calving_type: "Normal",
    notes: "",
    employee_id: 101,
  });

  /* ================= FETCH CALVES FOR THIS PARENT ================= */
  const fetchCalves = async () => {
    setLoading(true);
    try {
      const res = await getCalvesByParentTag(tagNo);
      setCalves(res?.data?.details?.calves || []);
    } catch {
      setCalves([]);
    } finally {
      setLoading(false);
    }
  };

const fetchAnimals = async () => {
  try {
    // Fetch all animals fresh
    const res = await getAllAnimals();
    const animals = res?.data?.data || [];

    // Parent info
    const parent = animals.find(a => a.tag_no === tagNo);
    setParentAnimalType(parent?.animal_type || "");

    // Get all calves already assigned globally
    const assignedCalfTags = animals
      .filter(a => a.lifecycle === "calf" && a.mother_tag) // any assigned calf
      .map(a => a.tag_no);

    // Eligible calves: unassigned globally
    const eligibleCalves = animals.filter(
      a =>
        a.lifecycle === "calf" &&
        !assignedCalfTags.includes(a.tag_no) &&
        a.tag_no !== tagNo
    );

    setAvailableCalves(eligibleCalves);
  } catch (err) {
    console.error(err);
    setAvailableCalves([]);
  }
};



  useEffect(() => {
    if (!tagNo) return;
    fetchCalves();
  }, [tagNo]);

  useEffect(() => {
    fetchAnimals();
  }, [calves]); // Update eligible calves whenever existing calves change

  /* ================= ADD CALF ================= */
  const handleSubmit = async () => {
    if (!form.tag_no || !form.gender || !form.calving_date) {
      showSnackbar("Please fill all required fields", "warning");
      return;
    }

    const payload = {
      mother_tag: tagNo,
      calving_date: form.calving_date,
      calving_time: form.calving_time,
      calving_type: form.calving_type,
      notes: form.notes,
      employee_id: form.employee_id,
      calves: [
        {
          tag_no: form.tag_no,
          gender: form.gender,
          weight: Number(form.weight),
          animal_type: parentAnimalType,
          lifecycle: "calf",
        },
      ],
    };

    try {
      await addCalf(payload);
      showSnackbar("Calf added successfully 🎉", "success");

      setOpen(false);
      setForm({
        tag_no: "",
        gender: "",
        weight: "",
        calving_date: "",
        calving_time: "",
        calving_type: "Normal",
        notes: "",
        employee_id: 101,
      });

      fetchCalves(); // refresh table and dropdown
    } catch (err) {
      showSnackbar("Failed to add calf ❌", "error");
      console.error(err);
    }
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6">
              Parent Tag No: <b>{tagNo}</b>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Animal Type: <b>{parentAnimalType}</b>
            </Typography>
          </Box>

           <Box display="flex" gap={2} alignItems="center">
            <Chip label={`Total Calves: ${calves.length}`} className="bg-color" />
            <Button variant="contained" size="small" onClick={() => setOpen(true)} className="bg-color">
              Add Calf
            </Button>
          </Box>
        </Box>

        {/* Calves Table */}
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Calf Tag</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Weight</TableCell>
                <TableCell>Lifecycle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calves.length > 0 ? (
                calves.map((c) => (
                  <TableRow key={c.animal_id}>
                    <TableCell>{c.tag_no}</TableCell>
                    <TableCell>{c.gender || "-"}</TableCell>
                    <TableCell>{c.dob || "-"}</TableCell>
                    <TableCell>{c.weight || "-"}</TableCell>
                    <TableCell>{c.lifecycle || "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No calves records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Add Calf Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>Add Calf</DialogTitle>
          <DialogContent>
            {/* Parent Info */}
            <Box
              mb={2}
              p={1}
              sx={{ backgroundColor: "#f5f5f5", borderRadius: 1 }}
            >
              <Typography variant="body2">
                <b>Parent Tag No:</b> {tagNo}
              </Typography>
              <Typography variant="body2">
                <b>Animal Type:</b> {parentAnimalType}
              </Typography>
            </Box>

            {/* Calf Tag Dropdown */}
            <TextField
              select
              label="Calf Tag"
              fullWidth
              required
              margin="dense"
              value={form.tag_no}
              onChange={(e) => setForm({ ...form, tag_no: e.target.value })}
            >
              {availableCalves.length > 0 ? (
                availableCalves.map((c) => (
                  <MenuItem key={c.tag_no} value={c.tag_no}>
                    {c.tag_no}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No eligible calf tags</MenuItem>
              )}
            </TextField>

            <TextField
              select
              label="Gender"
              fullWidth
              required
              margin="dense"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>

            <TextField
              label="Weight (kg)"
              type="number"
              fullWidth
              margin="dense"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />

            <TextField
              type="date"
              label="Calving Date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              margin="dense"
              value={form.calving_date}
              onChange={(e) => setForm({ ...form, calving_date: e.target.value })}
            />

            <TextField
              type="time"
              label="Calving Time"
              InputLabelProps={{ shrink: true }}
              fullWidth
              margin="dense"
              value={form.calving_time}
              onChange={(e) => setForm({ ...form, calving_time: e.target.value })}
            />

            <TextField
              label="Notes"
              fullWidth
              margin="dense"
              multiline
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default CalfTags;
