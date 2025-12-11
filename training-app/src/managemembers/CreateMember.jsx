import React, { useState } from "react";
//import "./memberFormStyle.css";
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
    lead_team: "", // optional if role = lead
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
          <DialogTitle>Create Training</DialogTitle>
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
  //   <div className="modal-overlay" onClick={onClose}>
  //     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
  //       <button className="close-btn" onClick={onClose}>&times;</button>
  //       <h2>Add Member</h2>

  //       <form onSubmit={handleSubmit} className="create-form">
  //         <label>
  //           Last Name:<br />
  //           <input
  //             className="text-input"
  //             type="text"
  //             name="user_ln"
  //             onChange={handleChange}
  //             required
  //           />
  //         </label>

  //         <label>
  //           First Name:<br />
  //           <input
  //             className="text-input"
  //             type="text"
  //             name="user_fn"
  //             onChange={handleChange}
  //             required
  //           />
  //         </label>

  //         <label>
  //           User Role:<br />
  //           <select
  //             className="text-input"
  //             name="user_role"
  //             value={formData.user_role}
  //             onChange={handleChange}
  //             required
  //           >
  //             <option value="member">member</option>
  //             <option value="lead">lead</option>
  //           </select>
  //         </label>
  //         <label>
  //           User Email:<br />
  //           <input
  //             className="text-input"
  //             type="email"
  //             name="user_email"
  //             onChange={handleChange}
  //             required
  //           />
  //         </label>

  //         <br />
  //         <div className="modal-buttons">
  //           <button type="submit" className="create-btn">Create</button>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  );
};

export default CreateMember;
