import React, { useEffect, useState } from "react";
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

export default function EditTeamModal({ open, onClose, team, onUpdated }) {
  const [teamName, setTeamName] = useState("");

  useEffect(() => {
    if (team) setTeamName(team.team_name ?? "");
    else setTeamName("");
  }, [team]);

  const handleUpdate = async () => {
    if (!team) return;
    try {
      const res = await fetch(`http://localhost:8081/team/${team.team_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_name: teamName }),
      });
      if (!res.ok) throw new Error("Update failed");
      onUpdated?.();
      showAlert("Team updated successfully", "success");

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err);
      showAlert("Failed to update team", "error");
    }
  };

  if (!team) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h3>Update Team</h3>
        <TextField
          label="Team Name"
          fullWidth
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
