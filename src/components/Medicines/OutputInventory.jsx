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
import "../../index.css";

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
    } catch {
      showSnackbar("Failed to load consumption data", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOAD DROPDOWNS ---------------- */
  const loadDropdowns = async () => {
    try {
      const aRes = await getAllAnimals();
      const mRes = await getAllMedicines();
      const eRes = await getEmployees();

      setAnimals(aRes.data?.data || []);
      setMedicines(
        Array.isArray(mRes.data) ? mRes.data : mRes.data?.details || []
      );
      setEmployees(
        Array.isArray(eRes.data) ? eRes.data : eRes.data?.details || []
      );
    } catch {
      showSnackbar("Failed to load dropdown data", "error");
    }
  };

  /* ---------------- LOAD ON PAGE LOAD ---------------- */
  useEffect(() => {
    fetchData();
    loadDropdowns();
  }, []);

  /* ---------------- AUTO SEARCH ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => fetchData(animalTag), 500);
    return () => clearTimeout(timer);
  }, [animalTag]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (
      !formData.animal_tags.length ||
      !formData.medicine_id ||
      !formData.dosage ||
      !formData.employee_id
    ) {
      showSnackbar("Please fill all required fields", "warning");
      return;
    }

    if (Number(formData.dosage) <= 0) {
      showSnackbar("Dosage must be greater than 0", "warning");
      return;
    }

    const selectedMedicine = medicines.find(
      (m) => m.id === Number(formData.medicine_id)
    );

    if (!selectedMedicine) {
      showSnackbar("Invalid medicine selected", "error");
      return;
    }

    const stock = Number(
      selectedMedicine.stock || selectedMedicine.quantity || 0
    );

    if (stock === 0) {
      showSnackbar("Medicine is out of stock", "error");
      return;
    }

    if (Number(formData.dosage) > stock) {
      showSnackbar(`Not enough stock. Available: ${stock}`, "error");
      return;
    }

    try {
      await addConsumption(formData);

      showSnackbar("Medicine consumption added", "success");

      setOpen(false);
      fetchData();

      setFormData({
        animal_tags: [],
        medicine_id: "",
        dosage: "",
        duration: "",
        time_slot: 1,
        employee_id: "",
        supervised_by: "",
        administered_at: "",
      });
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to add consumption",
        "error"
      );
    }
  };

  const selectedMedicine = medicines.find(
    (m) => m.id === Number(formData.medicine_id)
  );

  /* ---------------- UI ---------------- */
  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h5" fontWeight={600}>
          Medicine Consumption
        </Typography>

        <IconButton
          className="color"
          onClick={() => setOpen(true)}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* SEARCH */}
      <Card sx={{ mb: 1 }}>
        <CardContent>
          <TextField
            fullWidth
            label="Search by Animal Tag"
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
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Animal Tag</b></TableCell>
                  <TableCell><b>Medicine</b></TableCell>
                  <TableCell><b>Dosage</b></TableCell>
                  <TableCell><b>Duration</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
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
                          ? new Date(
                              row.administered_at
                            ).toLocaleDateString()
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

      {/* DIALOG */}
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
            {animals.map((a) => (
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
            value={formData.medicine_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                medicine_id: e.target.value,
              })
            }
          >
            {medicines.map((m) => {
              const stock = Number(m.stock || m.quantity || 0);

              return (
                <MenuItem
                  key={m.id}
                  value={m.id}
                  disabled={stock === 0}
                >
                  {m.name} | {m.category} | Stock: {stock}
                  {stock === 0 && " (Out of Stock)"}
                </MenuItem>
              );
            })}
          </TextField>

          {selectedMedicine && (
            <Typography fontSize={13} color="gray">
              Available Stock :
              {selectedMedicine.stock ||
                selectedMedicine.quantity}
            </Typography>
          )}

          {/* Dosage */}
          <TextField
            fullWidth
            type="number"
            margin="dense"
            label="Dosage"
            inputProps={{ min: 1 }}
            value={formData.dosage}
            onChange={(e) =>
              setFormData({
                ...formData,
                dosage: e.target.value,
              })
            }
          />

          {/* Duration */}
          <TextField
            fullWidth
            margin="dense"
            label="Duration"
            value={formData.duration}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: e.target.value,
              })
            }
          />

          {/* Employee */}
          <TextField
            select
            fullWidth
            margin="dense"
            label="Employee"
            value={formData.employee_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                employee_id: e.target.value,
              })
            }
          >
            {employees.map((e) => (
              <MenuItem
                key={e.employee_id}
                value={e.employee_id}
              >
                {e.employee_name}
              </MenuItem>
            ))}
          </TextField>

          {/* Supervised */}
          <TextField
            fullWidth
            margin="dense"
            label="Supervised By"
            value={formData.supervised_by}
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
            value={formData.administered_at}
            onChange={(e) =>
              setFormData({
                ...formData,
                administered_at: e.target.value,
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
           className="color"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
           className="bg-color"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutputInventory;