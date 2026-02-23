import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Grid,
  CircularProgress,
  LinearProgress,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import GrassIcon from "@mui/icons-material/Grass";
import NatureIcon from "@mui/icons-material/Nature";
import "../../index.css"

import {
  getConsumptionStats,
  addFodderData,
  addFodderType,
  getFodderTypes,
  getAllVendors,
} from "../../services";

import { useSnackbar } from "../../context/SnackbarContext";

const OverView = () => {
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [openAddStock, setOpenAddStock] = useState(false);
  const [openAddType, setOpenAddType] = useState(false);

  const [fodderTypes, setFodderTypes] = useState([]);
  const [vendors, setVendors] = useState([]);

  const [stockForm, setStockForm] = useState({
    fodder_type_id: "",
    date: "",
    vendor_id: "",
    quantity: "",
    cost_per_kg: "",
  });

  const [newType, setNewType] = useState("");

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    fetchOverview();
    loadMasterData();
  }, []);

  const fetchOverview = async () => {
    setLoading(true);
    try {
      const res = await getConsumptionStats();
      if (res.data.statusCode === 200) setData(res.data.details);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load stock status", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMasterData = async () => {
    try {
      const [typesRes, vendorsRes] = await Promise.all([
        getFodderTypes(),
        getAllVendors(),
      ]);
      setFodderTypes(typesRes.data.details);
      setVendors(vendorsRes.data.details);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load dropdown data", "error");
    }
  };

  /* ---------------- ICON ---------------- */
  const getIcon = (type) => {
    if (!type) return <GrassIcon color="warning" fontSize="large" />;
    switch (type.toLowerCase()) {
      case "wet grass":
        return <LocalFloristIcon color="success" fontSize="large" />;
      case "grass y":
        return <NatureIcon color="primary" fontSize="large" />;
      default:
        return <GrassIcon color="warning" fontSize="large" />;
    }
  };

  /* ---------------- VALIDATION BEFORE SAVE ---------------- */
  const validateStockForm = () => {
    if (
      !stockForm.fodder_type_id ||
      !stockForm.date ||
      !stockForm.vendor_id ||
      !stockForm.quantity ||
      !stockForm.cost_per_kg
    ) {
      showSnackbar("Please fill all required fields", "error");
      return false;
    }
    if (Number(stockForm.quantity) <= 0 || Number(stockForm.cost_per_kg) <= 0) {
      showSnackbar("Quantity and Cost must be greater than zero", "error");
      return false;
    }
    return true;
  };

  /* ---------------- HANDLE ADD STOCK ---------------- */
  const handleAddStock = async () => {
    if (!validateStockForm()) return;

    try {
      const payload = {
        ...stockForm,
        quantity: Number(stockForm.quantity),
        cost_per_kg: Number(stockForm.cost_per_kg),
      };
      await addFodderData(payload);
      showSnackbar("Stock added successfully", "success");
      setOpenAddStock(false);
      setStockForm({
        fodder_type_id: "",
        date: "",
        vendor_id: "",
        quantity: "",
        cost_per_kg: "",
      });
      fetchOverview();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add stock", "error");
    }
  };

  /* ---------------- HANDLE ADD TYPE ---------------- */
  const handleAddType = async () => {
    if (!newType) {
      showSnackbar("Please enter fodder type", "error");
      return;
    }

    try {
      await addFodderType({ food: newType });
      showSnackbar("Fodder type added", "success");
      setNewType("");
      setOpenAddType(false);
      loadMasterData();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to add fodder type", "error");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* ---------- HEADER ---------- */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight={600}>
          Stock Status
        </Typography>

        <Box display="flex" gap={1.5}>
          <Button
            variant="contained"
            className="bg-color"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddStock(true)}
          >
            Add Stock
          </Button>

          <Button
            variant="outlined"
            className="bg-color"
            startIcon={<CategoryIcon />}
            onClick={() => setOpenAddType(true)}
          >
            Add Type
          </Button>
        </Box>
      </Box>

      {/* ---------- STOCK CARDS ---------- */}
      {data.length === 0 ? (
        <Typography mt={5} textAlign="center">
          No stock data available
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {data.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.fodder_type_id}>
              <Card sx={{ p: 2.5, borderRadius: 2, maxWidth: 360, mx: "auto" }}>
                <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                  {getIcon(item.fodder_type)}
                  <Typography variant="h6">{item.fodder_type}</Typography>
                </Box>

                <Divider />

                <Grid container spacing={2} mt={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption">Total</Typography>
                    <Typography variant="h6">{item.total_quantity}</Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption">Consumed</Typography>
                    <Typography variant="h6" color="error">
                      {item.consumed_quantity}
                    </Typography>
                  </Grid>
                </Grid>

                <Box mt={2}>
                  <Typography variant="caption">
                    Consumed ({item.consumed_percentage}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Number(item.consumed_percentage)}
                    sx={{ height: 8, borderRadius: 5, mb: 1 }}
                  />

                  <Typography variant="caption">
                    Remaining ({item.remaining_percentage}%)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Number(item.remaining_percentage)}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ---------- ADD STOCK DIALOG ---------- */}
      <Dialog open={openAddStock} onClose={() => setOpenAddStock(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Stock</DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            fullWidth
            label="Fodder Type"
            value={stockForm.fodder_type_id}
            onChange={(e) => setStockForm({ ...stockForm, fodder_type_id: e.target.value })}
          >
            {fodderTypes.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.food}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            fullWidth
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={stockForm.date}
            onChange={(e) => setStockForm({ ...stockForm, date: e.target.value })}
          />

          <TextField
            select
            fullWidth
            label="Vendor"
            value={stockForm.vendor_id}
            onChange={(e) => setStockForm({ ...stockForm, vendor_id: e.target.value })}
          >
            {vendors.map((v) => (
              <MenuItem key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Quantity (Kg)"
            value={stockForm.quantity}
            onChange={(e) => setStockForm({ ...stockForm, quantity: e.target.value })}
          />

          <TextField
            fullWidth
            type="number"
            label="Cost / Kg"
            value={stockForm.cost_per_kg}
            onChange={(e) => setStockForm({ ...stockForm, cost_per_kg: e.target.value })}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenAddStock(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleAddStock}className="bg-color">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------- ADD TYPE DIALOG ---------- */}
      <Dialog open={openAddType} onClose={() => setOpenAddType(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Fodder Type</DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Fodder Type Name"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAddType(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleAddType} className="bg-color">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OverView;
