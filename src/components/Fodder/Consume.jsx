import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useSnackbar } from "../../context/SnackbarContext";
import {
  getAllAnimals,
  getFodderTypes,
  timeSlotList,
  addDailyConsumption,
  getConsumptionReports,
} from "../../services";

const Consume = () => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [openRows, setOpenRows] = useState({});

  const [data, setData] = useState({
    animals: [],
    fodderTypes: [],
    timeSlots: [],
    reports: [],
    form: {
      animal_tag_nos: [],
      fodder_type_id: "",
      time_slot_id: "",
      quantity: "",
      date: "",
    },
  });

  useEffect(() => {
    const fetchAll = async () => {
      setReportLoading(true);
      try {
        const [animalRes, fodderRes, slotRes, reportRes] = await Promise.all([
          getAllAnimals(),
          getFodderTypes(),
          timeSlotList({ activeOnly: true }),
          getConsumptionReports(),
        ]);
        setData((prev) => ({
          ...prev,
          animals: animalRes?.data?.data || [],
          fodderTypes: fodderRes?.data?.details || [],
          timeSlots: slotRes?.data?.time_slots || [],
          reports: reportRes?.data?.datewise || [],
        }));
      } catch {
        showSnackbar("Failed to fetch data", "error");
      } finally {
        setReportLoading(false);
      }
    };
    fetchAll();
  }, [showSnackbar]);

  const handleFormChange = (field, value) =>
    setData((prev) => ({
      ...prev,
      form: { ...prev.form, [field]: value },
    }));
const handleSubmit = async () => {
  const { animal_tag_nos, fodder_type_id, time_slot_id, quantity, date } =
    data.form;

  if (
    !animal_tag_nos.length ||
    !fodder_type_id ||
    !time_slot_id ||
    !quantity ||
    !date
  ) {
    showSnackbar("Please fill all fields", "warning");
    return;
  }

  setLoading(true);

  try {
    await addDailyConsumption({
      animal_tag_nos: animal_tag_nos,
      fodder_type_id: Number(fodder_type_id),
      time_slot_id: Number(time_slot_id),
      quantity: Number(quantity),
      date: new Date(date).toISOString(),
    });

    showSnackbar("Consumption added successfully", "success");

    // Close modal
    setFormVisible(false);

    // Reset form
    setData((prev) => ({
      ...prev,
      form: {
        animal_tag_nos: [],
        fodder_type_id: "",
        time_slot_id: "",
        quantity: "",
        date: "",
      },
    }));

  } catch (err) {
    showSnackbar("Failed to add consumption", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <Box p={2}>
      {/* ===== Header + Add Button ===== */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={600}>
          Daily Consumption
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },}}
          onClick={() => setFormVisible(true)}
        >
          Add Consumption
        </Button>
      </Box>

      {/* ===== Table Section ===== */}
      {reportLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell><b>Date</b></TableCell>
                <TableCell><b>Total Qty (Kg)</b></TableCell>
                <TableCell><b>Animals</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.reports.map((r) => (
                <React.Fragment key={r.date}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() =>
                          setOpenRows((prev) => ({ ...prev, [r.date]: !prev[r.date] }))
                        }
                      >
                        {openRows[r.date] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.total_quantity}</TableCell>
                    <TableCell>{r.by_tag.length}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={openRows[r.date]} timeout="auto" unmountOnExit>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Tag</TableCell>
                              <TableCell>Qty (Kg)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {r.by_tag.map((a) => (
                              <TableRow key={a.tag_no}>
                                <TableCell>{a.tag_no}</TableCell>
                                <TableCell>{a.total_quantity}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ===== Centered Modal Form ===== */}
      <Modal
        open={formVisible}
        onClose={() => setFormVisible(false)}
        aria-labelledby="add-consumption-modal"
        aria-describedby="add-daily-consumption"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", sm: 600 },
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={600} >
            Add Consumption
          </Typography>

          <TextField
            select
            label="Animals"
            value={data.form.animal_tag_nos}
            SelectProps={{ multiple: true, renderValue: (selected) => selected.join(", ") }}
            onChange={(e) => handleFormChange("animal_tag_nos", e.target.value)}
          >
            {data.animals.map((a) => (
              <MenuItem key={a.animal_id} value={a.tag_no}>
                <Checkbox checked={data.form.animal_tag_nos.includes(a.tag_no)} />
                <ListItemText primary={`${a.tag_no} (${a.animal_type})`} />
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Fodder Type"
            value={data.form.fodder_type_id}
            onChange={(e) => handleFormChange("fodder_type_id", e.target.value)}
          >
            {data.fodderTypes.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.food}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Time Slot"
            value={data.form.time_slot_id}
            onChange={(e) => handleFormChange("time_slot_id", e.target.value)}
          >
            {data.timeSlots.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.name} ({t.start_time}-{t.end_time})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Quantity (Kg)"
            value={data.form.quantity}
            inputProps={{min:1}}
            onChange={(e) => handleFormChange("quantity", e.target.value)}
          />

          <TextField
            type="datetime-local"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={data.form.date}
            onChange={(e) => handleFormChange("date", e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "rgb(42, 8, 11)",
            "&:hover": { backgroundColor: "rgb(30, 5, 5)" },}}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} /> : "Save Consumption"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Consume;