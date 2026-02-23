import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress } from "@mui/material";
import "../../../index.css";

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
        <Button onClick={onClose} className="color">Cancel</Button>
        <Button
          variant="contained"
         className="bg-color"
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
