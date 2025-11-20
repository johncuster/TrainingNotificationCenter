import React, { useState, useEffect } from "react";

export default function AddTeamToTrainingModal({ isOpen, onClose, trainingId, availableTeams = [], refreshTeams }) {
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    if (isOpen && availableTeams.length) setSelectedTeam(availableTeams[0].team_id);
    else setSelectedTeam("");
  }, [isOpen, availableTeams]);

  const handleAdd = async () => {
    if (!selectedTeam) return alert("Select a team");
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
      alert("Failed to add team");
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
        <button
          className="create-btn"
          style={{ marginTop: 10 }}
          onClick={handleAdd}
          disabled={!availableTeams.length}
        >
          Add Team
        </button>
      </div>
    </div>
  );
}
