import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { getAllMedicines, getMedicineCategories } from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";

const StockInventory = () => {
  const { showSnackbar } = useSnackbar();

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchName, setSearchName] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [medRes, catRes] = await Promise.all([
          getAllMedicines(),
          getMedicineCategories(),
        ]);

        setMedicines(medRes.data?.details || []);
        setCategories(catRes.data?.details || []);
      } catch (err) {
        showSnackbar("Failed to load data", "error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatus = (med) => {
    if (!med.expiry_date) return med.quantity > 0 ? "in" : "out";
    const expiry = new Date(med.expiry_date);
    if (expiry < today || med.quantity === 0) return "out";
    if (med.quantity <= med.min_stock) return "low";
    return "in";
  };

  const filteredMedicines = medicines.filter((med) => {
    if (selectedCategory && med.category_id !== Number(selectedCategory)) return false;
    if (statusFilter && getStatus(med) !== statusFilter) return false;
    if (searchName && !med.name.toLowerCase().includes(searchName.toLowerCase())) return false;
    return true;
  });

  const statusColor = (status) =>
    status === "in" ? "success" : status === "low" ? "warning" : "error";

  return (
    <Box sx={{ padding: 4 }}>
      <Typography  variant="h5" fontWeight={600}>
        Stock Inventory
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, mt:1,flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSearchName("");
              setStatusFilter("");
            }}
          >
            <MenuItem value="">
              <em>All Categories</em>
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">
              <em>All Status</em>
            </MenuItem>
            <MenuItem value="in">In Stock</MenuItem>
            <MenuItem value="low">Low Stock</MenuItem>
            <MenuItem value="out">Out / Expired</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredMedicines.length === 0 ? (
        <Typography sx={{ mt: 4 }}>No medicines found</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["Name", "Category", "Qty", "Unit", "Price", "Expiry", "Status"].map((head) => (
                  <TableCell key={head} align="center" sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMedicines.map((med, idx) => {
                const status = getStatus(med);
                return (
                  <TableRow
                    key={med.id}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? "white" : "#fafafa",
                      "&:hover": { backgroundColor: "#f0f8ff" },
                    }}
                  >
                    <TableCell align="center">{med.name}</TableCell>
                    <TableCell align="center">{med.category}</TableCell>
                    <TableCell align="center">{med.quantity}</TableCell>
                    <TableCell align="center">{med.unit}</TableCell>
                    <TableCell align="center">₹{med.price_per_unit}</TableCell>
                    <TableCell align="center">
                      {med.expiry_date ? new Date(med.expiry_date).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={
                          status === "in"
                            ? "In Stock"
                            : status === "low"
                            ? "Low Stock"
                            : "Out / Expired"
                        }
                        color={statusColor(status)}
                        variant="filled"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StockInventory;
