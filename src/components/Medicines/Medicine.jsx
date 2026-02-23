import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab, Grid, Card, CardContent, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import InputInventory from "./InputInventory";
import OutputInventory from "./OutputInventory";
import StockManagement from "./StockInventory";
import { getMedicineStats } from "../../services";
import "../../index.css";

const Medicine = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    low_stock_count: 0,
    out_of_stock_count: 0,
    expired_count: 0,
    not_expired_count: 0,
  });

  useEffect(() => {
    fetchMedicineStats();
  }, []);

  const fetchMedicineStats = async () => {
    try {
      const res = await getMedicineStats();
      setStats(res.data?.details || {});
    } catch (err) {
      console.error("Failed to fetch medicine stats", err);
    }
  };

  // Array for easy mapping of stats cards
  const statCards = [
    { label: "Total Medicines", value: stats.total, color: "primary.main", icon: <Inventory2Icon fontSize="large" /> },
    { label: "Low Stock", value: stats.low_stock_count, color: "warning.main", icon: <WarningAmberIcon fontSize="large" /> },
    { label: "Out of Stock", value: stats.out_of_stock_count, color: "error.main", icon: <ReportProblemIcon fontSize="large" /> },
    { label: "Expired", value: stats.expired_count, color: "error.main", icon: <CancelIcon fontSize="large" /> },
    { label: "Not Expired", value: stats.not_expired_count, color: "success.main", icon: <CheckCircleIcon fontSize="large" /> },
  ];

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff", p: 0 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Medicine Inventory
      </Typography>

      {/* ===== STATS CARDS WITH ICONS ===== */}
      <Grid container spacing={2} mb={1}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={idx}>
            <Card sx={{ display: "flex", alignItems: "center", p: 1 }}>
              <Box sx={{ mr: 2, color: card.color }}>{card.icon}</Box>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  {card.label}
                </Typography>
                <Typography variant="h6" fontWeight={600} color={card.color}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== TABS BAR ===== */}
      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid #e0e0e0",
          overflowX: "auto",
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            "& .MuiTabs-flexContainer": { gap: 2 },
            "& .MuiTab-root": {
              fontSize: "14px",
              fontWeight: 500,
              color: "#6f6f6f",
              minWidth: "auto",
              padding: "12px 0",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "navy",
              fontWeight: 600,
            },
          }}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "navy",
              height: 3,
            },
          }}
        >
          <Tab label="Input Inventory" />
          <Tab label="Output Inventory" />
          <Tab label="Stock Management" />
        </Tabs>
      </Box>

      {/* ===== TAB CONTENT ===== */}
      <Box sx={{ mt: 1 }}>
        {tabIndex === 0 && <InputInventory />}
        {tabIndex === 1 && <OutputInventory />}
        {tabIndex === 2 && <StockManagement />}
      </Box>
    </Box>
  );
};

export default Medicine;
