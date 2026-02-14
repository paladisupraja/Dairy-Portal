import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { getCountsByAnimal } from "../../services";
import { Box, Card, Typography, Grid } from "@mui/material";

import cowIcon from "../../assets/icons8-cow-48.png";
import buffaloIcon from "../../assets/icons8-water-buffalo-48.png";
import openIcon from "../../assets/open.png";
import inseminationIcon from "../../assets/insemination.png";
import pregnancyIcon from "../../assets/pregnancy.png";
import motherIcon from "../../assets/mother.png";
import calfIcon from "../../assets/calf.png";
import heiferIcon from "../../assets/heifer.png";
import bullIcon from "../../assets/bull.png";
import freshIcon from "../../assets/fresh.png";
import dryIcon from "../../assets/dry.png";

/* ================= CLEAN STAT CARD ================= */

const StatCard = ({ icon, label, value, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: onClick ? "pointer" : "default",
      borderRadius: "12px",
      background: "#fff",
      border: "1px solid #eef1f5",
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      transition: "all 0.2s ease",

      "&:hover": onClick
        ? {
            boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            transform: "translateY(-2px)"
          }
        : {},

      px: 3,
      py: 3,
      textAlign: "center"
    }}
  >
    <Box
      component="img"
      src={icon}
      sx={{
        height: 44,
        mb: 1.5,
        opacity: 0.9
      }}
    />

    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 600,
        color: "#5f6b7a"
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontSize: 24,
        fontWeight: 700,
        color: "#1a1f36",
        mt: 0.5
      }}
    >
      {value}
    </Typography>
  </Card>
);

/* ================= ICON MAPS ================= */

const animalIcons = {
  Cow: cowIcon,
  Buffalo: buffaloIcon
};

const breedingIcons = {
  Open: openIcon,
  Insemination: inseminationIcon,
  Pregnant: pregnancyIcon,
  Dry: dryIcon,
  Fresh: freshIcon
};

const lifeCycleIcons = {
  mother: motherIcon,
  calf: calfIcon,
  heifer: heiferIcon,
  bull: bullIcon
};

/* ================= MAIN COMPONENT ================= */

const Counts = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [counts, setCounts] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const params = {};
      if (isEmployee) params.farm_id = user.farm_id;

      const res = await getCountsByAnimal(params);
      setCounts(res.data.counts);

      showSnackbar("Counts loaded", "success");
    } catch (err) {
      showSnackbar("Failed to load counts", "error");
    }
  };

  if (!counts) return null;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "#f5f7fb",
        minHeight: "100vh"
      }}
    >
      {/* PAGE TITLE */}
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 700,
          color: "#1a1f36",
          mb: 4
        }}
      >
        Dashboard
      </Typography>

      {/* ================= ANIMAL TYPE ================= */}
      <Box mb={5}>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1f36",
            mb: 2.5
          }}
        >
          Animal Type
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(counts.animal_type).map(([k, v]) => (
            <Grid item xs={6} md={3} key={k}>
              <StatCard
                icon={animalIcons[k]}
                label={k}
                value={v}
                onClick={() => {
                  if (k === "Cow") navigate(`/cowreports?type=${k}`);
                  else if (k === "Buffalo")
                    navigate(`/buffaloreports?type=${k}`);
                  else navigate(`/animalreports?type=${k}`);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= BREEDING ================= */}
      <Box mb={5}>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1f36",
            mb: 2.5
          }}
        >
          Breeding Report
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(counts.breeding_status).map(([k, v]) => (
            <Grid item xs={6} md={3} key={k}>
              <StatCard
                icon={breedingIcons[k]}
                label={k}
                value={v}
                onClick={() =>
                  navigate(`/opencount?breeding_status=${k}&total=${v}`)
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ================= LIFECYCLE ================= */}
      <Box>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            color: "#1a1f36",
            mb: 2.5
          }}
        >
          Cattle Report
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(counts.lifecycle).map(([k, v]) => (
            <Grid item xs={6} md={3} key={k}>
              <StatCard
                icon={lifeCycleIcons[k]}
                label={k}
                value={v}
                onClick={() => navigate(`/cattlecount?lifecycle=${k}`)}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Counts;
