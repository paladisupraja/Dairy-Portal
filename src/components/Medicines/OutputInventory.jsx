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
  TextField,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import {
  getConsumption,
  addConsumption,
  getAllAnimals,
  getAllMedicines,
  getEmployees,
} from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";

const OutputInventory = () => {
  const { showSnackbar } = useSnackbar();

  /* ---------------- TABLE ---------------- */
  const [animalTag, setAnimalTag] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- DROPDOWNS ---------------- */
  const [animals, setAnimals] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [employees, setEmployees] = useState([]);

  /* ---------------- DIALOG ---------------- */
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    animal_tags: [],
    medicine_id: "",
    dosage: "",
    duration: "",
    time_slot: 1,
    employee_id: "",
    supervised_by: "",
    administered_at: "",
  });

  /* ---------------- FETCH CONSUMPTION ---------------- */
  const fetchData = async (tag = "") => {
    try {
      setLoading(true);
      const res = await getConsumption(tag);
      setData(res.data?.details || res.data || []);
    } catch (err) {
      showSnackbar("Failed to load consumption data", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD ON PAGE LOAD ---------------- */
  useEffect(() => {
    fetchData();
    loadDropdowns();
  }, []);

  /* ---------------- AUTO SEARCH ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(animalTag);
    }, 500);
    return () => clearTimeout(timer);
  }, [animalTag]);

  /* ---------------- LOAD DROPDOWNS ---------------- */
 const loadDropdowns = async () => {
  try {
    const aRes = await getAllAnimals();
    const mRes = await getAllMedicines();
    const eRes = await getEmployees();

    // ✅ FIXED HERE
    setAnimals(aRes.data?.data || []);

    setMedicines(
      Array.isArray(mRes.data)
        ? mRes.data
        : mRes.data?.details || []
    );

    setEmployees(
      Array.isArray(eRes.data)
        ? eRes.data
        : eRes.data?.details || []
    );
  } catch (err) {
    showSnackbar("Failed to load dropdown data", "error");
  }
};


  /* ---------------- ADD CONSUMPTION ---------------- */
  const handleSubmit = async () => {
    try {
      await addConsumption(formData);
      showSnackbar("Medicine consumption added", "success");
      setOpen(false);
      fetchData();
    } catch (err) {
      showSnackbar("Failed to add consumption", "error");
    }
  };

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Medicine Consumption
        </Typography>

        <IconButton sx={{color:"rgb(42,8,11)"}} onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* SEARCH */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Search by Animal Tag"
            placeholder="Type Animal Tag (ex: 601)"
            value={animalTag}
            onChange={(e) => setAnimalTag(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent>
          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Animal Tag</TableCell>
                  <TableCell>Medicine ID</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.animal_tag}</TableCell>
                      <TableCell>{row.medicine_id}</TableCell>
                      <TableCell>{row.dosage}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>
                        {row.administered_at
                          ? new Date(row.administered_at).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ADD CONSUMPTION DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Medicine Consumption</DialogTitle>

        <DialogContent>
          {/* Animal */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Animal"
            onChange={(e) =>
              setFormData({
                ...formData,
                animal_tags: [e.target.value],
              })
            }
          >
            {Array.isArray(animals) &&
              animals.map((a) => (
                <MenuItem key={a.animal_id} value={a.tag_no}>
                  {a.tag_no} - {a.animal_type}
                </MenuItem>
              ))}
          </TextField>

          {/* Medicine */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Medicine"
            onChange={(e) =>
              setFormData({
                ...formData,
                medicine_id: e.target.value,
              })
            }
          >
            {Array.isArray(medicines) &&
              medicines.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.name} | {m.category} | Stock: {m.stock}
                </MenuItem>
              ))}
          </TextField>

          {/* Dosage */}
          <TextField
            fullWidth
            margin="dense"
            label="Dosage"
            onChange={(e) =>
              setFormData({ ...formData, dosage: e.target.value })
            }
          />

          {/* Duration */}
          <TextField
            fullWidth
            margin="dense"
            label="Duration"
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
          />

          {/* Employee */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Employee"
            onChange={(e) =>
              setFormData({
                ...formData,
                employee_id: e.target.value,
              })
            }
          >
            {Array.isArray(employees) &&
              employees.map((e) => (
                <MenuItem
                  key={e.employee_id}
                  value={e.employee_id}
                >
                  {e.employee_id} - {e.employee_name}
                </MenuItem>
              ))}
          </TextField>

          {/* Supervised By */}
          <TextField
            fullWidth
            margin="dense"
            label="Supervised By"
            onChange={(e) =>
              setFormData({
                ...formData,
                supervised_by: e.target.value,
              })
            }
          />

          {/* Date */}
          <TextField
            fullWidth
            type="datetime-local"
            margin="dense"
            onChange={(e) =>
              setFormData({
                ...formData,
                administered_at: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },}}onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutputInventory;
