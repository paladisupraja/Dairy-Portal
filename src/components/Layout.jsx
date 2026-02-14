import React, { useState,useContext } from "react";
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Typography,Badge } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";

import SideNav from "./SideNav";
import { Outlet } from "react-router-dom";


const Layout = () => {
  const [open, setOpen] = useState(true); // Start as open
  const drawerWidth = 280;
  const collapsedWidth = 60;
  const navigate = useNavigate();


  const toggleDrawer = () => setOpen(!open);
  const { unreadCount } = useContext(NotificationContext);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "rgb(42, 8, 11)",
          color: "#fff",
          width: `calc(100% - ${open ? drawerWidth : collapsedWidth}px)`,
          ml: `${open ? drawerWidth : collapsedWidth}px`,
          transition: "0.3s",
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
    My Dashboard
  </Typography>

  {/* 🔔 Notifications */}
  {/* <IconButton color="inherit" onClick={() => navigate("/notifications")}>
  <Badge
  badgeContent={unreadCount}
  color="error"
  max={Number.MAX_SAFE_INTEGER} // any reasonable huge number
  invisible={unreadCount === 0}
>
  <NotificationsIcon />
</Badge>

</IconButton> */}


        </Toolbar>
      </AppBar>

      {/* SideNav */}
      <SideNav open={open} toggleDrawer={toggleDrawer} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          transition: "0.3s",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
