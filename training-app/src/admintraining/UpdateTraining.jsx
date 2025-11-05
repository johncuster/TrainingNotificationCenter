import React, { useState, useEffect } from "react";
import "../adminView/updateTraining.css";

const UpdateTraining = ({ isOpen, onClose, onSubmit, initialData}) => {
  const [formData, setFormData] = useState({
    training_title: "",
    training_desc: "",
    training_link: "",
  });

  const [assignedTeams, setAssignedTeams] = useState([]);
  const [allTeams, setAllTeams] = useState([]);    
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {      
    if (initialData){
      setFormData(initialData);
      
      //fetch assigned teams
      fetch(`http://localhost:8081/training/${initialData.training_id}/teams`)
        .then((res) => res.json())
        .then((data) => setAssignedTeams(data))
        .catch((err) => console.error("Error fetching assigned teams:", err));

      // Fetch all available teams
      fetch("http://localhost:8081/team")
        .then((res) => res.json())
        .then((data) => setAllTeams(data))
        .catch((err) => console.error("Error fetching teams:", err));
        }
    }, [initialData]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (onSubmit) {onSubmit(formData);}
      onClose();
    };

    const handleAddTeam = async () => {
      if (!selectedTeam) {
        alert("Please select a team to assign.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/team_training", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          training_id: initialData.training_id,
          team_id: selectedTeam,
                }),
        });

            if (response.ok) {
                // Refresh assigned teams list
                const updatedTeams = await fetch(
                    `http://localhost:8081/training/${initialData.training_id}/teams`
                ).then((res) => res.json());

                setAssignedTeams(updatedTeams);
                setSelectedTeam("");
                alert("UPDATED TEAM");
            } 
            else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to assign team.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error assigning team");
        }
        setSelectedTeam("");
    };

    const handleDeleteTeam = async (teamId) => {
        if (!window.confirm("Are you sure you want to remove this team?")) return;

        try {
            const response = await fetch(
                `http://localhost:8081/team_training/${initialData.training_id}/${teamId}`,
            { method: "DELETE" }
            );

        if (response.ok) {
            // refresh the team list
            const updatedTeams = await fetch(
                `http://localhost:8081/training/${initialData.training_id}/teams`
            ).then((res) => res.json());
            setAssignedTeams(updatedTeams);
            alert("Team removed successfully.");
        } else {
            const errorData = await response.json();
            alert(errorData.error || "Failed to remove team.");
        }
    } catch (error) {
        console.error("Error deleting team:", error);
        alert("Error removing team from training.");
    }
    };

  // Filter out teams that are already assigned
  const availableTeams = allTeams.filter(
    (team) => !assignedTeams.some((assigned) => assigned.team_id === team.team_id)
  );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button> <br/>
                <h2>Edit Training</h2>
                
                <form onSubmit={handleSubmit} className="create-form">
                <label>
                    Training Title:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="training_title"
                    value={formData.training_title}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    Description:<br/>
                    <input 
                    className="text-input"
                    type = "text"
                    name="training_desc"
                    value={formData.training_desc}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    Training Link:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="training_link"
                    value={formData.training_link}
                    onChange={handleChange}
                    />
                </label>

                <br/>
                <div className="modal-buttons">
                    <button type="submit" className="create-btn">
                    Update
                    </button>
                </div>
                </form>

                <h3 style={{ marginTop: "20px" }}>Newly Assigned Teams</h3>

        {/* Team selection and add button */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="text-input"
              >
                <option value="">-- Select Team --</option>
                {availableTeams.length > 0 ? (
                  availableTeams.map((team) => (
                    <option key={team.team_id} value={team.team_id}>
                      {team.team_name}
                    </option>
                  ))
                ) : (
                  <option disabled>No more teams available</option>
                )}
              </select>
                            <button onClick={handleAddTeam} className="create-btn">
                                Add Team
                            </button>
                            </div>

                            <table className="tb_design" style={{ marginTop: "10px" }}>
                            <thead>
                                <tr>
                                <th>Team ID</th>
                                <th>Team Name</th>
                                </tr>
                            </thead>
                            <tbody>
              {assignedTeams.length > 0 ? (
                assignedTeams.map((team) => (
                  <tr key={team.team_id}>
                    <td>{team.team_id}</td>
                    <td>{team.team_name}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteTeam(team.team_id)}
                        className="delete-btn"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No teams assigned to this training.
                  </td>
                </tr>
              )}
            </tbody>
            </table>
          </div>
      </div>
    );
};

export default UpdateTraining;
