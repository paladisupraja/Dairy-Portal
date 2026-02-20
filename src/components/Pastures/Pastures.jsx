import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  CircularProgress,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Divider
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {
  getAllPastures,
  updatePastures,
  deletePasture,
  getPastureDetailsById
} from "../../services";

import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";

const Pastures = () => {

  const [pastures, setPastures] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [openView, setOpenView] = useState(false);

  const [selected, setSelected] = useState(null);
  const [viewData, setViewData] = useState(null);

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const categories = ["Cow", "Buffalo", "Sheep"];

  // ================= FETCH LIST =================
  useEffect(() => {
    fetchPastures();
  }, []);

  const fetchPastures = async () => {
    setLoading(true);
    try {
      const res = await getAllPastures();
      if (res.data?.statusCode === 200) {
        setPastures(res.data.details || []);
      }
    } catch {
      showSnackbar("Failed to fetch pastures", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= VIEW DETAILS =================
  const handleView = async (id) => {
    try {
      const res = await getPastureDetailsById(id);
      if (res.data?.statusCode === 200) {
        setViewData(res.data.details);
        setOpenView(true);
      }
    } catch {
      showSnackbar("Failed to load details", "error");
    }
  };

  // ================= EDIT =================
  const handleEdit = (row) => {
    setSelected({ ...row });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        pasture_id: selected.pasture_id,
        name: selected.name,
        category: selected.category
      };

      const res = await updatePastures(payload);

      if (res.data?.statusCode === 200) {
        showSnackbar("Updated Successfully", "success");
        setOpenEdit(false);

        setPastures(prev =>
          prev.map(p =>
            p.pasture_id === selected.pasture_id ? selected : p
          )
        );
      }
    } catch {
      showSnackbar("Update Failed", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pasture?")) return;

    try {
      const res = await deletePasture({ pasture_id: id });

      if (res.data?.statusCode === 200) {
        showSnackbar("Deleted Successfully", "success");
        setPastures(prev => prev.filter(p => p.pasture_id !== id));
      }
    } catch {
      showSnackbar("Delete Failed", "error");
    }
  };

  return (
    <Box p={0}>

      {/* ================= MAIN TABLE ================= */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5" fontWeight={600}>
              Pastures
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "rgb(42,8,11)",
                "&:hover": { backgroundColor: "rgb(30,5,5)" }
              }}
              onClick={() => navigate("/pastures/add")}
            >
              Add Pasture
            </Button>
          </Box>

          {loading ? (
            <Box textAlign="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">

              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pastures.map((p) => (
                  <TableRow key={p.pasture_id} hover>
                    <TableCell>{p.pasture_id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>

                    <TableCell>

                      <IconButton
                        color="primary"
                        onClick={() => handleView(p.pasture_id)}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        onClick={() => handleEdit(p)}
                        sx={{ color: "rgb(42,8,11)" }}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(p.pasture_id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          )}

        </CardContent>
      </Card>

      {/* ================= VIEW DETAILS DIALOG ================= */}
      <Dialog open={openView} onClose={() => setOpenView(false)} maxWidth="md" fullWidth>
        <DialogTitle>Pasture Details</DialogTitle>

        <DialogContent>

          {viewData && (
            <>

              {/* Pasture Info */}
              <Card sx={{ mb: 2, background: "#fafafa" }}>
                <CardContent>
                  <Typography><b>Name:</b> {viewData.pasture?.name}</Typography>
                  <Typography><b>Category:</b> {viewData.pasture?.category}</Typography>
                  <Typography><b>Size:</b> {viewData.pasture?.size || "-"}</Typography>
                  <Typography><b>Total Employees:</b> {viewData.employee_count}</Typography>
                </CardContent>
              </Card>

              <Divider sx={{ my: 2 }} />

              {/* Employees Table */}
              <Typography variant="h6" mb={1}>Employees</Typography>

              <Table size="small" sx={{ mb: 3 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {viewData.employees?.map(emp => (
                    <TableRow key={emp.employee_id}>
                      <TableCell>{emp.employee_id}</TableCell>
                      <TableCell>{emp.employee_name}</TableCell>
                      <TableCell>{emp.job_role}</TableCell>
                      <TableCell>{emp.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Animal Counts */}
              <Typography variant="h6" mb={1}>Animal Counts</Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Animal Type</TableCell>
                    <TableCell>Count</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {viewData.animal_counts?.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell>{a.animal_type}</TableCell>
                      <TableCell>{a.count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </>
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenView(false)} sx={{color:"rgb(42,8,11)"}}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ================= EDIT DIALOG ================= */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
        <DialogTitle>Edit Pasture</DialogTitle>

        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={selected?.name || ""}
            onChange={(e) =>
              setSelected({ ...selected, name: e.target.value })
            }
          />

          <TextField
            select
            label="Category"
            fullWidth
            margin="normal"
            value={selected?.category || ""}
            onChange={(e) =>
              setSelected({ ...selected, category: e.target.value })
            }
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: "rgb(42,8,11)",
              "&:hover": { backgroundColor: "rgb(30,5,5)" }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default Pastures;