import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { getSchedulers, updateSchedulers } from "../../../services";
import { useSnackbar } from "../../../context/SnackbarContext";

const Schedulers = () => {
  const { showSnackbar } = useSnackbar();

  const [schedulers, setSchedulers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchSchedulers();
  }, []);

  const fetchSchedulers = async () => {
    try {
      setLoading(true);
      const res = await getSchedulers();
      setSchedulers(res.data?.details || []);
    } catch {
      showSnackbar("Failed to load schedulers", "error");
    } finally {
      setLoading(false);
    }
  };

  // API Update
  const updateApi = async (item) => {
    try {
      setUpdatingId(item.id);

      await updateSchedulers({
        id: item.id,
        min_days: item.min_days,
        max_days: item.max_days,
      });

      showSnackbar("Updated successfully", "success");
    } catch {
      showSnackbar("Update failed", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // + Increase
  const increaseValue = (index, field) => {
    const updated = [...schedulers];
    updated[index][field] = Number(updated[index][field]) + 1;

    if (updated[index].min_days > updated[index].max_days) {
      showSnackbar("Min cannot exceed Max", "warning");
      return;
    }

    setSchedulers(updated);
    updateApi(updated[index]);
  };

  // - Decrease
  const decreaseValue = (index, field) => {
    const updated = [...schedulers];

    if (updated[index][field] <= 0) return;

    updated[index][field] -= 1;

    if (updated[index].min_days > updated[index].max_days) {
      showSnackbar("Min cannot exceed Max", "warning");
      return;
    }

    setSchedulers(updated);
    updateApi(updated[index]);
  };

  const getTypeIcon = (type) => {
    if (type === "heat_check")
      return <LocalFireDepartmentIcon color="error" />;
    return <AutorenewIcon color="primary" />;
  };

  return (
    <Box p={0}>
      <Typography variant="h5"  mb={1}>
        Scheduler Settings
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {schedulers.map((item, index) => (
            <Grid item xs={12} key={item.id}>
              <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  {/* Header */}
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    {getTypeIcon(item.notification_type)}
                    <Typography variant="h6" fontWeight="bold">
                      {item.notification_type
                        .replace("_", " ")
                        .toUpperCase()}
                    </Typography>

                    {updatingId === item.id && (
                      <CircularProgress size={20} sx={{ ml: 2 }} />
                    )}
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  {/* ===== ROW LAYOUT ===== */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={3}
                  >
                    {/* LEFT → MIN DAYS */}
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Min Days
                      </Typography>

                      <Box display="flex" alignItems="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            decreaseValue(index, "min_days")
                          }
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography
                          sx={{
                            minWidth: 50,
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 18,
                          }}
                        >
                          {item.min_days}
                        </Typography>

                        <IconButton
                          color="success"
                          onClick={() =>
                            increaseValue(index, "min_days")
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* RIGHT → MAX DAYS */}
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Max Days
                      </Typography>

                      <Box display="flex" alignItems="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            decreaseValue(index, "max_days")
                          }
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography
                          sx={{
                            minWidth: 50,
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 18,
                          }}
                        >
                          {item.max_days}
                        </Typography>

                        <IconButton
                          color="success"
                          onClick={() =>
                            increaseValue(index, "max_days")
                          }
                        >
                          <AddIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Schedulers;