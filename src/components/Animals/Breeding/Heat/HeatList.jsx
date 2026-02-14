import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import { getHeatRecordsByAnimalTag, addHeatRecord, getEmployees, deleteHeatRecord } from "../../../../services";

// Predefined time slots
const TIME_OPTIONS = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM",
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM"
];

// Heat status options
const STATUS_OPTIONS = ["Pending", "Success"];

const HeatList = () => {
  const { tagNo } = useParams();

  const [heats, setHeats] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    heat_date: "",
    heat_time: "",
    score: "",
    employee_id: "",
    observed_by: "",
    comments: "",
    heat_status: "Pending"
  });

  useEffect(() => {
    if (tagNo) fetchHeats();
    fetchEmployees();
  }, [tagNo]);

  // Fetch heat records
  const fetchHeats = async () => {
    const res = await getHeatRecordsByAnimalTag(tagNo);
    setHeats(res.data.details || []);
  };

  // Fetch employee list
  const fetchEmployees = async () => {
    const res = await getEmployees();
    setEmployees(res.data.details || []);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Submit heat record
  const handleSubmit = async () => {
    const payload = {
      animal_tag_no: tagNo,
      heat_date: form.heat_date,
      heat_time: form.heat_time,
      score: form.score,
      employee_id: form.employee_id,
      observed_by: form.observed_by,
      comments: form.comments,
      heat_status: form.heat_status
    };

    await addHeatRecord(payload);
    setOpen(false);
    setForm({
      heat_date: "",
      heat_time: "",
      score: "",
      employee_id: "",
      observed_by: "",
      comments: "",
      heat_status: "Pending"
    });
    fetchHeats();
  };

  // Delete heat record
  const handleDelete = async (id) => {
  if (window.confirm("Are you sure you want to delete this heat record?")) {
    await deleteHeatRecord({ id }); // send { id: ... } as data
    fetchHeats(); // refresh table after deletion
  }
};


  return (
    <>
      {/* Heat Records Table */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Heat Records</Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}>Add Heat</Button>
          </Box>

          <Typography mt={1}>
            Total Heats: <b>{heats.length}</b>
          </Typography>

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Observed By</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {heats.length ? (
                heats.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{h.heat_date?.slice(0, 10)}</TableCell>
                    <TableCell>{h.heat_time}</TableCell>
                    <TableCell>{h.score}</TableCell>
                    <TableCell>{h.observed_by}</TableCell>
                    <TableCell>{h.employee_id}</TableCell>
                    <TableCell>
                      <Typography
                        color={h.heat_status === "Success" ? "green" : "orange"}
                        fontWeight="bold"
                      >
                        {h.heat_status || "Pending"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(h.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No heat records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Heat Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Heat</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Heat Date */}
          <TextField
            type="date"
            label="Heat Date"
            name="heat_date"
            value={form.heat_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Heat Time */}
          <TextField
            select
            label="Heat Time"
            name="heat_time"
            value={form.heat_time}
            onChange={handleChange}
            fullWidth
          >
            {TIME_OPTIONS.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>

          {/* Score */}
          <TextField
            label="Score"
            name="score"
            value={form.score}
            onChange={handleChange}
            fullWidth
          />

          {/* Employee ID Dropdown */}
          <TextField
            select
            label="Employee ID"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            fullWidth
          >
            {employees.map((e) => (
              <MenuItem key={e.employee_id} value={e.employee_id}>
                {e.employee_id}
              </MenuItem>
            ))}
          </TextField>

          {/* Observed By (manual text input) */}
          <TextField
            label="Observed By"
            name="observed_by"
            value={form.observed_by}
            onChange={handleChange}
            fullWidth
          />

          {/* Heat Status */}
          <TextField
            select
            label="Heat Status"
            name="heat_status"
            value={form.heat_status}
            onChange={handleChange}
            fullWidth
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>

          {/* Comments */}
          <TextField
            label="Comments"
            name="comments"
            value={form.comments}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HeatList;
