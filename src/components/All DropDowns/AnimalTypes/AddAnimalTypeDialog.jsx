import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";

const AddAnimalTypeDialog = ({ open, onClose, newType, setNewType, onAdd, adding }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Animal Type</DialogTitle>
      <DialogContent sx={{ minWidth: 300 }}>
        <TextField
          label="Type Name"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "rgb(42,8,11)" }}>Cancel</Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "rgb(42,8,11)", "&:hover": { backgroundColor: "rgb(30,5,5)" } }}
          onClick={onAdd}
          disabled={adding}
        >
          {adding ? <CircularProgress size={20} /> : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAnimalTypeDialog;
