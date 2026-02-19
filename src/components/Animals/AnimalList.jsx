import React, { useState, useEffect } from "react";
import { getAllAnimals } from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
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
  Button,
  IconButton,
} from "@mui/material";

const AnimalList = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
   const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user.role === "employee";


  useEffect(() => {
    fetchAnimals();
  }, []);

  // const fetchAnimals = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await getAllAnimals();
  //     if (res.data.status === "success") {
  //       setAnimals(res.data.data);
  //       showSnackbar("Animals fetched successfully", "success");
  //     } else {
  //       showSnackbar("Failed to fetch animals", "error");
  //     }
  //   } catch (error) {
  //     showSnackbar("Failed to fetch animals", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const fetchAnimals = async () => {
  setLoading(true);
  try {
    let params = {};

    if (isEmployee) {
      params.farm_id = user.farm_id; // Filter only this employee's farm animals
    }

    const res = await getAllAnimals(params);

    if (res.data.status === "success") {
      setAnimals(res.data.data);
      showSnackbar("Animals fetched successfully", "success");
    } else {
      showSnackbar("Failed to fetch animals", "error");
    }
  } catch (error) {
    console.error(error);
    showSnackbar("Failed to fetch animals", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <Box p={0}>
      <Card>
        <CardContent>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Animal List</Typography>
            {/* <Button
              variant="contained"
              onClick={() => navigate("/animals/add")}
            >
              Add Animal
            </Button> */}
            <Button
  variant="contained"
   sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}
  onClick={() =>
    navigate("/animals/add", {
      state: isEmployee ? { farm_id: user.farm_id } : {},
    })
  }
>
  Add Animal
</Button>

          </Box>

          {/* Loader / Table */}
          {loading ? (
            <Box display="flex" justifyContent="center" mt={4}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Animal ID</TableCell>
                  <TableCell>Tag No</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>DOB</TableCell>
                  <TableCell>Breeding Status</TableCell>
                  <TableCell>Milking Status</TableCell>
                  <TableCell>Lifecycle</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {animals.map((animal) => (
                  <TableRow key={animal.animal_id}>
                    <TableCell>{animal.animal_id}</TableCell>
                    <TableCell>{animal.tag_no}</TableCell>
                    <TableCell>{animal.animal_type}</TableCell>
                    <TableCell>{animal.gender}</TableCell>
                    <TableCell>{animal.dob}</TableCell>
                    <TableCell>{animal.breeding_status ?? "-"}</TableCell>
                    <TableCell>{animal.milking_status ?? "-"}</TableCell>
                    <TableCell>{animal.lifecycle}</TableCell>
                    <TableCell align="center">
                       <IconButton
                         sx={{
   color: "rgb(42, 8, 11)"// Correct way to style MUI Button
   
  }}
                        onClick={() =>
  navigate(`/animals/edit/${animal.tag_no}`, {
    state: { animalId: animal.animal_id }, // ✅ send animalId here
  })
}

                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnimalList;
