import React from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import PetsIcon from "@mui/icons-material/Pets";
import GroupsIcon from "@mui/icons-material/Groups";
import ForestIcon from "@mui/icons-material/Forest";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GrassIcon from "@mui/icons-material/Grass";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { useNavigate, useLocation } from "react-router-dom";
import "../index.css"

const drawerWidth = 280;
const collapsedWidth = 60;

const allMenuItems = [
  { 
  text: "Dashboard", 
  icon: <DashboardIcon />, 
  path: "/counts", 
  highlightPaths: ["/counts"] 
},
  { text: "Employees", icon: <PersonIcon />, path: "/employees", highlightPaths: ["/employees", "/add-employee", "/update-employee"] },
  { text: "Animals", icon: <PetsIcon />, path: "/animals", highlightPaths: ["/animals", "/add-animal", "/update-animal","/edit-animal-form"] },
  { text: "Grouping", icon: <GroupsIcon />, path: "/grouping", highlightPaths: ["/grouping"] },
  { text: "Pastures", icon: <ForestIcon />, path: "/pastures", highlightPaths: ["/pastures"] },
  { text: "Milk Records", icon: <ReceiptIcon />, path: "/milking", highlightPaths: ["/milking", "/add-milk"] },
  { text: "Milk Reports", icon: <BarChartIcon />, path: "/milkreports", highlightPaths: ["/milkreports"] },
  { text: "All Dropdowns", icon: <NotificationsIcon />, path: "/alldropdowns", highlightPaths: ["/alldropdowns"] },
  { text: "Fodder Management", icon: <GrassIcon />, path: "/fodder", highlightPaths: ["/fodder"] },
  { text: "Medicine Management", icon: <MedicalServicesIcon />, path: "/medicines", highlightPaths: ["/medicines"] },
];

const SideNav = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ✅ Safe values
  const role = user?.role || "";
  const userName = user?.user_name || "";

  // ✅ Role check
  const isEmployee = role === "employee";

  // Filter menu items based on role
  const menuItems = isEmployee
    ? allMenuItems.filter((item) =>
        ["Employees", "Animals", "Grouping", "Milk Records", "Milk Reports"].includes(item.text)
      )
    : allMenuItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "0.3s",
        },
      }}
    >
      {/* Header */}
      <Box
      className="bg-color"
        sx={{
          
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
        }}
      >
        {open ? (
         <Box>
            <Typography variant="h6">Dhenusya Farm</Typography>
           
          </Box>
        ) : (
          <Typography
            variant="h6"
            sx={{ writingMode: "vertical-rl", textAlign: "center" }}
          >
            D
          </Typography>
        )}
      </Box>
<Box sx={{ px: 2, py: 1 }}>
  <Typography variant="body2" sx={{ fontWeight: 600 }}>
    Name :
    <span style={{ fontWeight: 400, marginLeft: 6 }}>
      {userName} ({role})
    </span>
  </Typography>
</Box>

             
      {/* Menu */}
      <List>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={open ? "" : item.text} placement="right">
         <ListItemButton
  selected={item.highlightPaths.some(p => location.pathname.startsWith(p))}
  onClick={() => navigate(item.path)}
  sx={{
    justifyContent: open ? "initial" : "center",
    px: 2.5,
    // Custom selected background
    "&.Mui-selected": {
      bgcolor: "rgba(36, 8, 174, 0.15)", // light shade for selected
      "&:hover": {
        bgcolor: "rgba(36, 8, 174, 0.2)", // slightly darker on hover
      },
    },
    "&:hover": {
      bgcolor: item.highlightPaths.some(p =>
        location.pathname.startsWith(p)
      )
        ? "rgba(36, 8, 174, 0.15)" // keep hover darker for selected
        : "rgba(36, 8, 174, 0.15)", // default hover for unselected
    },
  }}
>


              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "navy",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default SideNav;
