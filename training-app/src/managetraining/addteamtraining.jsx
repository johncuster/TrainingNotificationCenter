import React, { useState, useEffect } from "react";
import { showAlert } from "../component/alert"; 

export default function AddTeamToTrainingModal({ isOpen, onClose, trainingId, availableTeams = [], refreshTeams }) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [dueDates, setDueDates] = useState({});

  useEffect(() => {
    if (isOpen && availableTeams.length) setSelectedTeam(availableTeams[0].team_id);
    else setSelectedTeam("");
  }, [isOpen, availableTeams]);

  const handleAdd = async () => {
    if (!selectedTeam) return showAlert("Select a team", "error");
    try {
      const res = await fetch("http://localhost:8081/team_training", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ training_id: trainingId, team_id: selectedTeam })
      });
      if (!res.ok) throw new Error("Failed to add team");
      refreshTeams?.();
      onClose();
    } catch (err) {
      console.error(err);
      showAlert("Failed to add team", "error");
    }
  };

  // New: handle date change
  const handleDateChange = (teamId, date) => {
    setDueDates(prev => ({ ...prev, [teamId]: date }));
  };

  // New: save due date
  const saveDueDate = async (teamId) => {
    const selectedDate = dueDates[teamId];
    if (!selectedDate) return showAlert("Select a due date", "error");

    try {
      // Update team_training
      await fetch(`http://localhost:8081/team_training/due_date/${trainingId}/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: selectedDate })
      });

      // Update user_training
      await fetch(`http://localhost:8081/user_training/due_date/${trainingId}/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: selectedDate })
      });

      showAlert("Due date updated successfully!", "success");
      refreshTeams();
    } catch (err) {
      console.error("Failed to update due date:", err);
      showAlert("Failed to update due date", "error");
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Add Team</h2>
        <select className="text-input" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
          {availableTeams.length ? availableTeams.map(t => (
            <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
          )) : <option value="" disabled>No more teams available</option>}
        </select>
        <button className="create-btn" style={{ marginTop: 10 }} onClick={handleAdd} disabled={!availableTeams.length}>
        Add Team
        </button>
      </div>
    </div>
  );
}
