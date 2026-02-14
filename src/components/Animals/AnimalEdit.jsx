import React from "react";
import { Box, Card, CardContent, Typography ,Button} from "@mui/material";
import { useParams, useLocation,useNavigate } from "react-router-dom";
import AnimalTabs from "./AnimalTabs";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";


const AnimalEdit = () => {
  const { tagNo } = useParams();
  const location = useLocation();
  const navigate = useNavigate(); // ✅ FIX ADDED HERE

  const handleBack = () => {
    navigate("/animals");
  };
  // ✅ get animalId from navigation state
  const animalId = location.state?.animalId;

  return (
    <Box p={3}>
      
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
      <Card>
        <CardContent>
          
          <Typography variant="h6">
            Edit Animal – Tag No: <b>{tagNo}</b>
          </Typography>
        </CardContent>
      </Card>

      <Box mt={3}>
        {/* ✅ pass both tagNo and animalId */}
        <AnimalTabs tagNo={tagNo} animalId={animalId} />
      </Box>
    </Box>
  );
};

export default AnimalEdit;
