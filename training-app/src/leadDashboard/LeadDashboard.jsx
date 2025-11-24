import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import "./leadLayout.css";

export default function LeadDashboard() {
  const [teamData, setTeamData] = useState({});
  const [memberProgress, setMemberProgress] = useState({});
  const [leadTeams, setLeadTeams] = useState([]); // ⭐ teams the user leads
  const [selectedTeam, setSelectedTeam] = useState(null);
  const userId = localStorage.getItem("user_id");

  // Fetch all trainings assigned to this user
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

  // Fetch teams the user leads
  useEffect(() => {
    fetch(`http://localhost:8081/team_lead/${userId}`)
      .then((res) => res.json())
      .then((rows) => {
        setLeadTeams(Array.isArray(rows) ? rows.map((t) => t.team_name) : []);
      })
      .catch(console.error);
  }, [userId]);

  // Fetch member progress for all teams
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
      .catch(console.error);
  }, [userId]);

  const saveUpdate = (row) => {
    return fetch(
      `http://localhost:8081/user_training/update/${row.usertraining_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ut_status: row.ut_status,
          usertraining_id: row.usertraining_id,
        }),
      }
    ).then((res) => res.json());
  };

  const handleSaveAll = async (rows) => {
    try {
      await Promise.all(rows.map((row) => saveUpdate(row)));
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  const teamColumns = [{ field: "team_name", headerName: "Team Name", flex: 1 }];
  const teamRows = Object.keys(teamData).map((team, index) => ({
    id: index,
    team_name: team,
  }));

  const trainingColumns = [
    { field: "training_title", headerName: "Training Title", flex: 1 },
    { field: "training_desc", headerName: "Description", flex: 1 },
    { field: "training_link", headerName: "Link", flex: 1 },
    {
      field: "ut_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => (
        <select
          value={params.row.ut_status || "Pending"}
          onChange={(e) => {
            const newData = { ...teamData };
            const idx = newData[selectedTeam].findIndex(
              (r) => r.training_id === params.row.training_id
            );
            newData[selectedTeam][idx].ut_status = e.target.value;
            setTeamData(newData);
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
    { field: "ut_assigndate", headerName: "Assigned", width: 150 },
    { field: "due_date", headerName: "Due Date", width: 150 },
    { field: "ut_completedate", headerName: "Completed", width: 150 },
  ];

  const memberColumns = [
    { field: "training_title", headerName: "Training", flex: 1 },
    { field: "user_fn", headerName: "First Name", flex: 1 },
    { field: "user_ln", headerName: "Last Name", flex: 1 },
    { field: "ut_status", headerName: "Status", width: 150 },
    { field: "ut_assigndate", headerName: "Assigned", width: 150 },
    { field: "due_date", headerName: "Due Date", width: 150 },
    { field: "ut_completedate", headerName: "Completed", width: 150 },
  ];

  const isLead = selectedTeam && leadTeams.includes(selectedTeam);

  return (
    <div className="user-dashboard-container">
      <div className="user-info-header">
        <h1>Lead Dashboard</h1>
        <p>
          <b>User ID:</b> {userId}
        </p>
      </div>

      <div className="user-layout">
        {/* LEFT PANEL: Teams */}
        <div className="user-left">
          <h2>My Teams</h2>
          <DataGrid
            rows={teamRows}
            columns={teamColumns}
            autoHeight
            pageSize={10}
            onRowClick={(params) => setSelectedTeam(params.row.team_name)}
          />
        </div>

        {/* RIGHT PANEL: Trainings / Member Progress */}
        <div className="user-right">
          {selectedTeam ? (
            <>
              <h2>Your Trainings: {selectedTeam}</h2>
              <Button
                variant="contained"
                onClick={() => handleSaveAll(teamData[selectedTeam])}
                style={{ marginBottom: "10px" }}
              >
                Save All Changes
              </Button>
              <DataGrid
                rows={teamData[selectedTeam].map((t, i) => ({ ...t, id: i }))}
                columns={trainingColumns}
                autoHeight
                pageSize={10}
              />

              <h2 style={{ marginTop: "20px" }}>Member Progress: {selectedTeam}</h2>
              {isLead ? (
                <DataGrid
                  rows={
                    memberProgress[selectedTeam]?.map((m, i) => ({ ...m, id: i })) || []
                  }
                  columns={memberColumns}
                  autoHeight
                  pageSize={10}
                />
              ) : (
                <p>You are not a lead for this team and cannot view member progress.</p>
              )}
            </>
          ) : (
            <p>Please select a team from the left.</p>
          )}
        </div>
      </div>
    </div>
  );
}
