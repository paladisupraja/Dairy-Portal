import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { getEmployees } from "../../services";


import {
  getGroups,
  getMilkingSummaryByGroup,
  getGroupDetailsById,
  upsertMilkingRecord,
} from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";

const MilkRecords = () => {
  const { showSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
const [openEdit, setOpenEdit] = useState(false);


  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupAnimals, setGroupAnimals] = useState([]);
  const [groupEmployee, setGroupEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openAnimal, setOpenAnimal] = useState(null);

  // Add milk dialog states
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ quantity: "", session: "Am", date: today });

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";
  const farmId = user?.farm_id;

  // ---------------- FETCH GROUPS ----------------
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const res = await getGroups();
        let groupsData = res.data.details || [];

        if (isEmployee && farmId) {
          groupsData = groupsData.filter((g) => g.farm_id === farmId);
        }

        setGroups(groupsData);
        if (groupsData.length) setSelectedGroup(groupsData[0].group_id); // auto-select first group
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to load groups", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
     const fetchEmployees = async () => {
  try {
    const res = await getEmployees({ farm_id: farmId });
    setEmployees(res?.data?.details || []);
  } catch (e) {
    console.log(e);
  }
};

fetchEmployees();
  }, [isEmployee, farmId]);

 

  // ---------------- FETCH ANIMALS + TODAY'S MILK ----------------
  const fetchGroupAnimals = async (groupId) => {
    try {
      setLoading(true);
      const groupRes = await getGroupDetailsById(groupId);
      const animalsList = groupRes.data.details.animals || [];

      setGroupEmployee({
        employee_id: groupRes.data.details.employee_id?.toString(),
        employee_name: groupRes.data.details.employee_name,
      });

      if (animalsList.length === 0) {
        setGroupAnimals([]);
        return;
      }

      const milkRes = await getMilkingSummaryByGroup(groupId);
      const milkAnimals = milkRes.data.details.animals || [];

      const mergedData = animalsList.map((animal) => {
        const milk = milkAnimals.find((m) => m.tag_no === animal.tag_no);
        const todayRecord = milk?.records?.find((r) => r.date === today) || null;
        return { ...animal, record: todayRecord };
      });

      setGroupAnimals(mergedData);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load milk records", "error");
      setGroupAnimals([]);
    } finally {
      setLoading(false);
    }
  };
