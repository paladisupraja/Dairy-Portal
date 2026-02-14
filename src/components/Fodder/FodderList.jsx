import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Grid, CircularProgress,Tabs,Tab } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import { getFodderStatus, getLowStockFodder } from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import OverView from "./OverView";
import Stock from "./Stock";
import Consume from "./Consume";
import Reports from "./Reports";
const FodderList = () => {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [tab,setTab]=useState(0);

  const [summary, setSummary] = useState({
    fodderTypeCount: 0,
    activeBatchCount: 0,
    lowStockCount: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const [statusRes, lowStockRes] = await Promise.all([
          getFodderStatus(),
          getLowStockFodder(),
        ]);

        if (statusRes.data.statusCode === 200) {
          setSummary((prev) => ({
            ...prev,
            fodderTypeCount: statusRes.data.details.summary.fodderTypeCount,
            activeBatchCount: statusRes.data.details.summary.activeBatchCount,
          }));
        }

        if (lowStockRes.data.statusCode === 200) {
          setSummary((prev) => ({
            ...prev,
            lowStockCount: lowStockRes.data.details.length,
          }));
        }
      } catch (err) {
        showSnackbar("Failed to load fodder summary", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Box p={3}>
      <Grid container spacing={2}>
        {/* Fodder Types */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <CategoryIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Fodder Types
              </Typography>
              <Typography variant="h5">
                {summary.fodderTypeCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Active Batches */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <InventoryIcon color="success" fontSize="large" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Active Batches
              </Typography>
              <Typography variant="h5">
                {summary.activeBatchCount}
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Low Stock */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <WarningIcon color="error" fontSize="large" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Low Stock
              </Typography>
              <Typography variant="h5" color="error">
                {summary.lowStockCount}
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

    <Tabs
  value={tab}
  onChange={(e, newValue) => setTab(newValue)}
  sx={{
    borderBottom: "1px solid #eee",
    mt: 1,
    "& .MuiTabs-flexContainer": { gap: 4 },

    /* Default tab style */
    "& .MuiTab-root": {
      
      fontSize: "14px",
      fontWeight: 500,
      color: "#666",
    },

    /* Selected tab style */
    "& .Mui-selected": {
      color: "rgb(42,8,11) !important",
      fontWeight: 600,
    },
  }}
  TabIndicatorProps={{
    sx: {
      backgroundColor: "rgb(42,8,11)",
      height: 3,
      borderRadius: 2,
    },
  }}
>
  <Tab label="OverView" />
  <Tab label="Stock" />
  <Tab label="Consume" />
  <Tab label="Reports" />
</Tabs>

      <Box mt={2}>
        {tab === 0 && <OverView />}
        {tab === 1 && <Stock />}
        {tab === 2 && <Consume />}
        {tab === 3 && <Reports />}
      </Box>
    </Box>
  );
};

export default FodderList;
