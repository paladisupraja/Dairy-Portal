import React, { useState,useContext } from "react";
import { Box, CssBaseline, AppBar, Toolbar, IconButton, Button,Typography,Badge ,Dialog,DialogTitle,DialogContent,DialogContentText,DialogActions} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../context/NotificationContext";

import SideNav from "./SideNav";
import { Outlet } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "../index.css";



const Layout = () => {
  const { setNotifications } = useContext(NotificationContext);
  const [open, setOpen] = useState(true); // Start as open
  const[logoutDialog,setLogoutDialog]=useState(false);
  const drawerWidth = 280;
  const collapsedWidth = 60;
  const navigate = useNavigate();


  const toggleDrawer = () => setOpen(!open);
  const { unreadCount } = useContext(NotificationContext);


  const handleLogoutClick=()=>{
    setLogoutDialog(true);
  }
  const handleCloseDialog=()=>{
    setLogoutDialog(false);
  }
   
  
   const confirmLogout = () => {
    setNotifications([]);
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        className="bg-color"
        sx={{
         
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
  <IconButton color="inherit" onClick={() => navigate("/notifications")}>
  <Badge
  badgeContent={unreadCount}
  color="error"
  max={Number.MAX_SAFE_INTEGER} // any reasonable huge number
  invisible={unreadCount === 0}
>
  <NotificationsIcon />
</Badge>

</IconButton>
 <IconButton color="inherit" onClick={handleLogoutClick}>
            <LogoutIcon />
          </IconButton>


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
       {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "10px"
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
  sx={{
    backgroundColor: "#fff",
    color: "rgb(30, 5, 5)",
    borderColor: "rgb(30, 5, 5)",
    "&:hover": {
      backgroundColor: "#f0f0f0",
      borderColor: "rgb(30, 5, 5)"
    }
  }}          >
            Cancel
          </Button>

          <Button
            onClick={confirmLogout}
            variant="contained"
            color="error"
            sx={{backgroundColor: "rgb(42, 8, 11)", "&:hover": { backgroundColor: "rgb(30, 5, 5)" }}}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    
    </Box>
  );
};

export default Layout;
