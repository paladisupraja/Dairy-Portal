import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

import {
  getGroups,
  getAllPastures,
  getAllGroupTypes,
  createGroup,
} from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";

const GroupsList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Add Group Dialog state
  const [openAddGroup, setOpenAddGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [farmId, setFarmId] = useState("");
  const [groupType, setGroupType] = useState("");
  const [groupCategory, setGroupCategory] = useState("");
  const [parentGroupId, setParentGroupId] = useState("");
  const [farms, setFarms] = useState([]);
  const [groupTypes, setGroupTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user.role === "employee";

  useEffect(() => {
    fetchGroups();
    fetchFarms();
    fetchGroupTypes();
  }, []);

  useEffect(() => {
    // Pre-fill farmId for employee
    if (isEmployee && farms.length > 0) {
      setFarmId(user.farm_id);
    }
  }, [farms]);

  // Fetch all groups
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const params = {};
      if (isEmployee) {
        params.farmId = user.farm_id; // filter by employee's farm
      }
      const res = await getGroups(params);
      setGroups(res.data.details || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load groups", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all pastures/farms
  const fetchFarms = async () => {
    try {
      const res = await getAllPastures();
      setFarms(res.data.details || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all group types
  const fetchGroupTypes = async () => {
    try {
      const res = await getAllGroupTypes();
      setGroupTypes(res.data.details || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Add Group
  const handleAddGroup = async () => {
    if (!groupName || !farmId || !groupType || !groupCategory) {
      showSnackbar("Please fill all required fields", "warning");
      return;
    }

    try {
      setSubmitting(true);
      await createGroup({
        groupName,
        farm_id: Number(farmId),
        groupType,
        groupCategory,
        parentGroupId: parentGroupId ? Number(parentGroupId) : undefined,
      });
      showSnackbar("Group created successfully", "success");
      setOpenAddGroup(false);
      setGroupName("");
      setFarmId(isEmployee ? user.farm_id : ""); // Reset based on role
      setGroupType("");
      setGroupCategory("");
      setParentGroupId("");
      fetchGroups();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to create group", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Get animal count by type
  const getAnimalCount = (animals = [], type) =>
    animals.filter((a) => a.name?.toLowerCase() === type.toLowerCase()).length;

  if (loading) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Groups List
        </Typography>
        <Button sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}variant="contained" onClick={() => setOpenAddGroup(true)}>
          Add Group
        </Button>
      </Box>

      {/* Groups Grid */}
      <Grid container spacing={2}>
        {groups.map((group) => (
          <Grid item xs={12} md={6} lg={4} key={group.group_id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                },
              }}
              onClick={() => navigate(`/grouping/${group.group_id}`)}
            >
              <CardContent>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {group.group_name || "Unnamed Group"}
                  </Typography>
                  <Typography variant="caption" color="primary" fontWeight={600}>
                    ID: {group.group_id}
                  </Typography>
                </Box>

                {/* Info */}
                <Typography variant="body2" color="text.secondary">
                  <b>Type:</b> {group.group_type || "-"} |{" "}
                  <b>Category:</b> {group.group_category || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  <b>Employee:</b> {group.employee_name || "N/A"}
                </Typography>

                {/* Animal Counts */}
                <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip
                    label={`🐄 Cow: ${getAnimalCount(group.animals, "Cow")}`}
                    size="small"
                  />
                  <Chip
                    label={`🐃 Buffalo: ${getAnimalCount(group.animals, "Buffalo")}`}
                    size="small"
                  />
                  <Chip
                    label={`🐑 Sheep: ${getAnimalCount(group.animals, "Sheep")}`}
                    size="small"
                  />
                  <Chip
                    label={`🐐 Goat: ${getAnimalCount(group.animals, "Goat")}`}
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Group Dialog */}
      <Dialog open={openAddGroup} onClose={() => setOpenAddGroup(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New Group</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mt: 1 }}
          />

          {/* Farm Select */}
          {isEmployee ? (
            <TextField
              label="Farm / Pasture"
              fullWidth
              value={user.farm_id}
              sx={{ mt: 2 }}
              disabled
            />
          ) : (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Farm / Pasture</InputLabel>
              <Select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                label="Farm / Pasture"
              >
                {farms.map((f) => (
                  <MenuItem key={f.pasture_id} value={f.pasture_id}>
                    {f.pasture_id} ({f.category})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Group Type */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Group Type</InputLabel>
            <Select
              value={groupType}
              onChange={(e) => setGroupType(e.target.value)}
              label="Group Type"
            >
              {groupTypes.map((g) => (
                <MenuItem key={g.id} value={g.group_type}>
                  {g.group_type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Category */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={groupCategory}
              onChange={(e) => setGroupCategory(e.target.value)}
              label="Category"
            >
              {["Cow", "Buffalo", "Sheep", "Goat"].map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Parent Group */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Group</InputLabel>
            <Select
              value={parentGroupId}
              onChange={(e) => setParentGroupId(e.target.value)}
              label="Group"
            >
              <MenuItem value="">None</MenuItem>
              {groups.map((g) => (
                <MenuItem key={g.group_id} value={g.group_id}>
                  {g.group_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAddGroup(false)} sx={{color:"rgb(42, 8, 11)"}}>Cancel</Button>
          <Button variant="contained"  sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}onClick={handleAddGroup} disabled={submitting}>
            {submitting ? "Creating..." : "Create Group"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupsList;
