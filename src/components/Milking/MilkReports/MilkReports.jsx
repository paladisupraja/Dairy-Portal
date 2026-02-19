import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Stack,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { getGroups, getMilkingReportByGroup } from "../../../services";

/* ---------- Helpers ---------- */

const formatFullDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

const getAllDatesBetween = (start, end) => {
  const dates = [];
  let current = new Date(start);
  const last = new Date(end);

  while (current <= last) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates.reverse();
};

const getDailyTotals = (animals, dates) => {
  return dates.map((date) => {
    let totalAM = 0;
    let totalPM = 0;

    animals.forEach((animal) => {
      const record = animal.records?.find((r) => r.date === date);
      if (record) {
        totalAM += record.am_quantity || 0;
        totalPM += record.pm_quantity || 0;
      }
    });

    return { date, totalAM, totalPM };
  });
};

const calculateAnimalTotal = (animal) =>
  animal.records?.reduce(
    (sum, r) => sum + (r.am_quantity || 0) + (r.pm_quantity || 0),
    0
  ) || 0;

const calculateGroupTotal = (animals) =>
  animals.reduce(
    (sum, animal) =>
      sum +
      (animal.records?.reduce(
        (recSum, r) => recSum + (r.am_quantity || 0) + (r.pm_quantity || 0),
        0
      ) || 0),
    0
  );

/* ---------- Component ---------- */

const MilkReports = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";
  const farmId = user?.farm_id;

  const today = new Date();
  const weekAgo = new Date();
  weekAgo.setDate(today.getDate() - 6);

  const [startDate, setStartDate] = useState(
    weekAgo.toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(today.toISOString().split("T")[0]);

  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState({});
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  /* ---------- Fetch Groups ---------- */

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await getGroups();
        let allGroups = res.data?.details || [];

        if (isEmployee && farmId) {
          allGroups = allGroups.filter((g) => g.farm_id === farmId);
        }

        setGroups(allGroups);
      } catch (err) {
        console.error(err);
        setGroups([]);
      }
    };

    fetchGroups();
  }, [isEmployee, farmId]);

  /* ---------- Fetch Reports ---------- */

  useEffect(() => {
    if (!groups.length) {
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          groups.map(async (group) => {
            try {
              const res = await getMilkingReportByGroup(
                group.group_id,
                startDate,
                endDate
              );
              return { id: group.group_id, data: res.data?.details || null };
            } catch {
              return { id: group.group_id, data: null };
            }
          })
        );

        const mapped = {};
        results.forEach((r) => (mapped[r.id] = r.data));
        setGroupData(mapped);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [groups, startDate, endDate]);

  const allDates = useMemo(
    () => getAllDatesBetween(startDate, endDate),
    [startDate, endDate]
  );

  /* ---------- UI ---------- */

  return (
    <Box p={0} sx={{ minHeight: "100vh" }}>
      <Typography variant="h6" fontWeight={700} mb={3}>
        🥛 Milk Reports
      </Typography>

      {/* Date Filter */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <CalendarMonthIcon color="primary" />

          <Box>
            <Typography fontSize={12}>Start Date</Typography>
            <input
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Box>

          <Box>
            <Typography fontSize={12}>End Date</Typography>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Box>
        </Stack>
      </Paper>

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : groups.some((g) => groupData[g.group_id]?.animals?.length) ? (
        groups.map((group) => {
          const data = groupData[group.group_id];
          if (!data?.animals?.length) return null;

          const dailyTotals = getDailyTotals(data.animals, allDates);
          const total = calculateGroupTotal(data.animals);

          return (
            <Accordion key={group.group_id} sx={{ mb: 2, borderRadius: 2 }}>
              <AccordionSummary sx={{color:"rgb(42,8,11)"}} expandIcon={<ExpandMoreIcon /> }>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                >
                  <Typography fontWeight={700}>
                    {group.group_name}
                  </Typography>

                  <Stack direction="row" spacing={3} alignItems="center">
                    <Typography
                      sx={{
                      
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 600
                      }}
                    >
                      Total : {total} L
                    </Typography>

                    <Box
  sx={{
    cursor: "pointer",
    display: "flex",
    alignItems: "center"
  }}
  onClick={(e) => {
    e.stopPropagation();
    setSelectedGroup({ group, data });
    setOpenDialog(true);
  }}
>
  <VisibilityIcon sx={{ color: "rgb(42,8,11)" }} />
</Box>

                  </Stack>
                </Box>
              </AccordionSummary>

              {/* Table Inside Accordion */}
              <Box px={2} pb={2}>
                <Paper sx={{  borderRadius: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: "#f8fafc" }}>
                        <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                        <TableCell align="right">AM (L)</TableCell>
                        <TableCell align="right">PM (L)</TableCell>
                        <TableCell align="right">Total (L)</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {dailyTotals.map((d) => (
                        <TableRow key={d.date} hover>
                          <TableCell>{formatFullDate(d.date)}</TableCell>
                          <TableCell align="right">{d.totalAM}</TableCell>
                          <TableCell align="right">{d.totalPM}</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>
                            {d.totalAM + d.totalPM}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Grand Total */}
                      <TableRow sx={{ background: "#f1f5f9" }}>
                        <TableCell sx={{ fontWeight: 700 }}>
                          Grand Total
                        </TableCell>
                        <TableCell align="right">
                          {dailyTotals.reduce((s, d) => s + d.totalAM, 0)}
                        </TableCell>
                        <TableCell align="right">
                          {dailyTotals.reduce((s, d) => s + d.totalPM, 0)}
                        </TableCell>
                        <TableCell align="right">
                          {dailyTotals.reduce(
                            (s, d) => s + d.totalAM + d.totalPM,
                            0
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            </Accordion>
          );
        })
      ) : (
        <Typography>No reports available</Typography>
      )}

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          {selectedGroup?.group.group_name} Detailed Report
        </DialogTitle>
        <DialogContent>
          {selectedGroup && (
            <Paper sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    {selectedGroup.data.animals.map((a) => (
                      <TableCell key={a.tag_no}>{a.tag_no}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
<TableBody>
  {allDates.map((date) => (
    <TableRow key={date}>
      <TableCell>{formatFullDate(date)}</TableCell>

      {selectedGroup.data.animals.map((animal) => {
        const record =
          animal.records?.find((r) => r.date === date) || {};

        const total =
          (record.am_quantity || 0) +
          (record.pm_quantity || 0);

        return (
          <TableCell key={animal.tag_no}>
            {total}
          </TableCell>
        );
      })}
    </TableRow>
  ))}

  {/* ✅ TOTAL ROW */}
  <TableRow sx={{ background: "#f1f5f9" }}>
    <TableCell sx={{ fontWeight: 700 }}>
      TOTAL
    </TableCell>

    {selectedGroup.data.animals.map((animal) => (
      <TableCell key={animal.tag_no} sx={{ fontWeight: 700 }}>
        {calculateAnimalTotal(animal)}
      </TableCell>
    ))}
  </TableRow>
</TableBody>

              </Table>
            </Paper>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MilkReports;
