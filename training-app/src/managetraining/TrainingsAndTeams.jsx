import React, { useState, useEffect } from "react";
import TrainingTable from "./TrainingTable";           // Left panel
import TrainingTeamTable from "./TrainingTeamTable";   // Right panel
import "./trainingLayout.css";

export default function TrainingsAndTeams({ trainings, allTeams, refreshTrainings }) {
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [assignedTeams, setAssignedTeams] = useState([]);

  // Fetch assigned teams + progress whenever a training is selected
  const fetchAssignedTeams = async (trainingId) => {
    try {
      const assigned = await fetch(`http://localhost:8081/training/${trainingId}/teams`).then(res => res.json());
      const progress = await fetch(`http://localhost:8081/user_training/progress/${trainingId}`).then(res => res.json());

      const merged = assigned.map(team => {
        const prog = progress.find(p => p.team_id === team.team_id);
        return { ...team, completion_percentage: prog ? prog.completion_percentage : 0 };
      });

      setAssignedTeams(merged);
    } catch (err) {
      console.error("Error fetching assigned teams:", err);
      setAssignedTeams([]);
    }
  };

  useEffect(() => {
    if (selectedTraining) {
      fetchAssignedTeams(selectedTraining.training_id);
    } else {
      setAssignedTeams([]);
    }
  }, [selectedTraining]);

  return (
    <div className="trainings-layout">
      <div className="left-panel">
        <TrainingTable
          trainings={trainings}
          onSelectTraining={setSelectedTraining}
          refreshTrainings={refreshTrainings}
        />
      </div>

      <div className="right-panel">
        {selectedTraining ? (
          <TrainingTeamTable
            trainingId={selectedTraining.training_id}
            teams={assignedTeams}
            allTeams={allTeams}
            refreshTeams={() => fetchAssignedTeams(selectedTraining.training_id)}
          />
        ) : (
          <div>Select a training to see assigned teams</div>
        )}
      </div>
    </div>
  );
}
