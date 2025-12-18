import React, { useEffect, useState } from "react";
import { Modal, Box, Button, FormControl, Select, MenuItem } from "@mui/material";
import { showAlert } from "../component/alert"; 

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "white",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function AddMemberModal({ open, onClose, teamId, onAdded }) {
  const [allMembers, setAllMembers] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selected, setSelected] = useState("");

  useEffect(() => {
    if (!open) return;
    const load = async () => {
      try {
        const [allRes, assignedRes] = await Promise.all([
          fetch("http://localhost:8081/member").then((r) => r.json()),
          fetch(`http://localhost:8081/team/${teamId}/members`).then((r) => r.json()),
        ]);
        setAllMembers(Array.isArray(allRes) ? allRes : []);
        setAssigned(Array.isArray(assignedRes) ? assignedRes : []);
      } catch (err) {
        console.error(err);
        setAllMembers([]);
        setAssigned([]);
      }
    };
    load();
  }, [open, teamId]);

  const available = allMembers.filter(
    (m) => !assigned.some((a) => a.user_id === m.user_id)
  );

  const handleAdd = async () => {
    if (!selected) return showAlert("Please select a member to add", "info");
    try {
      const res = await fetch("http://localhost:8081/user_team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team_id: teamId, user_id: selected }),
      });
      if (!res.ok) throw new Error("Add failed");
      onAdded?.();
    } catch (err) {
      console.error(err);
      showAlert("Failed to add member to team", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <h3>Add Member</h3>

        <FormControl fullWidth>
          <Select displayEmpty value={selected} onChange={(e) => setSelected(e.target.value)}>
            <MenuItem value="">
              <em>Select member</em>
            </MenuItem>
            {available
              .filter((m) => m.user_role !== "admin")
              .map((m) => (
                <MenuItem key={m.user_id} value={m.user_id}>
                  {m.user_ln} {m.user_fn ? `, ${m.user_fn}` : ""}
                </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button variant="contained" onClick={handleAdd}>
            Add
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
