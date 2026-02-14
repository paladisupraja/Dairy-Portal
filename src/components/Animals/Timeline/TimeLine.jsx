import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
} from "@mui/material";

import {
  getBreedingRecordsByAnimalTag,
  getAllPregnancyRecords,
  getHeatRecordsByAnimalTag,
  getVaccinesByAnimalId,
  getConsumption, // medicine API
} from "../../../services";

const TimeLine = () => {
  const { tagNo } = useParams();

  const [loading, setLoading] = useState(false);
  const [heat, setHeat] = useState([]);
  const [breeding, setBreeding] = useState([]);
  const [pregnancy, setPregnancy] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [vaccine, setVaccine] = useState([]);

  useEffect(() => {
    if (!tagNo) return;

  const fetchData = async () => {
  setLoading(true);
  try {
    const [h, b, p, m, v] = await Promise.all([
      getHeatRecordsByAnimalTag(tagNo).catch(() => ({ data: { details: [] } })),
      getBreedingRecordsByAnimalTag(tagNo).catch(() => ({ data: { details: [] } })),
      getAllPregnancyRecords(tagNo).catch(() => ({ data: { details: [] } })),
      getConsumption(tagNo).catch(() => ({ data: { details: [] } })),
      getVaccinesByAnimalId(tagNo).catch(() => ({ data: { details: [] } })),
    ]);

    setHeat(h.data.details);
    setBreeding(b.data.details);
    setPregnancy(p.data.details);
    setMedicine(m.data.details);
    setVaccine(v.data.details);
  } catch (err) {
    console.error("Failed to fetch timeline data:", err);
  } finally {
    setLoading(false);
  }
};

    fetchData();
  }, [tagNo]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Animal Timeline – Tag No: {tagNo}
        </Typography>

        {/* 🔴 HEAT */}
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Heat Records
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Observed By</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {heat.length ? heat.map((h) => (
              <TableRow key={h.id}>
                <TableCell>{h.heat_date?.split("T")[0]}</TableCell>
                <TableCell>{h.heat_time}</TableCell>
                <TableCell>{h.observed_by || "-"}</TableCell>
                <TableCell>{h.score}</TableCell>
                <TableCell>{h.heat_status || "-"}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No heat records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* 🟡 BREEDING */}
        <Typography variant="subtitle1">Breeding Records</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Note</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breeding.length ? breeding.map((b) => (
              <TableRow key={b.breeding_id}>
                <TableCell>{b.breeding_date?.split("T")[0]}</TableCell>
                <TableCell>{b.breeding_type}</TableCell>
                <TableCell>{b.breeding_status}</TableCell>
                <TableCell>{b.note || "-"}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
  <TableCell colSpan={4} align="center">
    {breeding.length === 0 ? "No breeding records or failed to fetch" : null}
  </TableCell>
</TableRow>

            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* 🟢 PREGNANCY */}
        <Typography variant="subtitle1">Pregnancy Records</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Check Date</TableCell>
              <TableCell>Method</TableCell>
              <TableCell>Result</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pregnancy.length ? pregnancy.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.check_date?.split("T")[0]}</TableCell>
                <TableCell>{p.identification_method}</TableCell>
                <TableCell>{p.diagnostic_result || "-"}</TableCell>
                <TableCell>{p.pregnancy_status}</TableCell>
                <TableCell>{p.comments || "-"}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No pregnancy records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* 💊 HEALTH – MEDICINE */}
        <Typography variant="subtitle1">Health – Medicines</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Medicine ID</TableCell>
              <TableCell>Dosage</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Supervised By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicine.length ? medicine.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.administered_at?.split("T")[0]}</TableCell>
                <TableCell>{m.medicine_id}</TableCell>
                <TableCell>{m.dosage}</TableCell>
                <TableCell>{m.duration}</TableCell>
                <TableCell>{m.supervised_by}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No medicine records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* 💉 HEALTH – VACCINE */}
        <Typography variant="subtitle1">Health – Vaccines</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Vaccine Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Dosage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccine.length ? vaccine.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.vaccine_date?.split("T")[0]}</TableCell>
                <TableCell>{v.vaccine_name}</TableCell>
                <TableCell>{v.vaccine_type}</TableCell>
                <TableCell>{v.dosage}</TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No vaccine records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TimeLine;
