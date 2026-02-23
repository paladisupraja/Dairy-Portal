import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import { getMilkingDataByAnimalTagNo } from "../../../services";
import "../../../index.css";

const MilkingTab = () => {
  const { tagNo } = useParams(); // get tagNo from URL
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState("2026-01-15");
  const [endDate, setEndDate] = useState("2026-01-22");

  const fetchMilkingData = async () => {
    if (!tagNo) return;
    setLoading(true);
    try {
      const res = await getMilkingDataByAnimalTagNo(tagNo, startDate, endDate);
      setRecords(res.data.details || []);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch milking records");
    } finally {
      setLoading(false);
    }
  };

  // Optional: fetch automatically when tagNo changes
  useEffect(() => {
    fetchMilkingData();
  }, [tagNo]);

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Milking Data for Tag: {tagNo}</Typography>

        {/* Date selectors */}
        <Box display="flex" gap={2} mt={2} mb={2}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Button variant="contained" onClick={fetchMilkingData} className="bg-color">
            Fetch
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Animal Tag</TableCell>
                <TableCell>Animal Type</TableCell>
                <TableCell>Lactation No</TableCell>
                <TableCell>AM Quantity</TableCell>
                <TableCell>PM Quantity</TableCell>
                <TableCell>Colostrum Milk</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length ? (
                records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.animal_tag_no}</TableCell>
                    <TableCell>{r.animal_type}</TableCell>
                    <TableCell>{r.lactation_no}</TableCell>
                    <TableCell>{r.am_quantity}</TableCell>
                    <TableCell>{r.pm_quantity}</TableCell>
                    <TableCell>{r.colostrum_milk ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No milking records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default MilkingTab;
