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
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useParams } from "react-router-dom";
import {
  getBreedingRecordsByAnimalTag,
  createBreedingRecord,
  getAllAnimals,
  deleteBreedingRecord,
} from "../../../../services";
import { useSnackbar } from "../../../../context/SnackbarContext";

const BREEDING_TYPES = ["Artificial", "Natural"];
const BREEDING_STATUS = ["Successful", "Pending", "Failed"];

const BreedingList = () => {
  const { tagNo } = useParams();
  const { showSnackbar } = useSnackbar();

  const [breedingRecords, setBreedingRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    animal_tag_no: "",
    breeding_type: "",
    breeding_date: "",
    breeding_status: "",
    breeding_by: "",
    note: "",
    heat_id: "",
  });

  // Load records on mount or tag change
  useEffect(() => {
    if (tagNo) {
      fetchBreedingRecords(tagNo);
      setForm((prev) => ({ ...prev, animal_tag_no: tagNo }));
    }
  }, [tagNo]);

  // Fetch breeding records
  const fetchBreedingRecords = async (tag) => {
    setLoading(true);
    try {
      const res = await getBreedingRecordsByAnimalTag(tag);
      const records = res.data.details
        ? Array.isArray(res.data.details)
          ? res.data.details
          : [res.data.details]
        : [];
      setBreedingRecords(records);
    } catch (error) {
      setBreedingRecords([]);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Add new breeding record
  const handleSubmit = async () => {
    if (!form.breeding_type || !form.breeding_date || !form.breeding_status || !form.heat_id) {
      showSnackbar("Please fill all required fields including Heat ID", "warning");
      return;
    }

    try {
      const payload = { ...form, heat_id: Number(form.heat_id) };
      const res = await createBreedingRecord(payload);

      if (res.status === 201 && res.data?.details) {
        setBreedingRecords((prev) => [...prev, res.data.details]);
        setOpen(false);
        setForm({
          animal_tag_no: tagNo,
          breeding_type: "",
          breeding_date: "",
          breeding_status: "",
          breeding_by: "",
          note: "",
          heat_id: "",
        });
        showSnackbar("Breeding record added successfully", "success");
      } else {
        showSnackbar("Failed to add breeding record", "error");
      }
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to save breeding record",
        "error"
      );
    }
  };

  // Delete breeding record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteBreedingRecord({ id });
      setBreedingRecords((prev) => prev.filter((r) => r.breeding_id !== id));
      showSnackbar("Breeding record deleted successfully", "success");
    } catch {
      showSnackbar("Failed to delete breeding record", "error");
    }
  };

  return (
    <>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Breeding Records</Typography>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}>Add Breeding</Button>
          </Box>

          <Typography mt={1}>Total: <b>{breedingRecords.length}</b></Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : breedingRecords.length ? (
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Animal Tag</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Breeding By</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Heat ID</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {breedingRecords.map((record) => (
                  <TableRow key={record.breeding_id}>
                    <TableCell>{record.animal_tag_no}</TableCell>
                    <TableCell>{record.breeding_type}</TableCell>
                    <TableCell>{record.breeding_date?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Typography
                        fontWeight="bold"
                        color={
                          record.breeding_status === "Successful" ? "green" :
                          record.breeding_status === "Failed" ? "red" : "orange"
                        }
                      >
                        {record.breeding_status}
                      </Typography>
                    </TableCell>
                    <TableCell>{record.breeding_by || "-"}</TableCell>
                    <TableCell>{record.note || "-"}</TableCell>
                    <TableCell>{record.heat_id || "-"}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(record.breeding_id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography align="center" mt={3}>No breeding records found</Typography>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Breeding</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField select label="Animal Tag" name="animal_tag_no" value={form.animal_tag_no} disabled fullWidth>
            <MenuItem value={tagNo}>{tagNo}</MenuItem>
          </TextField>

          <TextField select label="Breeding Type" name="breeding_type" value={form.breeding_type} onChange={handleChange} fullWidth>
            {BREEDING_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>

          <TextField type="date" label="Breeding Date" name="breeding_date" value={form.breeding_date} onChange={handleChange} InputLabelProps={{ shrink: true }} fullWidth />

          <TextField select label="Breeding Status" name="breeding_status" value={form.breeding_status} onChange={handleChange} fullWidth>
            {BREEDING_STATUS.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>

          <TextField label="Breeding By" name="breeding_by" value={form.breeding_by} onChange={handleChange} fullWidth />
          <TextField label="Note" name="note" value={form.note} onChange={handleChange} multiline rows={3} fullWidth />
          <TextField label="Heat ID" name="heat_id" value={form.heat_id ?? ""} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BreedingList;