const handleOpenEdit = (animal) => {

  setSelectedAnimal(animal);

  setForm({
    quantity:
      animal.record?.pm_quantity ??
      animal.record?.am_quantity ??
      "",
    session: animal.record?.pm_quantity ? "Pm" : "Am",
    date: animal.record?.date || today,
    employee_id: groupEmployee?.employee_id || ""
  });

  setOpenEdit(true);
};

  useEffect(() => {
    if (selectedGroup) fetchGroupAnimals(selectedGroup);
  }, [selectedGroup]);

  // ---------------- TOGGLE ANIMAL COLLAPSE ----------------
  const handleToggle = (id) => setOpenAnimal(openAnimal === id ? null : id);

  // ---------------- OPEN ADD MILK DIALOG ----------------
  const handleOpenAdd = (animal) => {
    setSelectedAnimal(animal);
    setForm({ quantity: "", session: "Am", date: today });
    setOpenAdd(true);
  };

  // ---------------- ADD MILK RECORD ----------------
  const handleAddMilk = async () => {
    if (!selectedAnimal || !groupEmployee) return;

    const session = form.session.trim();
    if (session !== "Am" && session !== "Pm") {
      showSnackbar('Invalid session. Please select "Am" or "Pm".', "error");
      return;
    }

    if (selectedAnimal.record) {
      if ((session === "Am" && selectedAnimal.record.am_quantity != null) ||
          (session === "Pm" && selectedAnimal.record.pm_quantity != null)) {
        showSnackbar(`Milk record for ${session} session already exists for today.`, "error");
        return;
      }
    }

    try {
      const payload = {
        animalTagNo: selectedAnimal.tag_no,
        employee_id: groupEmployee.employee_id,
        quantity: Number(form.quantity),
        date: form.date,
        session,
        colostrum_milk: false,
      };

      const res = await upsertMilkingRecord(payload);

      if (res.statusCode && res.statusCode !== 200) {
        showSnackbar(res.message || "Failed to add milk record", "error");
        return;
      }

      showSnackbar("Milk record added successfully", "success");
      setOpenAdd(false);

      // Refresh only this group
      fetchGroupAnimals(selectedGroup);
    } catch (err) {
      console.error(err);
      showSnackbar(err?.response?.data?.message || "Failed to add milk record", "error");
    }
  };
  const handleSaveMilk = async () => {

  try {

    const payload = {
      animalTagNo: selectedAnimal.tag_no,
      employee_id: form.employee_id || groupEmployee.employee_id,
      quantity: Number(form.quantity),
      date: form.date,
      session: form.session,
      colostrum_milk: false
    };

    await upsertMilkingRecord(payload);

    showSnackbar("Saved Successfully", "success");

    setOpenAdd(false);
    setOpenEdit(false);

    fetchGroupAnimals(selectedGroup);

  } catch (err) {
    showSnackbar("Save failed", "error");
  }

};


  return (
    <Box display="flex" height="100%" mt={3}>
      {/* ---------------- LEFT: GROUPS ---------------- */}
      <Box width="25%" borderRight="1px solid #ddd">
        <Typography variant="h6" p={2}>Groups</Typography>
        <Divider />
        <List>
          {groups.map((g) => (
            <ListItemButton
              key={g.group_id}
              selected={selectedGroup === g.group_id}
              onClick={() => setSelectedGroup(g.group_id)}
            >
              <ListItemText primary={g.group_name} />
            </ListItemButton>
          ))}
          {groups.length === 0 && (
            <Typography variant="body2" p={2} color="text.secondary">
              No groups available for your farm
            </Typography>
          )}
        </List>
      </Box>

      {/* ---------------- RIGHT: TODAY'S MILK RECORDS ---------------- */}
      <Box width="75%" p={3}>
        <Typography variant="h5" mb={2}>🥛 Milk Records</Typography>

        {loading && <CircularProgress />}

        {!loading && groupAnimals.length === 0 && (
          <Typography color="text.secondary">No animals in this group.</Typography>
        )}

        {!loading && groupAnimals.map((animal) => (
          <Card key={animal.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6">🐄 Tag No: {animal.tag_no}</Typography>
                  <IconButton size="small" sx={{color:"rgb(30, 5, 5)"}} onClick={() => handleOpenAdd(animal)}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <IconButton onClick={() => handleToggle(animal.id)}>
                  {openAnimal === animal.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </Box>

              <Typography color="text.secondary" ml={1}>
                Gender: {animal.gender} | Lactation: {animal.lactation_no}
              </Typography>

              <Collapse in={openAnimal === animal.id}>
                <Divider sx={{ my: 2 }} />
                {animal.record ? (
                  <table width="100%" style={{ textAlign: "center" }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>AM</th>
                        <th>PM</th>
                        <th>Total</th>
                        <th>Employee</th>
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{animal.record.date}</td>
                        <td>{animal.record.am_quantity}</td>
                        <td>{animal.record.pm_quantity}</td>
                        <td><b>{animal.record.total_quantity}</b></td>
                        <td>{groupEmployee?.employee_name} ({groupEmployee?.employee_id})</td>
                        <td><IconButton color="primary" onClick={() => handleOpenEdit(animal)}>
  <EditIcon />
</IconButton>
</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <Typography color="error">No milk data available for today</Typography>
                )}
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ---------------- ADD MILK DIALOG ---------------- */}
      <Dialog
  open={openAdd || openEdit}
  onClose={() => {
    setOpenAdd(false);
    setOpenEdit(false);
  }}
>
  <DialogTitle>
    {openEdit ? "Edit Milk" : "Add Milk"}
  </DialogTitle>

  <DialogContent>

    <TextField
      fullWidth
      label="Quantity"
      type="number"
      margin="dense"
      value={form.quantity}
      onChange={(e) =>
        setForm({ ...form, quantity: e.target.value })
      }
    />

    <TextField
      fullWidth
      select
      label="Session"
      margin="dense"
      value={form.session}
      onChange={(e) =>
        setForm({ ...form, session: e.target.value })
      }
    >
      <MenuItem value="Am">Am</MenuItem>
      <MenuItem value="Pm">Pm</MenuItem>
    </TextField>

    <TextField
      fullWidth
      type="date"
      margin="dense"
      value={form.date}
      onChange={(e) =>
        setForm({ ...form, date: e.target.value })
      }
    />

    <TextField
      fullWidth
      select
      label="Employee"
      margin="dense"
      value={form.employee_id || ""}
      onChange={(e) =>
        setForm({ ...form, employee_id: e.target.value })
      }
    >
      {employees.map((emp) => (
        <MenuItem key={emp.employee_id} value={emp.employee_id}>
          {emp.employee_name}
        </MenuItem>
      ))}
    </TextField>

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() => {
        setOpenAdd(false);
        setOpenEdit(false);
      }}
    >
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleSaveMilk}
    >
      Save
    </Button>

  </DialogActions>
</Dialog>

    </Box>
  );
};

export default MilkRecords;
