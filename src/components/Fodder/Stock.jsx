import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
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

import { useSnackbar } from "../../context/SnackbarContext";
import { getFodderData } from "../../services";
import "../../index.css";

const Stock = () => {
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [fodderData, setFodderData] = useState([]);

  // dialog states
  const [openAddStock, setOpenAddStock] = useState(false);

  // dummy dropdown data (replace with API)
  const fodderTypes = [
    { id: 1, food: "Dry Grass" },
    { id: 2, food: "Wet Grass" },
  ];

  const vendors = [
    { vendor_id: 1, vendor_name: "Vendor A" },
    { vendor_id: 2, vendor_name: "Vendor B" },
  ];

  const [stockForm, setStockForm] = useState({
    fodder_type_id: "",
    date: "",
    vendor_id: "",
    quantity: "",
    cost_per_kg: "",
  });

  useEffect(() => {
    fetchFodderData();
  }, []);

  const fetchFodderData = async () => {
    setLoading(true);
    try {
      const res = await getFodderData();
      if (res?.data?.details) {
        setFodderData(res.data.details);
      }
    } catch {
      showSnackbar("Failed to load fodder data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = () => {
    console.log("Add Stock Payload", stockForm);
    showSnackbar("Stock added successfully", "success");
    setOpenAddStock(false);
  };

  return (
    <Box p={3}>
      {/* ===== Header ===== */}
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h5" fontWeight={600}>
            Fodder Stock
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Current available batches
          </Typography>
        </Box>

        <Button
          variant="contained" className="bg-color"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddStock(true)}
        >
          Add Stock
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* ===== Loading ===== */}
      {loading && <CircularProgress size={28} />}

      {/* ===== Empty ===== */}
      {!loading && fodderData.length === 0 && (
        <Typography color="text.secondary">
          No fodder data available
        </Typography>
      )}

      {/* ===== Table ===== */}
      {!loading && fodderData.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: "1px solid #eee", borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                {[
                  "Batch",
                  "Fodder",
                  "Qty",
                  "Initial",
                  "Consumed",
                  "Cost / kg",
                  "Status",
                  "Date",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontWeight: 600,
                      fontSize: 13,
                      backgroundColor: "#fafafa",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {fodderData.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.fodder_type_name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">
                    {item.initial_quantity}
                  </TableCell>
                  <TableCell align="center">
                    {item.consumed_quantity}
                  </TableCell>
                  <TableCell align="right">
                    ₹{item.cost_per_kg}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.quantity === 0 ? "Out" : "Available"}
                      size="small"
                      color={item.quantity === 0 ? "error" : "success"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(item.date_added).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ===== Add Stock Dialog ===== */}
      <Dialog
        open={openAddStock}
        onClose={() => setOpenAddStock(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Stock</DialogTitle>
        <Divider />

        <DialogContent sx={{ pt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            select
            label="Fodder Type"
            value={stockForm.fodder_type_id}
            onChange={(e) =>
              setStockForm({ ...stockForm, fodder_type_id: e.target.value })
            }
          >
            {fodderTypes.map((f) => (
              <MenuItem key={f.id} value={f.id}>
                {f.food}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Date"
            InputLabelProps={{ shrink: true }}
            value={stockForm.date}
            onChange={(e) =>
              setStockForm({ ...stockForm, date: e.target.value })
            }
          />

          <TextField
            select
            label="Vendor"
            value={stockForm.vendor_id}
            onChange={(e) =>
              setStockForm({ ...stockForm, vendor_id: e.target.value })
            }
          >
            {vendors.map((v) => (
              <MenuItem key={v.vendor_id} value={v.vendor_id}>
                {v.vendor_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            label="Quantity (Kg)"
            value={stockForm.quantity}
            onChange={(e) =>
              setStockForm({ ...stockForm, quantity: e.target.value })
            }
          />

          <TextField
            type="number"
            label="Cost / Kg"
            value={stockForm.cost_per_kg}
            onChange={(e) =>
              setStockForm({ ...stockForm, cost_per_kg: e.target.value })
            }
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpenAddStock(false)} className="color">Cancel</Button>
          <Button variant="contained" onClick={handleAddStock} className="bg-color">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Stock;
