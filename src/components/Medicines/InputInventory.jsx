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
  Chip,
  CircularProgress,
  TextField,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "../../context/SnackbarContext";
import {
  getAllMedicines,
  getMedicineList,
  getMedicineCategories,
  addMedicine,
  getVendors,
  getUnits,
} from "../../services";
import "../../index.css";

/* ✅ Fixed Medicine Names */


// ...import statements same as yours

const InputInventory = () => {
  const { showSnackbar } = useSnackbar();

  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [getMedicineLists, setMedicineLists] = useState([]);
  const [units, setUnits] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    vendor_id: "",
    quantity: "",
    unit: "",
    price_per_unit: "",
    purchase_date: "",
    manufactured_date: "",
    expiry_date: "",
    min_stock: "",
  });

  const today = new Date().toISOString().split("T")[0];

  // ================= API CALLS =================
  useEffect(() => {
    fetchMedicineLists();
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [search, categoryFilter]);

  const fetchMedicineLists = async () => {
    try {
      const res = await getMedicineList();
      setMedicineLists(res.data?.details || []);
    } catch {
      showSnackbar("Failed to load medicine names", "error");
    }
  };

  const fetchInitialData = async () => {
    fetchInventory();
    fetchCategories();
    fetchVendors();
    fetchUnits();
  };

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter !== "all") params.category = categoryFilter;

      const res = await getAllMedicines(params);
      setInventory(res.data?.details || []);
    } catch {
      showSnackbar("Failed to load inventory", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await getMedicineCategories();
    setCategories(res.data?.details || []);
  };

  const fetchVendors = async () => {
    const res = await getVendors();
    setVendors(res.data?.details || []);
  };

  const fetchUnits = async () => {
    const res = await getUnits();
    setUnits(res.data?.details || []);
  };

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ VALIDATION
  const validateForm = () => {
    const e = {};

    // Required fields
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) e[key] = "Required";
    });

    // Quantity, Price, Min Stock must be numbers > 0
    if (formData.quantity && (isNaN(formData.quantity) || Number(formData.quantity) <= 0)) {
      e.quantity = "Quantity must be a positive number";
    }

    if (formData.price_per_unit && (isNaN(formData.price_per_unit) || Number(formData.price_per_unit) <= 0)) {
      e.price_per_unit = "Price must be a positive number";
    }

    if (formData.min_stock && (isNaN(formData.min_stock) || Number(formData.min_stock) < 0)) {
      e.min_stock = "Min Stock cannot be negative";
    }

    // Date validations
    if (
      formData.manufactured_date &&
      formData.expiry_date &&
      new Date(formData.manufactured_date) >= new Date(formData.expiry_date)
    ) {
      e.expiry_date = "Expiry must be after manufactured date";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddMedicine = async () => {
    if (!validateForm()) {
      showSnackbar("Please fill all details correctly", "error");
      return;
    }

    try {
      await addMedicine(formData);
      showSnackbar("Medicine added successfully", "success");
      setOpenAdd(false);
      setFormData({
        name: "",
        category: "",
        vendor_id: "",
        quantity: "",
        unit: "",
        price_per_unit: "",
        purchase_date: "",
        manufactured_date: "",
        expiry_date: "",
        min_stock: "",
      });
      setErrors({});
      fetchInventory();
    } catch {
      showSnackbar("Failed to add medicine", "error");
    }
  };

  const isExpired = (date) => date && new Date(date) < new Date();

  // ================= UI =================
  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="h5" fontWeight={600}>
          Inventory Management
        </Typography>
        <IconButton className="color" onClick={() => setOpenAdd(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* SEARCH & FILTER */}
      <Card sx={{ mb: 1 }}>
        <CardContent sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Search Medicine"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 300 }}
          >
            <MenuItem value="all">All</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {/* INVENTORY TABLE */}
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
                  <TableCell><b>Name</b></TableCell>
                  <TableCell><b>Category</b></TableCell>
                  <TableCell><b>Qty</b></TableCell>
                  <TableCell><b>Unit</b></TableCell>
                  <TableCell><b>Price</b></TableCell>
                  <TableCell><b>Expiry</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>₹{item.price_per_unit}</TableCell>
                      <TableCell>
                        {item.expiry_date
                          ? new Date(item.expiry_date).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {isExpired(item.expiry_date) ? (
                          <Chip label="Expired" color="error" />
                        ) : item.quantity <= item.min_stock ? (
                          <Chip label="Low Stock" color="warning" />
                        ) : (
                          <Chip label="Active" color="success" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ADD MEDICINE MODAL */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Medicine</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Medicine Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          >
            {getMedicineLists.map((m) => (
              <MenuItem key={m.id} value={m.name}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Vendor"
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            error={!!errors.vendor_id}
            helperText={errors.vendor_id}
          >
            {vendors.map((v) => (
              <MenuItem key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            error={!!errors.quantity}
            helperText={errors.quantity}
          />

          <TextField
            select
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            error={!!errors.unit}
            helperText={errors.unit}
          >
            {units.map((u) => (
              <MenuItem key={u.id} value={u.code}>
                {u.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Price per Unit"
            type="number"
            name="price_per_unit"
            value={formData.price_per_unit}
            onChange={handleChange}
            error={!!errors.price_per_unit}
            inputProps={{ min: 1 }}
            helperText={errors.price_per_unit}
          />

          <TextField
            type="date"
            label="Purchase Date"
            name="purchase_date"
            InputLabelProps={{ shrink: true }}
            inputProps={{max:today}}
            value={formData.purchase_date}
            onChange={handleChange}
            error={!!errors.purchase_date}
            helperText={errors.purchase_date}
          />

          <TextField
            type="date"
            label="Manufactured Date"
            name="manufactured_date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ max: today }}
            value={formData.manufactured_date}
            onChange={handleChange}
            error={!!errors.manufactured_date}
            helperText={errors.manufactured_date}
          />

          <TextField
            type="date"
            label="Expiry Date"
            name="expiry_date"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: today }}
            value={formData.expiry_date}
            onChange={handleChange}
            error={!!errors.expiry_date}
            helperText={errors.expiry_date}
          />

          <TextField
            label="Min Stock"
            name="min_stock"
             type="number"
            value={formData.min_stock}
            onChange={handleChange}
            error={!!errors.min_stock}
             inputProps={{ min: 1 }}
            helperText={errors.min_stock}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} className="color">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddMedicine}
           className="bg-color"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InputInventory;


