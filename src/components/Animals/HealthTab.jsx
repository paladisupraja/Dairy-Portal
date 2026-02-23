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
} from "@mui/material";
import { useParams } from "react-router-dom";
import {
  getConsumption,
  addConsumption,
  getEmployees,
  getAllMedicines,
} from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import "../../index.css";
import VaccinationTab from "./VaccinationTab";

const HealthTab = ({ animalId }) => { // ✅ accept animalId as prop
  const { tagNo } = useParams(); // ✅ use tagNo for medicines
  const { showSnackbar } = useSnackbar();

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    medicine_id: "",
    dosage: "",
    duration: "",
    time_slot: "",
    employee_id: "",
    supervised_by: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (tagNo) fetchConsumption();
    fetchEmployees();
    fetchMedicines();
  }, [tagNo]);

  const fetchConsumption = async () => {
    try {
      const res = await getConsumption(tagNo);
      setRecords(res.data.details || []);
    } catch {
      showSnackbar("Failed to fetch medicine history", "error");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.details || []);
    } catch {
      showSnackbar("Failed to fetch employees", "error");
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await getAllMedicines();
      setMedicines(res.data.details || []);
    } catch {
      showSnackbar("Failed to fetch medicines", "error");
    }
  };

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  /* ================= ADD MEDICINE ================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        animal_tags: [tagNo], // ✅ backend format
        medicine_id: form.medicine_id,
        dosage: form.dosage,
        duration: form.duration,
        time_slot: form.time_slot,
        employee_id: form.employee_id,
        supervised_by: form.supervised_by,
        administered_at: new Date().toISOString(),
      };

      await addConsumption(payload);

      showSnackbar("Medicine added successfully", "success");
      setOpen(false);

      setForm({
        medicine_id: "",
        dosage: "",
        duration: "",
        time_slot: "",
        employee_id: "",
        supervised_by: "",
      });

      fetchConsumption();
    } catch {
      showSnackbar("Failed to add medicine", "error");
    }
  };

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              Medicine History – <b>{tagNo}</b>
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)} className="bg-color">
              Add Medicine
            </Button>
          </Box>

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Medicine</TableCell>
                <TableCell>Dosage</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Supervised By</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {records.length ? (
                records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.medicine_name || r.medicine_id}</TableCell>
                    <TableCell>{r.dosage}</TableCell>
                    <TableCell>{r.duration}</TableCell>
                    <TableCell>{r.supervised_by}</TableCell>
                    <TableCell>
                      {new Date(r.administered_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No medicine records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ================= ADD MEDICINE DIALOG ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            label="Medicine"
            name="medicine_id"
            value={form.medicine_id}
            onChange={handleChange}
          >
            {medicines.length > 0 ? (
              medicines.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No medicines available</MenuItem>
            )}
          </TextField>

          <TextField label="Dosage" name="dosage" value={form.dosage} onChange={handleChange} />
          <TextField label="Duration" name="duration" value={form.duration} onChange={handleChange} />
          <TextField label="Time Slot" name="time_slot" value={form.time_slot} onChange={handleChange} />

          <TextField select label="Employee" name="employee_id" value={form.employee_id} onChange={handleChange}>
            {employees.map((e) => (
              <MenuItem key={e.employee_id} value={e.employee_id}>
                {e.employee_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField label="Supervised By" name="supervised_by" value={form.supervised_by} onChange={handleChange} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} className="bg-color">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Vaccination tab only needs animalId */}
      <VaccinationTab animalId={animalId} />
    </>
  );
};

export default HealthTab;
