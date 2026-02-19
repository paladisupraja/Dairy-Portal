import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const AnimalTypeTable = ({ animalTypes, onDeleteClick }) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
          <TableCell align="center"><b>ID</b></TableCell>
          <TableCell align="center"><b>Type</b></TableCell>
          <TableCell align="center"><b>Actions</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {animalTypes.map((animal) => (
          <TableRow key={animal.id} sx={{ "&:hover": { backgroundColor: "#f0f8ff" }, height: 36 }}>
            <TableCell align="center">{animal.id}</TableCell>
            <TableCell align="center">{animal.type}</TableCell>
            <TableCell align="center">
              <IconButton color="error" size="small" onClick={() => onDeleteClick(animal.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        {animalTypes.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} align="center">No animal types found</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default AnimalTypeTable;
