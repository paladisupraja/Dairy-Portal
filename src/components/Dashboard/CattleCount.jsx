import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer
} from "@mui/material";

import { getAnimalsByType } from "../../services";

const CattleCount = () => {
  const [params] = useSearchParams();
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const lifecycle = params.get("lifecycle");
  const animal_type = params.get("type");

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  useEffect(() => {
    if (!lifecycle) return;

    const fetchAnimals = async () => {
      try {
        const query = { lifecycle };

        if (isEmployee) query.farm_id = user.farm_id;

        const res = await getAnimalsByType(query);
        const details = res.data.details || [];

        const filtered = animal_type
          ? details.filter(i => i.animal_type === animal_type)
          : details;

        setList(filtered);
        setTotalCount(filtered.length);
      } catch (err) {
        console.error("Failed to load animals", err);
      }
    };

    fetchAnimals();
  }, [lifecycle, animal_type]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, minHeight: "100vh" }}>
      
      {/* ===== Header ===== */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={600} style={{paddingBottom:"3px"}}>
          Cattle Report
        </Typography>

        <Typography color="text.secondary">
          Lifecycle: <b>{lifecycle}</b> | Animal: <b>{animal_type || "All"}</b> | Total: <b>{totalCount}</b>
        </Typography>
      </Box>

      {/* ===== Table ===== */}
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">

          <TableHead sx={{ background: "#eef1f5" }}>
            <TableRow>
              <TableCell><b>Tag No</b></TableCell>
              <TableCell><b>Animal</b></TableCell>
              <TableCell><b>Gender</b></TableCell>
              <TableCell><b>Breeding Status</b></TableCell>
              <TableCell><b>Breeding Type</b></TableCell>
              <TableCell><b>Lifecycle</b></TableCell>
              <TableCell><b>Milking Status</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {list.map(item => (
              <TableRow
                key={item.animal_id}
                sx={{
                  "&:hover": { background: "#f9fafc" }
                }}
              >
                <TableCell>{item.tag_no ||"-"}</TableCell>
                <TableCell>{item.animal_type||"-"}</TableCell>
                <TableCell>{item.gender||"-"}</TableCell>
                <TableCell>{item.breeding_status||"-"}</TableCell>
                <TableCell>{item.breed_type||"-"}</TableCell>
                <TableCell>{item.lifecycle||"-"}</TableCell>
                <TableCell>{item.milking_status ||"-"}</TableCell>
              </TableRow>
            ))}

            {list.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No Data Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>

        </Table>
      </TableContainer>

    </Box>
  );
};

export default CattleCount;
