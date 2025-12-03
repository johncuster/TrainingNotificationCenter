import React, { useEffect, useState } from "react";

export default function UserTeams({ userId, userRole, onLeadUpdate }) {
  const [teams, setTeams] = useState([]);
  const [leadTeams, setLeadTeams] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Fetch all teams the user belongs to
    fetch(`http://localhost:8081/team/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setTeams(Array.isArray(data) ? data : []))
      .catch(console.error);

    // Fetch all teams the user leads
    fetch(`http://localhost:8081/team_lead/${userId}`)
      .then((res) => res.json())
      .then((data) =>
        setLeadTeams(Array.isArray(data) ? data.map((t) => t.team_id) : [])
      )
      .catch(console.error);
  }, [userId]);

  const handleAddLead = (teamId) => {
    if (!leadTeams.includes(teamId)) {
      const updatedLeads = [...leadTeams, teamId];
      setLeadTeams(updatedLeads);
      onLeadUpdate(updatedLeads);
    }
  };

  const handleRemoveLead = (teamId) => {
    if (leadTeams.includes(teamId)) {
      const updatedLeads = leadTeams.filter((id) => id !== teamId);
      setLeadTeams(updatedLeads);
      onLeadUpdate(updatedLeads);
    }
  };

  return (
    <div className="user-teams-container">
      <h4>Teams:</h4>
      {teams.length === 0 ? (
        <p>User is not part of any team.</p>
      ) : (
        <table className="user-teams-table">
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Role</th>
              {userRole === "lead" && <th>Action</th>} {/* Only show Action column for leads */}
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => {
              const isLead = leadTeams.includes(team.team_id);
              return (
                <tr key={team.team_id}>
                  <td>{team.team_name}</td>
                  <td>{isLead ? "Lead" : "Member"}</td>
                  {userRole === "lead" && (
                    <td>
                      {isLead ? (
                        <button
                          className="remove-lead-btn"
                          onClick={() => handleRemoveLead(team.team_id)}
                        >
                          Remove as Lead
                        </button>
                      ) : (
                        <button
                          className="assign-lead-btn"
                          onClick={() => handleAddLead(team.team_id)}
                        >
                          Assign as Lead
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
