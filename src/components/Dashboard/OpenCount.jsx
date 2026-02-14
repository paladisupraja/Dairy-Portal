import React, { useEffect, useState } from "react";
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

const OpenCount = () => {
  const [params] = useSearchParams();
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const breeding_status = params.get("breeding_status");
  const animal_type = params.get("type");

  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user?.role === "employee";

  useEffect(() => {
    if (!breeding_status) return;

    const fetchAnimals = async () => {
      try {
        const query = { breeding_status };

        if (isEmployee) query.farm_id = user.farm_id;

        const res = await getAnimalsByType(query);
        let details = res.data.details || [];

        if (animal_type) {
          details = details.filter(
            item => item.animal_type === animal_type
          );
        }

        setList(details);
        setTotalCount(details.length);
      } catch (err) {
        console.error("Failed to fetch animals:", err);
      }
    };

    fetchAnimals();
  }, [breeding_status, animal_type]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >
      {/* HEADER */}
      <Box mb={4}>
        <Typography
          sx={{
            fontSize: 28,
            fontWeight: 700,
            color: "#101828"
          }}
        >
          Breeding Status — {breeding_status}
        </Typography>

        <Typography
          sx={{
            color: "#667085",
            mt: 1
          }}
        >
          {animal_type ? `Animal Type: ${animal_type} | ` : ""}
          Total Count: {totalCount}
        </Typography>
      </Box>

      {/* TABLE */}
      <Paper
        sx={{
          borderRadius: 3,
          border: "1px solid #eef2f6",
          overflow: "hidden"
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "#f2f4f7" }}>
                <TableCell><b>Tag No</b></TableCell>
                <TableCell><b>Animal</b></TableCell>
                <TableCell><b>Gender</b></TableCell>
                <TableCell><b>Lifecycle</b></TableCell>
                <TableCell><b>Milking</b></TableCell>
                <TableCell><b>Lactation</b></TableCell>
                <TableCell><b>Breed</b></TableCell>
                <TableCell><b>DOB</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {list.map(item => (
                <TableRow
                  key={item.animal_id}
                  hover
                  sx={{
                    "&:hover": {
                      background: "#f9fafb"
                    }
                  }}
                >
                  <TableCell>{item.tag_no}</TableCell>
                  <TableCell>{item.animal_type}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.lifecycle}</TableCell>
                  <TableCell>{item.milking_status || "-"}</TableCell>
                  <TableCell>{item.lactation_no || "-"}</TableCell>
                  <TableCell>{item.breed_type || "-"}</TableCell>
                  <TableCell>{item.dob || "-"}</TableCell>
                </TableRow>
              ))}

              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No Records Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OpenCount;
