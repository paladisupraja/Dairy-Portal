import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PetsIcon from "@mui/icons-material/Pets";

import {
  getConsumptionReports,
  getFodderData,
  getLowStockFodder,
} from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import "../../index.css";

const Reports = () => {
  const { showSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("consumption");
  const [usageView, setUsageView] = useState("tag");
  const [report, setReport] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [reportRes, stockRes, lowStockRes] = await Promise.all([
        getConsumptionReports(),
        getFodderData(),
        getLowStockFodder(),
      ]);

      setReport(reportRes?.data || null);
      setStockData(stockRes?.data?.details || []);
      setLowStockData(lowStockRes?.data?.details || []);
    } catch {
      showSnackbar("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* ===== HEADER ===== */}
      <Typography variant="h5" fontWeight={600} mb={3}>
        Fodder Reports
      </Typography>

      {/* ===== SECTION BUTTONS ===== */}
      <Stack direction="row" spacing={2} mb={4}>
  {["consumption", "stock", "animalusage", "lowstock"].map((section) => {
    const isActive = activeSection === section;

    return (
      <Button
        key={section}
        variant={isActive ? "contained" : "outlined"}
        onClick={() => setActiveSection(section)}
        sx={{
          fontWeight: 600,
          backgroundColor: isActive ? "navy" : "transparent",
          color: isActive ? "#fff" : "navy",
          borderColor: "navy",
          "&:hover": {
            
            borderColor: "navy",
          },
        }}
      >
        {section === "consumption"
          ? "Consumption"
          : section === "stock"
          ? "Stock History"
          : section === "animalusage"
          ? "Animal Usage"
          : "Low Stock Alert"}
      </Button>
    );
  })}
</Stack>


      {/* ===== STOCK HISTORY ===== */}
      {activeSection === "stock" && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Stock History
            </Typography>
            <Paper variant="outlined" sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell sx={{ width: "20%" }}>Date</TableCell>
                    <TableCell sx={{ width: "20%" }}>Fodder</TableCell>
                    <TableCell sx={{ width: "20%" }}>Batch</TableCell>
                    <TableCell align="right">Initial</TableCell>
                    <TableCell align="right">Consumed</TableCell>
                    <TableCell align="right">Available</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockData.map((s) => (
                    <TableRow key={s.id} hover>
                      <TableCell>{new Date(s.date_added).toLocaleDateString()}</TableCell>
                      <TableCell>{s.fodder_type_name}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell align="right">{s.initial_quantity}</TableCell>
                      <TableCell align="right">{s.consumed_quantity}</TableCell>
                      <TableCell align="right">{s.quantity}</TableCell>
                      <TableCell align="center">
                        {s.quantity < s.min_stock ? (
                          <Chip label="Low" color="error" size="small" />
                        ) : (
                          <Chip label="OK" color="success" size="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </CardContent>
        </Card>
      )}

      {/* ===== CONSUMPTION ===== */}
      {activeSection === "consumption" && report && (
        <>
          <Stack direction="row" spacing={2} mb={3}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography color="text.secondary">Total Quantity</Typography>
                <Typography fontWeight={600}>
                  {report.total_quantity.toFixed(2)} Kg
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Typography color="text.secondary">Total Records</Typography>
                <Typography fontWeight={600}>{report.count_records}</Typography>
              </CardContent>
            </Card>
          </Stack>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography fontWeight={600} mb={1}>
                Consumption by Animal
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell align="right">Quantity (Kg)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.by_tag.map((row, i) => (
                    <TableRow key={i} hover>
                      <TableCell>{row.tag_no}</TableCell>
                      <TableCell align="right">{row.total_quantity.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Typography fontWeight={600} mb={1}>
            Date-wise Breakdown
          </Typography>
          {report.datewise.map((d, idx) => (
            <Accordion key={idx} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" justifyContent="space-between" width="100%">
                  <Typography>{d.date}</Typography>
                  <Typography fontWeight={600}>{d.total_quantity.toFixed(2)} Kg</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {d.by_tag.map((t, i) => (
                  <Box key={i} display="flex" justifyContent="space-between" py={0.5}>
                    <Typography>Tag {t.tag_no}</Typography>
                    <Typography>{t.total_quantity.toFixed(2)} Kg</Typography>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}

      {/* ===== ANIMAL USAGE ===== */}
      {activeSection === "animalusage" && report && (
        <>
          <Stack direction="row" spacing={2} mb={3}>
            <Card sx={{ flex: 1, bgcolor: "#E3F2FD" }}>
              <CardContent>
                <Typography>Total Consumption</Typography>
                <Typography fontWeight={600} color="primary">
                  {report.total_quantity.toFixed(2)} Kg
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1, bgcolor: "#E8F5E9" }}>
              <CardContent>
                <Typography>Total Records</Typography>
                <Typography fontWeight={600} color="success.main">
                  {report.count_records}
                </Typography>
              </CardContent>
            </Card>
          </Stack>

         <Box display="flex" mb={3} bgcolor="#f1f1f1" borderRadius={2} p={0.5}>
  {[
    { key: "tag", label: "By Animal" },
    { key: "date", label: "Date Wise" },
  ].map(({ key, label }) => {
    const isActive = usageView === key;

    return (
      <Button
        key={key}
        fullWidth
        variant={isActive ? "contained" : "text"}
        onClick={() => setUsageView(key)}
        sx={{
          backgroundColor: isActive ? "navy" : "transparent",
          color: isActive ? "#fff" : "navy",
          fontWeight: 600,
          borderRadius: 2,
          "&:hover": {
            
          },
        }}
      >
        {label}
      </Button>
    );
  })}
</Box>


          {usageView === "tag" && (
            <Stack spacing={2}>
              {report.by_tag.map((item, idx) => (
                <Card key={idx}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={2}>
                        <PetsIcon color="primary" />
                        <Typography fontWeight={600}>Tag {item.tag_no}</Typography>
                      </Box>
                      <Typography fontWeight={600} color="primary">
                        {item.total_quantity.toFixed(2)} Kg
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}

          {usageView === "date" &&
            report.datewise.map((d, idx) => (
              <Card key={idx} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography fontWeight={600}>{d.date}</Typography>
                  <Divider sx={{ my: 1 }} />
                  {d.by_tag.map((t, i) => (
                    <Box key={i} display="flex" justifyContent="space-between" py={0.5}>
                      <Typography>Tag {t.tag_no}</Typography>
                      <Typography>{t.total_quantity.toFixed(2)} Kg</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ))}
        </>
      )}

      {/* ===== LOW STOCK ===== */}
      {activeSection === "lowstock" && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography fontWeight={600} mb={2}>
              Low Stock Fodder
            </Typography>
            {lowStockData.length === 0 ? (
              <Typography>No low stock items. All good! ✅</Typography>
            ) : (
              <Paper variant="outlined" sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ width: "25%" }}>Fodder</TableCell>
                      <TableCell align="right" sx={{ width: "15%" }}>Total Qty</TableCell>
                      <TableCell align="right" sx={{ width: "15%" }}>Min Stock</TableCell>
                      <TableCell align="right" sx={{ width: "15%" }}>Threshold</TableCell>
                      <TableCell align="right" sx={{ width: "15%", color: "red", fontWeight: 600 }}>Deficit</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockData.map((item) => (
                      <TableRow key={item.fodder_type_id} hover>
                        <TableCell>{item.fodder_type}</TableCell>
                        <TableCell align="right">{item.total_quantity}</TableCell>
                        <TableCell align="right">{item.min_stock}</TableCell>
                        <TableCell align="right">{item.threshold_used}</TableCell>
                        <TableCell align="right" sx={{ color: "red", fontWeight: 600 }}>
                          {item.deficit}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Reports;
