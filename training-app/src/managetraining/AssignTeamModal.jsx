import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function AssignTeamModal({ open, onClose, trainingId, onAssigned }) {
  const [allTeams, setAllTeams] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const [teamsRes, assignedRes] = await Promise.all([
          fetch("http://localhost:8081/team").then(r => r.json()),
          fetch(`http://localhost:8081/training/${trainingId}/teams`).then(r => r.json()),
        ]);
        setAllTeams(Array.isArray(teamsRes) ? teamsRes : []);
        setAssigned(Array.isArray(assignedRes) ? assignedRes : []);
      } catch (err) {
        console.error(err);
        setAllTeams([]);
        setAssigned([]);
      }
    };
    load();
  }, [open, trainingId]);

  const available = allTeams.filter(t => !assigned.some(a => a.team_id === t.team_id));

  const handleAssign = async () => {
    if (!selectedTeam) {
      alert("Select a team to assign");
      return;
    }
    try {
      const res = await fetch("http://localhost:8081/team_training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ training_id: trainingId, team_id: selectedTeam }),
      });
      if (!res.ok) throw new Error("Assign failed");
      onAssigned?.();
    } catch (err) {
      console.error(err);
      alert("Failed to assign team");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Team</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Select Team</InputLabel>
          <Select
            value={selectedTeam}
            label="Select Team"
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {available.map((t) => (
              <MenuItem key={t.team_id} value={t.team_id}>
                {t.team_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAssign}>Assign</Button>
      </DialogActions>
    </Dialog>
  );
}