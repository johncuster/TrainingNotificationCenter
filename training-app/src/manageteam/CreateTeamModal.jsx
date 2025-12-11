// CreateTeamModal.jsx
import React, { useState } from "react";
import { Modal, Box, Button, TextField } from "@mui/material";
import { showAlert } from "../component/alert"; 

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "white",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function CreateTeamModal({ open, onClose, onCreated }) {
  const [teamName, setTeamName] = useState("");

  const handleCreate = async () => {
    if (!teamName.trim()) {
      showAlert("Team name cannot be empty", "info");
      return;
    }
    try {
      const res = await fetch("http://localhost:8081/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_name: teamName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Create failed");
      }
      setTeamName("");
      onCreated?.();
      window.location.reload();
    } catch (err) {
      console.error(err);
      showAlert("Failed to create team", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h3>Create Team</h3>
        <TextField
          label="Team Name"
          fullWidth
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
