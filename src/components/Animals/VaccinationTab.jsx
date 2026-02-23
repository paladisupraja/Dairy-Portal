import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import { useSnackbar } from "../../context/SnackbarContext";
import {
  getVaccinesByAnimalId,
  getVaccineTypes,
  addVaccination,
} from "../../services";
import "../../index.css";

const VaccinationTab = ({ animalId }) => {
  const { showSnackbar } = useSnackbar();

  const [records, setRecords] = useState([]);
  const [vaccineTypes, setVaccineTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    vaccine_name: "",
    vaccine_type: "",
    vaccine_date: "",
    dosage: "",
  });

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (animalId) fetchVaccines();
    fetchVaccineTypes();
  }, [animalId]);

  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const res = await getVaccinesByAnimalId(animalId);
      setRecords(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch vaccination records", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchVaccineTypes = async () => {
    try {
      const res = await getVaccineTypes();
      setVaccineTypes(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch vaccine types", "error");
    }
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!animalId) {
      showSnackbar("Animal ID missing", "error");
      return;
    }

    try {
      const payload = {
        animal_id: animalId,
        vaccine_name: form.vaccine_name,
        vaccine_type: form.vaccine_type,
        vaccine_date: form.vaccine_date,
        dosage: form.dosage,
      };

      await addVaccination(payload);

      showSnackbar("Vaccine added successfully", "success");
      setOpen(false);
      setForm({
        vaccine_name: "",
        vaccine_type: "",
        vaccine_date: "",
        dosage: "",
      });
      fetchVaccines();
    } catch {
      showSnackbar("Failed to add vaccine", "error");
    }
  };

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">
              Vaccination Records – <b>Animal ID: {animalId}</b>
            </Typography>
            <Button variant="contained" onClick={() => setOpen(true)} className="bg-color">
              Add Vaccine
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Vaccine Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.length ? (
                  records.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.vaccine_name}</TableCell>
                      <TableCell>{row.vaccine_type}</TableCell>
                      <TableCell>{row.dosage}</TableCell>
                      <TableCell>
                        {new Date(row.vaccine_date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No vaccination records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ================= ADD VACCINE DIALOG ================= */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Vaccine</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Vaccine Name"
            name="vaccine_name"
            value={form.vaccine_name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Vaccine Type"
            name="vaccine_type"
            value={form.vaccine_type}
            onChange={handleChange}
            fullWidth
          >
            {vaccineTypes.map((v) => (
              <MenuItem key={v.id} value={v.name}>
                {v.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Vaccine Date"
            name="vaccine_date"
            InputLabelProps={{ shrink: true }}
            value={form.vaccine_date}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Dosage"
            name="dosage"
            value={form.dosage}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} className="bg-color">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VaccinationTab;
