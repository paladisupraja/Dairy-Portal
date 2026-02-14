import React, {useState} from 'react';
import { registerUser} from '../services';
import { useSnackbar } from '../context/SnackbarContext';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const UserSignup=()=>{
    const[user_name,setUserName]=useState('');
    const[mobile_num,setMobileNumber]=useState('');
    const[password,setPassword]=useState('');
    const[email_id,setEmail]=useState('');
    const {showSnackbar}=useSnackbar();
      const handleSignup = async () => {
    const payload = {
      user_name,
      mobile_num,
      email_id,
      password,
    };

    try {
      const response = await registerUser(payload);

      if (response.data.statusCode !== 200) {
        showSnackbar(response.data.message, "error");
      } else {
        showSnackbar(response.data.message, "success");

        // clear form on success
        setUserName("");
        setMobileNumber("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        showSnackbar(error.response.data.message, "error");
      } else {
        showSnackbar("Server error", "error");
      }
    }
  };

  return(
    < Box
    display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f4f6f8"
    >
        <Card sx={{width:420,boxShadow:4}}> 
            <CardContent>
                <Typography varaint="h5" align="center" mb={2}>
                    Sign Up
                </Typography>


                <TextField fullWidth label="Name" value={user_name}  margin="normal" onChange={(e)=>setUserName(e.target.value)}/>
                <TextField fullWidth label="Mobile Number" value={mobile_num}  margin="normal" onChange={(e)=>setMobileNumber(e.target.value)}/>
                <TextField fullWidth label="Email" value={email_id}  margin="normal" onChange={(e)=>setEmail(e.target.value)}/>
                <TextField fullWidth label="password" value={password} margin="normal" onChange={(e)=>setPassword(e.target.value)}/>
                
               <Button fullWidth varaint="contained" sx={{mt:2}} onClick={handleSignup}>Register</Button>
               
<Typography align="center" sx={{ mt: 2 }}>
  Already have an account? <Link to="/login">Login</Link>
</Typography>
            </CardContent>

        </Card>
    </Box>
  )

    

}
export default UserSignup;