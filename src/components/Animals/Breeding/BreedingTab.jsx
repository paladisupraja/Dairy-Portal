import React from "react";
import { Box } from "@mui/material";
import { Outlet, PrefetchPageLinks } from "react-router-dom";
import HeatList from "./Heat/HeatList";
import BreedingList from "./Heat/BreedingList";
import PregnancyList from "./Heat/PregnancyList";

const BreedingTab = () => {
  return (
    <Box>
      <HeatList/>
      <BreedingList />
      <PregnancyList />
    </Box>
  );
};

export default BreedingTab;
