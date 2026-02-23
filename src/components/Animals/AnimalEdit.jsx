import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton
} from "@mui/material";

import { useParams, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import AnimalTabs from "./AnimalTabs";
import "../../index.css";

const AnimalEdit = () => {

  const { tagNo } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const animalId = location.state?.animalId;

  console.log("AnimalEdit animalId:", animalId);

  const handleBack = () => {
    navigate("/animals");
  };

  const handleEditClick = () => {

    if (!animalId) {
      alert("Animal Id Missing");
      return;
    }

    navigate("/edit-animal-form", {
      state: {
        animalId,
        tagNo
      }
    });
  };

  return (
    <Box p={3}>

      <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              className="color"
              sx={{
                textTransform: "none",
                fontWeight: 500,
               
              }}
            >
              Back
            </Button>

      <Card sx={{ mt: 2 }}>
        <CardContent sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>

          <Typography variant="h6">
            Edit Animal – Tag No: <b>{tagNo}</b>
          </Typography>

          <IconButton onClick={handleEditClick} className="color">
            <EditIcon />
          </IconButton>

        </CardContent>
      </Card>

      <Box mt={3}>
        <AnimalTabs tagNo={tagNo} animalId={animalId} />
      </Box>

    </Box>
  );
};


export default AnimalEdit;
