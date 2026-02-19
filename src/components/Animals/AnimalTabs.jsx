import React, { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";

import BreedingTab from "./Breeding/BreedingTab";
import HealthTab from "./HealthTab";
import MilkingTab from "./Milking/MilkingTab";
import TimeLine from "./Timeline/TimeLine";
import CalfTags from "./Calf/CalfTags";

const AnimalTabs = ({ tagNo, animalId }) => { // ✅ get animalId from props
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable"
                
                scrollButtons="auto"
                
                allowScrollButtonsMobile
                sx={{
                  minHeight: 40,
                  px: 2,
                  "& .MuiTabs-flexContainer": {
                    gap: 3,
                  },
                  "& .MuiTab-root": {
                    textTransform: "uppercase",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#6f6f6f",
                    padding: "12px 0",
                    minWidth: "auto",
                  },
                  
                   "& .MuiTab-root.Mui-selected": {
              color: "rgb(42,8,11)",
              fontWeight: 600,
            },
                }}
                TabIndicatorProps={{
                  sx: {
                    backgroundColor: "rgb(42,8,11)",
                    height: "3px",
                  },
                }}>
        <Tab label="Breeding" />
        <Tab label="Health" />
        <Tab label="Milking Performance" />
        <Tab label="Timeline" />
        <Tab label="Calf Tags"/>
      </Tabs>

      <Box mt={2}>
        {tab === 0 && <BreedingTab tagNo={tagNo} />}
        {tab === 1 && <HealthTab tagNo={tagNo} animalId={animalId} />} {/* ✅ pass animalId */}
        {tab === 2 && <MilkingTab />}
        {tab === 3 && <TimeLine />}
        {tab === 4 && <CalfTags tagNo={tagNo}/>}
      </Box>
    </Box>
  );
};

export default AnimalTabs;
