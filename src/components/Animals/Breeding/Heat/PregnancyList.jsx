// PregnancyList.jsx
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
import { getAllPregnancyRecords, addPregnancyRecord, deletePregnancyRecord, getEmployees } from "../../../../services";
import { useSnackbar } from "../../../../context/SnackbarContext";
import "../../../../index.css";

// Pregnancy Status Options
const STATUS_OPTIONS = ["Open", "Delivered", "Recheck"];

const PregnancyList = () => {
  const { tagNo } = useParams();
  const { showSnackbar } = useSnackbar();

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    check_date: "",
    identification_method: "",
    diagnostic_result: "",
    pregnancy_status: "Open",
    comments: "",
    employee_id: ""
  });

  // Fetch records and employees
  useEffect(() => {
    if (tagNo) fetchRecords();
    fetchEmployees();
  }, [tagNo]);

  const fetchRecords = async () => {
    try {
      const res = await getAllPregnancyRecords(tagNo);
      setRecords(res.data.details || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to fetch pregnancy records.", "error");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.details || []);
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to fetch employees.", "error");
    }
  };

  // Form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Add record
  const handleSubmit = async () => {
    try {
      const payload = { ...form, animal_tag_no: tagNo };
      await addPregnancyRecord(payload);
      setOpen(false);
      setForm({
        check_date: "",
        identification_method: "",
        diagnostic_result: "",
        pregnancy_status: "Open",
        comments: "",
        employee_id: ""
      });
      fetchRecords();
      showSnackbar("Pregnancy record added successfully!", "success");
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to add pregnancy record.", "error");
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this record?")) {
        await deletePregnancyRecord({ id });
        fetchRecords();
        showSnackbar("Pregnancy record deleted successfully!", "success");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to delete pregnancy record.", "error");
    }
  };

  return (
    <>
      {/* Records Table */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Pregnancy Records</Typography>
            <Button variant="contained" onClick={() => setOpen(true)} className="bg-color">Add Record</Button>
          </Box>

          <Typography mt={1}>
            Total Records: <b>{records.length}</b>
          </Typography>

          <Table size="small" sx={{ mt: 2 }}>
            <TableHead>
              <TableRow>
                <TableCell>Check Date</TableCell>
                <TableCell>Identification Method</TableCell>
                <TableCell>Diagnostic Result</TableCell>
                <TableCell>Pregnancy Status</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length ? (
                records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.check_date?.slice(0, 10)}</TableCell>
                    <TableCell>{r.identification_method || "-"}</TableCell>
                    <TableCell>{r.diagnostic_result || "-"}</TableCell>
                    <TableCell>
                      <Typography
                        color={
                          r.pregnancy_status === "Delivered" ? "green" :
                          r.pregnancy_status === "Recheck" ? "orange" : "blue"
                        }
                        fontWeight="bold"
                      >
                        {r.pregnancy_status || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>{r.comments || "-"}</TableCell>
                    <TableCell>{r.employee_id || "-"}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(r.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No pregnancy records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Record Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Pregnancy Record</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            type="date"
            label="Check Date"
            name="check_date"
            value={form.check_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <TextField
            label="Identification Method"
            name="identification_method"
            value={form.identification_method}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Diagnostic Result"
            name="diagnostic_result"
            value={form.diagnostic_result}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            label="Pregnancy Status"
            name="pregnancy_status"
            value={form.pregnancy_status}
            onChange={handleChange}
            fullWidth
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Employee ID"
            select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            fullWidth
          >
            {employees.map((e) => (
              <MenuItem key={e.employee_id} value={e.employee_id}>{e.employee_id}</MenuItem>
            ))}
          </TextField>
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
          <Button onClick={() => setOpen(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} className="bg-color">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PregnancyList;
