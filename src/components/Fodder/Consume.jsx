import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
  Checkbox,
  ListItemText,
} from "@mui/material";

import { useSnackbar } from "../../context/SnackbarContext";
import {
  getAllAnimals,
  getFodderTypes,
  timeSlotList,
  addDailyConsumption,
} from "../../services";

const Consume = () => {
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  // ===== Data =====
  const [animals, setAnimals] = useState([]);
  const [fodderTypes, setFodderTypes] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  // ===== Form =====
  const [form, setForm] = useState({
    animal_tag_nos: [],
    fodder_type_id: "",
    time_slot_id: "",
    quantity: "",
    date: "",
  });

  // ===== Initial Load =====
  useEffect(() => {
    fetchAnimals();
    fetchFodderTypes();
    fetchTimeSlots();
  }, []);

  // ===== APIs =====
  const fetchAnimals = async () => {
    try {
      const res = await getAllAnimals();
      setAnimals(res?.data?.data || []);
    } catch {
      showSnackbar("Failed to load animals", "error");
    }
  };

  const fetchFodderTypes = async () => {
    try {
      const res = await getFodderTypes();
      setFodderTypes(res?.data?.details || []);
    } catch {
      showSnackbar("Failed to load fodder types", "error");
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const res = await timeSlotList({ activeOnly: true });
      setTimeSlots(res?.data?.time_slots || []);
    } catch {
      showSnackbar("Failed to load time slots", "error");
    }
  };

  // ===== Submit =====
  const handleSubmit = async () => {
    if (
      !form.animal_tag_nos.length ||
      !form.fodder_type_id ||
      !form.time_slot_id ||
      !form.quantity ||
      !form.date
    ) {
      showSnackbar("Please fill all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await addDailyConsumption(form);
      showSnackbar("Consumption added successfully", "success");

      setForm({
        animal_tag_nos: [],
        fodder_type_id: "",
        time_slot_id: "",
        quantity: "",
        date: "",
      });
    } catch {
      showSnackbar("Failed to add consumption", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={500}>
      {/* ===== Header ===== */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h5" fontWeight={600}>
          Daily Consumption
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fodder usage entry
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* ===== Animals Dropdown with Checkboxes ===== */}
      <TextField
        select
        fullWidth
        label="Animals"
        margin="normal"
        SelectProps={{
          multiple: true,
          renderValue: (selected) => selected.join(", "),
        }}
        value={form.animal_tag_nos}
        onChange={(e) =>
          setForm({ ...form, animal_tag_nos: e.target.value })
        }
      >
        {animals.map((a) => (
          <MenuItem key={a.animal_id} value={a.tag_no}>
            <Checkbox
              checked={form.animal_tag_nos.includes(a.tag_no)}
            />
            <ListItemText
              primary={`${a.tag_no} (${a.animal_type})`}
            />
          </MenuItem>
        ))}
      </TextField>

      {/* ===== Fodder Type ===== */}
      <TextField
        select
        fullWidth
        label="Fodder Type"
        margin="normal"
        value={form.fodder_type_id}
        onChange={(e) =>
          setForm({ ...form, fodder_type_id: e.target.value })
        }
      >
        {fodderTypes.map((f) => (
          <MenuItem key={f.id} value={f.id}>
            {f.food}
          </MenuItem>
        ))}
      </TextField>

      {/* ===== Time Slot ===== */}
      <TextField
        select
        fullWidth
        label="Time Slot"
        margin="normal"
        value={form.time_slot_id}
        onChange={(e) =>
          setForm({ ...form, time_slot_id: e.target.value })
        }
      >
        {timeSlots.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name} ({t.start_time} - {t.end_time})
          </MenuItem>
        ))}
      </TextField>

      {/* ===== Quantity ===== */}
      <TextField
        fullWidth
        type="number"
        label="Quantity (Kg)"
        margin="normal"
        value={form.quantity}
        onChange={(e) =>
          setForm({ ...form, quantity: e.target.value })
        }
      />

      {/* ===== Date ===== */}
      <TextField
        fullWidth
        type="datetime-local"
        label="Date"
        InputLabelProps={{ shrink: true }}
        margin="normal"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
      />

      {/* ===== Save ===== */}
      <Box mt={3}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },}}
          fullWidth
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={22} /> : "Save Consumption"}
        </Button>
      </Box>
    </Box>
  );
};

export default Consume;
