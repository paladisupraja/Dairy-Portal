import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";
import { getCountsByAnimal } from "../../services";
import { Box, Card, Typography, Grid } from "@mui/material";

/* ================= ICONS ================= */

import buffaloIcon from "../../assets/icons8-water-buffalo-48.png";
import openIcon from "../../assets/open.png";
import inseminationIcon from "../../assets/insemination.png";
import pregnancyIcon from "../../assets/pregnancy.png";
import motherIcon from "../../assets/mother.png";
import calfIcon from "../../assets/calf.png";
import heiferIcon from "../../assets/heifer.png";
import bullIcon from "../../assets/bull.png";
import dryIcon from "../../assets/dry.png";
import freshIcon from "../../assets/fresh.png";

/* ================= REUSABLE STAT CARD ================= */

const StatCard = ({ icon, label, value, onClick }) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: onClick ? "pointer" : "default",
      borderRadius: 3,
      border: "1px solid #edf0f5",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
      transition: "all 0.2s ease",
      textAlign: "center",
      p: 3,

      "&:hover": onClick
        ? {
            transform: "translateY(-3px)",
            boxShadow: "0 10px 22px rgba(0,0,0,0.08)"
          }
        : {}
    }}
  >
    {icon && (
      <Box
        component="img"
        src={icon}
        sx={{
          height: 42,
          mb: 1.5,
          opacity: 0.9
        }}
      />
    )}

    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 600,
        color: "#667085"
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontSize: 26,
        fontWeight: 700,
        color: "#101828",
        mt: 0.5
      }}
    >
      {value ?? 0}
    </Typography>
  </Card>
);

/* ================= ICON MAPS ================= */

const breedingIcons = {
  Open: openIcon,
  Insemination: inseminationIcon,
  Pregnant: pregnancyIcon,
  Fresh: freshIcon,
  Dry: dryIcon
};

const lifeCycleIcons = {
  mother: motherIcon,
  calf: calfIcon,
  heifer: heiferIcon,
  bull: bullIcon
};

/* ================= MAIN COMPONENT ================= */

const BuffaloReports = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [counts, setCounts] = useState(null);
  const [totalBuffalo, setTotalBuffalo] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const params = { animal_type: "Buffalo" };
      if (isEmployee) params.farm_id = user.farm_id;

      const res = await getCountsByAnimal(params);
      const data = res.data.counts;

      const total = Object.values(data.breeding_status || {}).reduce(
        (a, b) => a + b,
        0
      );

      setCounts(data);
      setTotalBuffalo(total);

      showSnackbar("Buffalo counts loaded", "success");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load counts", "error");
    }
  };

  if (!counts) return null;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >
      {/* PAGE TITLE */}
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 700,
          color: "#101828",
          mb: 4
        }}
      >
        Buffalo Dashboard
      </Typography>

      {/* TOTAL BUFFALO */}
      <Box mb={6}>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            mb: 3,
            color: "#344054"
          }}
        >
          Total Buffalos
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={6} md={3}>
            <StatCard
              icon={buffaloIcon}
              label="Total Buffalos"
              value={totalBuffalo}
            />
          </Grid>
        </Grid>
      </Box>

      {/* BREEDING REPORT */}
      <Box mb={6}>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            mb: 3,
            color: "#344054"
          }}
        >
          Breeding Report
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(counts.breeding_status || {}).map(([k, v]) => (
            <Grid item xs={6} md={3} key={k}>
              <StatCard
                icon={breedingIcons[k]}
                label={k}
                value={v}
                onClick={() =>
                  navigate(
                    `/opencount?breeding_status=${k}&total=${v}&type=Buffalo${
                      isEmployee ? `&farm_id=${user.farm_id}` : ""
                    }`
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* LIFECYCLE REPORT */}
      <Box>
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 600,
            mb: 3,
            color: "#344054"
          }}
        >
          Lifecycle Report
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(counts.lifecycle || {}).map(([k, v]) => (
            <Grid item xs={6} md={3} key={k}>
              <StatCard
                icon={lifeCycleIcons[k]}
                label={k}
                value={v}
                onClick={() =>
                  navigate(
                    `/cattlecount?lifecycle=${k}&total=${v}&type=Buffalo${
                      isEmployee ? `&farm_id=${user.farm_id}` : ""
                    }`
                  )
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default BuffaloReports;
