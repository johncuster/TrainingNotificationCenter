import { useState, useEffect } from "react";
import "../adminView/adminGlobal.css";

const LeadDashboard = () => {
  const [teamData, setTeamData] = useState({});
  const [memberProgress, setMemberProgress] = useState({});

  const userId = localStorage.getItem("user_id");

  // Fetch trainings assigned to the lead themselves
  useEffect(() => {
    fetch(`http://localhost:8081/member/${userId}`)
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setTeamData(grouped);
      })
      .catch((err) => console.error("Error loading dashboard:", err));
  }, [userId]);

  // Fetch progress of all members if the user is a team lead
  useEffect(() => {
    fetch(`http://localhost:8081/team_training/lead/${userId}/members`)
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setMemberProgress(grouped);
      })
      .catch((err) => console.error("Error loading member progress:", err));
  }, [userId]);

  return (
    <div className="dashboardDesign">
      <h1>LEAD DASHBOARD</h1>
      <h2>User ID: {userId}</h2>

      {/* Lead's Own Training */}
      <h2>Your Assigned Trainings</h2>
      {Object.values(teamData).some((team) => team.length > 0) ? (
        Object.entries(teamData).map(([teamName, rows]) => (
          <div key={teamName} className="team-table">
            <h3>Team: {teamName}</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Training Title</th>
                  <th>Description</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Due Date</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.training_title || "-"}</td>
                    <td>{row.training_desc || "-"}</td>
                    <td>{row.training_link || "-"}</td>
                    <td>{row.ut_status || "-"}</td>
                    <td>{row.ut_assigndate ? new Date(row.ut_assigndate).toLocaleDateString() : "-"}</td>
                    <td>{row.due_date ? new Date(row.due_date).toLocaleDateString() : "-"}</td>
                    <td>{row.ut_completedate ? new Date(row.ut_completedate).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No personal training data found.</p>
      )}

      {/* Member Progress */}
      <h2>Team Member Progress</h2>
      {Object.values(memberProgress).some((team) => team.length > 0) ? (
        Object.entries(memberProgress).map(([teamName, rows]) => (
          <div key={teamName} className="team-table">
            <h3>Team: {teamName}</h3>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Training Title</th>
                  <th>Status</th>
                  <th>Assigned</th>
                  <th>Due Date</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>{row.user_ln || "-"}</td>
                    <td>{row.training_title || "-"}</td>
                    <td>{row.ut_status || "-"}</td>
                    <td>{row.ut_assigndate ? new Date(row.ut_assigndate).toLocaleDateString() : "-"}</td>
                    <td>{row.due_date ? new Date(row.due_date).toLocaleDateString() : "-"}</td>
                    <td>{row.ut_completedate ? new Date(row.ut_completedate).toLocaleDateString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No member progress data available or you are not a team lead.</p>
      )}
    </div>
  );
};

export default LeadDashboard;
