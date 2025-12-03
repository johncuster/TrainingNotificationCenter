import React, { useState } from "react";
import { showAlert } from "../component/alert"; 
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from "@mui/material";

export default function CreateTrainingModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    training_title: "",
    training_desc: "",
    training_link: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    if (!form.training_title.trim() || !form.training_desc.trim()) {
      showAlert("Title and Description Required", "info")
      return;
    }
    // call parent onSubmit (which will handle fetch & reload)
    if (onSubmit) await onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Create Training</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <TextField label="Training Title" name="training_title" fullWidth required margin="dense" onChange={handleChange} />
          <TextField label="Description" name="training_desc" fullWidth required margin="dense" onChange={handleChange} />
          <TextField label="Training Link" name="training_link" fullWidth margin="dense" onChange={handleChange} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleCreate}>Create</Button>
      </DialogActions>
    </Dialog>
  );
}
