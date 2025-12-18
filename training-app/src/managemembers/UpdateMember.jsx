import React, { useState, useEffect } from "react";
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

const UpdateMember = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    user_ln: "",
    user_fn: "",
    user_role: "member",
    user_email: "",
    lead_team: "",
  });

  const [availableTeams, setAvailableTeams] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8081/team") 
        .then((res) => res.json())
        .then((teams) => setAvailableTeams(Array.isArray(teams) ? teams : []))
        .catch((err) => console.error("Failed to fetch teams:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        lead_team: initialData.lead_team || "",
        user_role: initialData.user_role || "",
        user_email: initialData.user_email || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      const payload =
        formData.user_role === "lead"
          ? formData
          : { ...formData, lead_team: "" };
      onSubmit(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
     <Dialog open={isOpen} onClose={onClose} fullWidth>
              <DialogTitle>Update Member</DialogTitle>
              <DialogContent>
                <Box mt={1}>
                  <TextField label="First Name" name="user_fn" fullWidth required margin="dense"  value={formData.user_fn} onChange={handleChange} />
                  <TextField label="Last Name" name="user_ln" fullWidth required margin="dense" value={formData.user_ln} onChange={handleChange} />
                  <TextField label="Email" name="user_email" fullWidth required margin="dense"  value={formData.user_email} onChange={handleChange} />
                  {formData.user_role !== 'admin' && (
                    <TextField select label="Role" name="user_role" fullWidth required margin="dense" value={formData.user_role}  onChange={handleChange}>  
                      <MenuItem value="member">Member</MenuItem>
                      <MenuItem value="lead">Lead</MenuItem>
                    </TextField>
                  )}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>Create</Button>
              </DialogActions>
            </Dialog>
  );
};

export default UpdateMember;
