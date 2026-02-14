import React, { useEffect, useState } from "react";
import { getEmployees } from "../services";
import { useSnackbar } from "../context/SnackbarContext";
import { useNavigate, Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box, Card, CardContent, Typography,
  Table, TableHead, TableRow, TableCell, TableBody,
  CircularProgress, Button, IconButton
} from "@mui/material";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const isEmployee = user.role === "employee";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      let params = {};

      // If employee, filter by farm_id
      if (isEmployee) {
        params.farm_id = user.farm_id;
      }

      const res = await getEmployees(params);

      if (res.data.statusCode === 200) {
        setEmployees(res.data.details);
        showSnackbar(res.data.message, "success");
      } else {
        showSnackbar(res.data.message, "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to fetch employees", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h5">Employee List</Typography>

            {/* Add Employee button for all users */}
            <Button
              variant="contained"
              component={Link}  sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}
              to="/add-employee"
              state={isEmployee ? { farm_id: user.farm_id } : {}}
            >
              Add Employee
            </Button>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Experience</TableCell>
                   <TableCell>Login</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

             <TableBody>
  {employees.length > 0 ? (
    employees.map((emp) => (
      <TableRow key={emp.employee_id}>
        <TableCell>{emp.employee_id}</TableCell>
        <TableCell>{emp.employee_name}</TableCell>
        <TableCell>{emp.department || "-"}</TableCell>
        <TableCell>{emp.phone}</TableCell>
        <TableCell>{emp.gender}</TableCell>
        <TableCell>{emp.years_of_experience ?? "-"}</TableCell>
         <TableCell>{emp.login_flag ? "Yes" : "No"}</TableCell>
        <TableCell>
          {/* Edit button visible for everyone */}
          <IconButton
            sx={{
        color: "rgb(30, 5, 5)"}}
            onClick={() => navigate("/update-employee", { state: emp })} 
          >
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={7} align="center">
        No employees found
      </TableCell>
    </TableRow>
  )}
</TableBody>

            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeList;
