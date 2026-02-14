import React, { useState } from "react";
import { Login } from "../services";
import { useSnackbar } from "../context/SnackbarContext";
import { Link, useNavigate } from "react-router-dom";

import { Box, Card, CardContent, TextField, Button, Typography } from "@mui/material";

const UserLogin = () => {
  const [mobile_num, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const payload = { mobile_num, password };

    try {
      const response = await Login(payload);

      if (response.data.statusCode !== 200) {
        showSnackbar(response.data.message, "error");
      } else {
        showSnackbar(response.data.message, "success");

        // Save user & token to localStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);

        setMobileNumber("");
        setPassword("");
        navigate("/counts");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, "error");
      } else {
        showSnackbar("Server error", "error");
      }
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f6f8">
      <Card sx={{ width: 380, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" align="center" mb={2}>Login</Typography>

          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            margin="normal"
            value={mobile_num}
            onChange={(e) => setMobileNumber(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
            Login
          </Button>

          <Typography align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserLogin;
