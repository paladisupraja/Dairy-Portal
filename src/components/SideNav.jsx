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

import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 280;
const collapsedWidth = 60;

const allMenuItems = [
  { text: "Employees", icon: <PersonIcon />, path: "/employees" },
  { text: "Animals", icon: <PetsIcon />, path: "/animals" },
  { text: "Grouping", icon: <GroupsIcon />, path: "/grouping" },
  { text: "Pastures", icon: <ForestIcon />, path: "/pastures" },
  { text: "Milk Records", icon: <ReceiptIcon />, path: "/milking" },
  { text: "Milk Reports", icon: <BarChartIcon />, path: "/milkreports" },
  { text: "All Dropdowns", icon: <NotificationsIcon />, path: "/alldropdowns" },
  { text: "Fodder Management", icon: <GrassIcon />, path: "/fodder" },
  { text: "Medicine Management", icon: <MedicalServicesIcon />, path: "/medicines" },
];

const SideNav = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get user role from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user.role === "employee";

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
        sx={{
          bgcolor: "rgb(42, 8, 11)",
          color: "#fff",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
        }}
      >
        {open ? (
          <Typography variant="h6">Dhenusya Farm</Typography>
        ) : (
          <Typography
            variant="h6"
            sx={{ writingMode: "vertical-rl", textAlign: "center" }}
          >
            D
          </Typography>
        )}
      </Box>

      {/* Menu */}
      <List>
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={open ? "" : item.text} placement="right">
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={{
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color: "rgb(42, 8, 11)",
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
