import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

import { getEmployees, assignEmployeeToGroup, unAssignEmployeeToGroup } from "../../services";
import { useSnackbar } from "../../context/SnackbarContext";

const AssignEmployeeDialog = ({ open, onClose, group }) => {
  const { showSnackbar } = useSnackbar();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ----------------------------------
     Load employees & preselect current
  ---------------------------------- */
  useEffect(() => {
    if (open && group) {
      setSelectedEmployee(group.employee_id || null);
      fetchEmployees();
    }
  }, [open, group]);

  /* ----------------------------------
     Fetch employees (same farm only)
  ---------------------------------- */
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      const allEmployees = res.data.details || [];

      const farmEmployees = allEmployees.filter(
        (emp) => emp.farm_id === group.farm_id
      );

      setEmployees(farmEmployees);
    } catch (err) {
      showSnackbar("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     Checkbox select (toggle single select)
  ---------------------------------- */
  const handleCheck = (employeeId) => {
    // toggle selection: click same employee => unselect
    setSelectedEmployee((prev) => (prev === employeeId ? null : employeeId));
  };

  /* ----------------------------------
     Assign / Unassign employee
  ---------------------------------- */
  const handleAssign = async () => {
    try {
      // Unassign previous if changed
      if (group.employee_id && selectedEmployee !== group.employee_id) {
        await unAssignEmployeeToGroup({
          groupId: group.group_id,
          employeeId: group.employee_id,
        });
      }

      // Assign new employee if selected
      if (selectedEmployee) {
        await assignEmployeeToGroup({
          groupId: group.group_id,
          employeeId: selectedEmployee,
          farm_id: group.farm_id,
        });
        showSnackbar("Employee assigned successfully", "success");
      } else {
        showSnackbar("Employee unassigned successfully", "success");
      }

      onClose(true); // refresh parent
    } catch (err) {
      showSnackbar("Assignment failed", "error");
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="sm">
      <DialogTitle>Assign Employee</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* CURRENT EMPLOYEE INFO */}
            {group.employee_name && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Current Employee:{" "}
                <b>
                  {group.employee_name} (ID: {group.employee_id})
                </b>
              </Typography>
            )}

            <Divider sx={{ mb: 1 }} />

            {/* CHECKBOX LIST */}
            <List>
              {employees.map((emp) => {
                const checked = selectedEmployee === emp.employee_id;

                return (
                  <ListItem
                    key={emp.employee_id}
                    button
                    onClick={() => handleCheck(emp.employee_id)}
                    sx={{
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: checked ? "#f0f7ff" : "transparent",
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={checked}
                        onChange={() => handleCheck(emp.employee_id)}
                        sx={{
    color: "rgb(42, 8, 11)", // unchecked color
    "&.Mui-checked": {
      color: "rgb(42, 8, 11)", // checked color
    },
  }}
                      />
                    </ListItemIcon>

                    <ListItemText
                      primary={`${emp.employee_name}`}
                      secondary={`Employee ID: ${emp.employee_id}`}
                    />
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)} sx={{color:"rgb(42,8,11)"}}>Cancel</Button>
        <Button variant="contained" onClick={handleAssign} sx={{
    backgroundColor: "rgb(42, 8, 11)", // Correct way to style MUI Button
    "&:hover": { backgroundColor: "rgb(30, 5, 5)" },
  }}>
          {selectedEmployee ? "Assign" : "Unassign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignEmployeeDialog;
