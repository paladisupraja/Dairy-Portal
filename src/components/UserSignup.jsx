import React, {useState} from 'react';
import { registerUser} from '../services';
import { useSnackbar } from '../context/SnackbarContext';
import { Link ,useNavigate} from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const UserSignup=()=>{
  const navigate=useNavigate();
    const[user_name,setUserName]=useState('');
    const[mobile_num,setMobileNumber]=useState('');
    const[password,setPassword]=useState('');
    const[email_id,setEmail]=useState('');
    const {showSnackbar}=useSnackbar();
      const handleSignup = async () => {
        if (!user_name || !mobile_num || !email_id || !password) {
    showSnackbar("All fields are required", "error");
    return;
  }
    const payload = {
      user_name,
      mobile_num,
      email_id,
      password,
    };
 if (!/\S+@\S+\.\S+/.test(email_id)) {
      showSnackbar("Enter valid email", "error");
      return;
    }
    try {
      const response = await registerUser(payload);

      if (response.data.statusCode !== 200) {
        showSnackbar(response.data.message, "error");
      } else {
        showSnackbar(response.data.message, "success");
        setTimeout(()=>{
          navigate("/login");
        });

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


                <TextField fullWidth label="Name" required value={user_name}  margin="normal" onChange={(e)=>setUserName(e.target.value)} placeholder='Enter Name'/>
                <TextField fullWidth label="Mobile Number" required value={mobile_num}  inputProps={{maxLength: 10}} margin="normal" onChange={(e)=>setMobileNumber(e.target.value)} placeholder="Enter Mobile Number"/>
                <TextField fullWidth label="Email" required value={email_id}  margin="normal" onChange={(e)=>setEmail(e.target.value)} placeholder='Enter Email'/>
                <TextField fullWidth label="password" required value={password} margin="normal" onChange={(e)=>setPassword(e.target.value)} placeholder="Enter Password"/>
                
               <Button fullWidth variant="contained" sx={{mt:2,backgroundColor:"rgb(42, 8, 11)", "&:hover": { backgroundColor: "rgb(30, 5, 5)" }}} onClick={handleSignup}>Register</Button>
               
<Typography align="center" sx={{ mt: 2 }}>
  Already have an account? <Link to="/login" style={{color:"rgb(42,8,11)"}}>Login</Link>
</Typography>
            </CardContent>

        </Card>
    </Box>
  )

    

}
export default UserSignup;