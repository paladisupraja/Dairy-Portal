import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
  getVendors,
  addVendor,
  updateVendor,
  deleteVendor,
} from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";
import "../../../index.css";

const initialVendorState = {
  vendor_name: "",
  vendor_type: "",
  email: "",
  phone_number: "",
  bank_acc_no: "",
};

const Vendors = () => {
  const { showSnackbar } = useSnackbar();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add / Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [vendorData, setVendorData] = useState(initialVendorState);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* Fetch vendors */
  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await getVendors();
      setVendors(res.data?.details || []);
    } catch {
      showSnackbar("Failed to fetch vendors", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  /* Reset form */
  const resetForm = () => {
    setVendorData(initialVendorState);
    setEditingId(null);
  };

  /* Validate input */
  const validate = () => {
    const { vendor_name, vendor_type, email, phone_number, bank_acc_no } =
      vendorData;

    if (!vendor_name || !vendor_type || !email || !phone_number || !bank_acc_no) {
      showSnackbar("All fields are required", "warning");
      return false;
    }
    if (!/^\d{10}$/.test(phone_number)) {
      showSnackbar("Phone number must be 10 digits", "warning");
      return false;
    }
    if (!/^\d{16}$/.test(bank_acc_no)) {
      showSnackbar("Bank account number must be 16 digits", "warning");
      return false;
    }
    return true;
  };

  /* Add or Update vendor */
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingId) {
        await updateVendor({ ...vendorData, vendor_id: editingId });

        setVendors((prev) =>
          prev.map((v) =>
            v.vendor_id === editingId ? { ...v, ...vendorData } : v
          )
        );

        showSnackbar("Vendor updated successfully", "success");
      } else {
        const res = await addVendor(vendorData);

        setVendors((prev) => [res.data.details, ...prev]);

        showSnackbar("Vendor added successfully", "success");
      }

      setDialogOpen(false);
      resetForm();
      fetchVendors(); // sync with backend
    } catch {
      showSnackbar("Failed to save vendor", "error");
    } finally {
      setSaving(false);
    }
  };

  /* Delete vendor */
  const handleDelete = async () => {
    try {
      await deleteVendor({ vendor_id: deleteId });
      setVendors((prev) =>
        prev.filter((v) => v.vendor_id !== deleteId)
      );
      showSnackbar("Vendor deleted successfully", "success");
    } catch {
      showSnackbar("Failed to delete vendor", "error");
    } finally {
      setDeleteOpen(false);
      setDeleteId(null);
    }
  };

  /* Open edit dialog */
  const handleEdit = (vendor) => {
    setVendorData({
      vendor_name: vendor.vendor_name,
      vendor_type: vendor.vendor_type,
      email: vendor.email,
      phone_number: vendor.phone_number,
      bank_acc_no: vendor.bank_acc_no || "",
    });
    setEditingId(vendor.vendor_id);
    setDialogOpen(true);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Vendors</Typography>
        <Button
          size="small"
          variant="contained"
          className="bg-color"
          onClick={() => {
            resetForm();
            setDialogOpen(true);
          }}
        >
          Add Vendor
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <CircularProgress size={24} />
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell align="center"><b>ID</b></TableCell>
                <TableCell align="center"><b>Name</b></TableCell>
                <TableCell align="center"><b>Type</b></TableCell>
                <TableCell align="center"><b>Email</b></TableCell>
                <TableCell align="center"><b>Phone</b></TableCell>
                <TableCell align="center"><b>Bank Acc</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.vendor_id} hover>
                  <TableCell align="center">{vendor.vendor_id}</TableCell>
                  <TableCell align="center">{vendor.vendor_name}</TableCell>
                  <TableCell align="center">{vendor.vendor_type}</TableCell>
                  <TableCell align="center">{vendor.email}</TableCell>
                  <TableCell align="center">{vendor.phone_number}</TableCell>
                  <TableCell align="center">{vendor.bank_acc_no}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" className="color" onClick={() => handleEdit(vendor)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        setDeleteId(vendor.vendor_id);
                        setDeleteOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {vendors.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No vendors found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editingId ? "Edit Vendor" : "Add Vendor"}</DialogTitle>
        <DialogContent sx={{ minWidth: 500 }}>
          <Stack spacing={1} mt={1}>
            {Object.keys(initialVendorState).map((key) => (
              <TextField
                key={key}
                label={key.replace(/_/g, " ").toUpperCase()}
                fullWidth
                size="small"
                
                value={vendorData[key]}
                onChange={(e) =>
                  setVendorData({ ...vendorData, [key]: e.target.value })
                }
                inputProps={{
                  maxLength:
                    key === "phone_number"
                      ? 10
                      : key === "bank_acc_no"
                      ? 16
                      : undefined,
                }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            className="color"
            onClick={() => {
              setDialogOpen(false);
              resetForm();
            }}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="contained"
            className="bg-color"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <CircularProgress size={18} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this vendor?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Vendors;
