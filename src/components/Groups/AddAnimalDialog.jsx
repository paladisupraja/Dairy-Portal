import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Checkbox,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSnackbar } from "../../context/SnackbarContext";
import { getAllAnimals, addAnimalsToGroup } from "../../services";
import "../../index.css";

const AddAnimalDialog = ({ open, onClose, groupId, groupAnimals, onSuccess, farmId }) => {
  const { showSnackbar } = useSnackbar();

  const [animals, setAnimals] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  // IDs of animals already in this group
  const currentGroupIds = groupAnimals.map(a => a.animal_id || a.id);

  useEffect(() => {
    if (open) fetchAnimals();
  }, [open]);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      // fetch all animals in this farm
      const res = await getAllAnimals({ farm_id: farmId });
      const allAnimals = res.data.data || [];

      // Pre-select animals already in this group
      setSelected(currentGroupIds);

      // Filter: show only unassigned animals OR current group animals
      const visibleAnimals = allAnimals.filter(a => {
        const animalId = a.animal_id || a.id;

        // Include if it's in current group
        if (currentGroupIds.includes(animalId)) return true;

        // Include if unassigned
        if (!a.group_id) return true;

        // Otherwise hide
        return false;
      });

      setAnimals(visibleAnimals);

    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load animals", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      showSnackbar("Select at least one animal", "warning");
      return;
    }
    try {
      await addAnimalsToGroup({ groupId, animalIds: selected });
      showSnackbar("Animals updated successfully", "success");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update animals", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Animals to Group</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : animals.length === 0 ? (
          <Typography color="text.secondary">No available animals</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell><b>Tag No</b></TableCell>
                <TableCell><b>Type</b></TableCell>
                <TableCell><b>Gender</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {animals.map(a => {
                const animalId = a.animal_id || a.id;
                const isChecked = selected.includes(animalId);
                return (
                  <TableRow key={animalId}>
                    <TableCell>
                      <Checkbox
                        checked={isChecked }
                        onChange={() => toggleSelect(animalId)}
                        // className="bg-color"
                         sx={{
    color: "rgb(42, 8, 11)", // unchecked color
    "&.Mui-checked": {
      color: "rgb(42, 8, 11)", // checked color
    },
  }}
                      />
                    </TableCell>
                    <TableCell>{a.tag_no}</TableCell>
                    <TableCell>{a.animal_type}</TableCell>
                    <TableCell>{a.gender}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}className="color">Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}className="bg-color">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAnimalDialog;
