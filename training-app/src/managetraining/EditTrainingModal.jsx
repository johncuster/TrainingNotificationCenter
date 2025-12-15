import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from "@mui/material";

export default function EditTrainingModal({ isOpen, onClose, initialData, onSubmit }) {
  const [form, setForm] = useState({ training_title: "", training_desc: "", training_link: "" });

  useEffect(() => {
    if (initialData) setForm({
      training_title: initialData.training_title || "",
      training_desc: initialData.training_desc || "",
      training_link: initialData.training_link || ""
    });
  }, [initialData]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    if (!initialData) return;
    if (onSubmit) await onSubmit({ ...initialData, ...form });
    onClose();
  };

  if (!initialData) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Update Training</DialogTitle>
      <DialogContent>
        <Box mt={1}>
          <TextField label="Title" name="training_title" fullWidth required margin="dense" value={form.training_title} onChange={handleChange}/>
          <TextField label="Description" name="training_desc" fullWidth required margin="dense" value={form.training_desc} onChange={handleChange}/>
          <TextField label="Link" name="training_link" fullWidth margin="dense" value={form.training_link} onChange={handleChange}/>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
}
