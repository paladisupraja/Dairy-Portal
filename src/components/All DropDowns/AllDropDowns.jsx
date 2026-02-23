import React, { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";

import AnimalTypes from "./AnimalTypes/AnimalTypes";
import Gender from "./Gender/Gender";
import AnimalBreed from "./AnimalBreeding/AnimalBreed";
import BreedingTypes from "./BreedingTypes/BreedingTypes";
import AnimalLifecycle from "./AnimalLifecycles/AnimalLifecycle";
import JobRoles from "./JobRoles/JobRoles";
import GroupTypes from "./GroupTypes/GroupTypes";
import FodderTypes from "./FodderTypes/FodderTypes";
import Vendors from "./Vendors/Vendors";
import TimeSlots from "./TimeSlots/TimeSlots";
import Categories from "./Categories/Categories";
import Units from "./Units/Units";
import Vaccines from "./Vaccines/Vaccines";
import HeatScoreList from "./HeatScores/HeatScoreList";
import MedicineList from "./Medicines/MedicineList";
import PregnancyList from "./Pregnancy/PregnancyList";
import AnimalLists from "./AnimalLifecycles/AnimalLists";
import BreedingLifeCycle from "./BreedingTypes/BreedingLifeCycle";
import Schedulers from "./Notifications/Schedulers";

const AllDropDowns = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <Box sx={{ width: "100%", bgcolor: "#fff" }}>
      {/* ===== TABS BAR ===== */}
      <Box
        sx={{
          width: "900px",
          borderBottom: "1px solid #e0e0e0",
          overflowX: "auto",
          
        }}
      >
        <Tabs
          value={tabIndex}
          onChange={(e, v) => setTabIndex(v)}
          variant="scrollable"
          
          scrollButtons="auto"
          
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            px: 2,
            "& .MuiTabs-flexContainer": {
              gap: 3,
            },
            "& .MuiTab-root": {
              
              fontSize: "14px",
              fontWeight: 500,
              color: "#6f6f6f",
              padding: "12px 0",
              minWidth: "auto",
            },
           "& .MuiTab-root.Mui-selected": {
              color: "navy",
              fontWeight: 600,
            },
          }}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "navy",
              height: "3px",
            },
          }}
        >
          <Tab label="Animals" />
          <Tab label="Gender" />
          <Tab label="Animal Breeds" />
          <Tab label="Breeding Types" />
          <Tab label="Lifecycle" />
          <Tab label="Job Roles" />
          <Tab label="Groups" />
          <Tab label="Fodder Types" />
          <Tab label="Vendors" />
          <Tab label="Time Slots" />
          <Tab label="Category List" />
          <Tab label="Unit Lists"/>
          <Tab label="Vaccine Lists"/>
          <Tab label="Score Lists"/>
          <Tab label="Medicine Lists"/>
          <Tab label = "Pregnancy Lists"/>
          <Tab label="Animal LifeCycle"/>
          <Tab label="Breeding LifeCycle"/>
          <Tab label="Notifications"/>
        </Tabs>
      </Box>

      {/* ===== TAB CONTENT ===== */}
      <Box sx={{ px: 3, py: 2 }}>
        {tabIndex === 0  && <AnimalTypes /> }
        {tabIndex === 1 && <Gender />}
        {tabIndex === 2 && <AnimalBreed />}
        {tabIndex === 3 && <BreedingTypes />}
        {tabIndex === 4 && <AnimalLifecycle />}
        {tabIndex === 5 && <JobRoles />}
        {tabIndex === 6 && <GroupTypes />}
        {tabIndex === 7 && <FodderTypes />}
        {tabIndex === 8 && <Vendors />}
        {tabIndex === 9 && <TimeSlots />}
        {tabIndex===10 && <Categories/>}
        {tabIndex ===11 && <Units />}
        {tabIndex===12 && <Vaccines />}
        {tabIndex===13 && <HeatScoreList/>}
        {tabIndex===14 && <MedicineList/>}
        {tabIndex===15 && <PregnancyList/>}
        {tabIndex===16 && <AnimalLists/>}
        {tabIndex===17 && <BreedingLifeCycle/>}
        {tabIndex===18 && <Schedulers/>}
      </Box>
    </Box>
  );
};

export default AllDropDowns;
