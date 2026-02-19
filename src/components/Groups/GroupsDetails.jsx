import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignEmployeeDialog from "./AssignEmployeeDialog";


import { getGroupDetailsById } from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";
import AddAnimalDialog from "./AddAnimalDialog";

const GroupsDetails = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAddAnimal, setOpenAddAnimal] = useState(false);
  const [openAssignEmp, setOpenAssignEmp] = useState(false);

const handleBack=()=>{
  navigate("/grouping")
}
  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const res = await getGroupDetailsById(groupId);
      setGroup(res.data.details);
    } catch (err) {
      showSnackbar("Failed to load group details", "error");
    } finally {
      setLoading(false);
    }
  };

  
  if (loading) {
    return (
      <Box sx={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!group) {
    return (
      <Typography sx={{ p: 3 }} color="text.secondary">
        No group found
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 0, minHeight: "100vh" }}>
      
      {/* BACK BUTTON */}
      
         <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color: "#2A080B",
              }}
            >
              Back
            </Button>

      {/* GROUP HEADER */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* LEFT INFO */}
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {group.group_name}
              </Typography>

              <Stack direction="row" spacing={3} mt={1} flexWrap="wrap">
                <Typography variant="body2">
                  <b>Group ID:</b> {group.group_id}
                </Typography>
                <Typography variant="body2">
                  <b>Farm ID:</b> {group.farm_id}
                </Typography>
                <Typography variant="body2">
                  <b>Type:</b> {group.group_type}
                </Typography>
              </Stack>

              <Typography variant="body2" mt={1}>
                <b>Employee:</b> {group.employee_name || "Not Assigned"}
              </Typography>
            </Box>

            {/* RIGHT ACTIONS */}
            <Stack direction="row" spacing={2}>
  {/* Assign Employee Button */}
  <Button
    variant="outlined"
    startIcon={<PersonAddIcon />}
    onClick={() => setOpenAssignEmp(true)}
    sx={{
      color: "rgb(42,8,11)",
      borderColor: "rgb(42,8,11)",
      textTransform: "none",
      fontWeight: 500,
      borderRadius: "8px",
      "&:hover": {
        borderColor: "rgb(30,5,5)",
        backgroundColor: "rgba(42,8,11,0.08)",
      },
    }}
  >
    Assign Employee
  </Button>

  {/* Add Animal Button */}
  <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenAddAnimal(true)}
    sx={{
      backgroundColor: "rgb(42,8,11)",
      color: "#fff",
      textTransform: "none",
      fontWeight: 500,
      borderRadius: "8px",
      "&:hover": {
        backgroundColor: "rgb(30,5,5)",
      },
    }}
  >
    Add Animal
  </Button>
</Stack>

          </Box>
        </CardContent>
      </Card>

      {/* ANIMALS SECTION */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Animals
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {group.animals?.length === 0 ? (
            <Typography color="text.secondary">
              No animals found
            </Typography>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Tag No</b></TableCell>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell><b>Gender</b></TableCell>
                    <TableCell><b>Lactation</b></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {group.animals.map((animal) => (
                    <TableRow key={animal.id}>
                      <TableCell>{animal.tag_no}</TableCell>
                      <TableCell>{animal.name}</TableCell>
                      <TableCell>{animal.gender}</TableCell>
                      <TableCell>{animal.lactation_no}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* ADD ANIMAL DIALOG */}
       <AddAnimalDialog
        open={openAddAnimal}
        onClose={() => setOpenAddAnimal(false)}
        groupId={group.group_id}
        groupAnimals={group.animals}
        farmId={group.farm_id}  // ✅ pass farm_id
        onSuccess={fetchGroupDetails}
      />
      <AssignEmployeeDialog
  open={openAssignEmp}
  onClose={(refresh) => {
    setOpenAssignEmp(false);
    if (refresh) fetchGroupDetails();
  }}
  group={group}
/>

    </Box>
  );
};

export default GroupsDetails;
