import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box
} from "@mui/material";

const CreateMember = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    user_ln: "",
    user_fn: "",
    user_role: "member", // default to member
    user_email: "",
    lead_team: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      const payload =
        formData.user_role === "lead" ? formData : { ...formData, lead_team: "" };
      onSubmit(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
          <DialogTitle>Add Member</DialogTitle>
          <DialogContent>
            <Box mt={1}>
              <TextField label="First Name" name="user_fn" fullWidth required margin="dense" onChange={handleChange} />
              <TextField label="Last Name" name="user_ln" fullWidth required margin="dense" onChange={handleChange} />     
              <TextField label="Email" name="user_email" fullWidth required margin="dense" onChange={handleChange} />
              
              <TextField select label="Role" name="user_role" fullWidth required margin="dense" value={formData.user_role}  onChange={handleChange}>  
                <MenuItem value="member">Member</MenuItem>
                <MenuItem value="lead">Lead</MenuItem>
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>Create</Button>
          </DialogActions>
        </Dialog>
  );
};

export default CreateMember;
