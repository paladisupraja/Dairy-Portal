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
  MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllPastures, updatePastures, deletePasture } from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";

const Pastures = () => {
  const [pastures, setPastures] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const categories = ["Cow", "Buffalo", "Sheep"];

  // ================= FETCH =================
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
    } catch (err) {
      showSnackbar("Failed to fetch pastures", "error");
    } finally {
      setLoading(false);
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
        showSnackbar("Pasture updated successfully", "success");
        setOpenEdit(false);

        // update UI without refetch
        setPastures(prev =>
          prev.map(p =>
            p.pasture_id === selected.pasture_id ? selected : p
          )
        );
      } else {
        showSnackbar("Update failed", "error");
      }
    } catch {
      showSnackbar("Update failed", "error");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pasture?")) return;

    try {
      const res = await deletePasture({ pasture_id: id });

      if (res.data?.statusCode === 200) {
        showSnackbar("Pasture deleted successfully", "success");

        // ✅ REMOVE FROM UI STATE
        setPastures(prev =>
          prev.filter(p => p.pasture_id !== id)
        );
      } else {
        showSnackbar("Delete failed", "error");
      }
    } catch {
      showSnackbar("Delete failed", "error");
    }
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Pastures</Typography>
            <Button
              variant="contained" sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}
              onClick={() => navigate("/pastures/add")}
            >
              Add Pasture
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Leased</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pastures.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No pastures found
                    </TableCell>
                  </TableRow>
                ) : (
                  pastures.map((p) => (
                    <TableRow key={p.pasture_id}>
                      <TableCell>{p.pasture_id}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.leased ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEdit(p)} sx={{color:"rgb(30, 5, 5)"}}>
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}  sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Pastures;
