import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, MenuItem, Select } from "@mui/material";
import "./leadLayout.css";

export default function LeadTeam() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [teams, setTeams] = useState([]);

  const userId = localStorage.getItem("user_id");
  const userFirstName = localStorage.getItem("user_fn") || "FirstName";
  const userLastName = localStorage.getItem("user_ln") || "LastName";

  // 1️⃣ Fetch Teams the Lead Manages
  useEffect(() => {
    fetch(`http://localhost:8081/team_lead/${userId}`)
      .then((res) => res.json())
      .then((rows) => {
        setTeams(rows);
      })
      .catch((err) => console.error("Error fetching lead teams:", err));
  }, [userId]);

  // 2️⃣ Fetch Training Data for Teams the Lead Manages
  useEffect(() => {
    fetch(`http://localhost:8081/team_training/lead/${userId}/members`)
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setData(grouped);
      })
      .catch((err) => console.error("Error fetching team training data:", err));
  }, [userId]);

  // Save update for a single row
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

  // Save all rows
  const handleSaveAll = async () => {
    try {
      const allRows = Object.values(data).flat();
      await Promise.all(allRows.map((row) => saveUpdate(row)));
      alert("Saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  // KPI Calculations
  const getKPIs = () => {
    const rows =
      selectedTeam === "ALL"
        ? Object.values(data).flat()
        : data[selectedTeam] || [];

    const total = rows.length;
    const completed = rows.filter((r) => r.ut_status === "Completed").length;
    const pending = rows.filter((r) => r.ut_status === "Pending").length;

    const today = new Date();
    const overdue = rows.filter(
      (r) =>
        r.due_date &&
        new Date(r.due_date) < today &&
        r.ut_status !== "Completed"
    ).length;

    return { total, completed, pending, overdue };
  };

  const KPIs = getKPIs();

  const trainingColumns = [
    { field: "user_fn", headerName: "First Name", flex: 2 },
    { field: "user_ln", headerName: "Last Name", flex: 2 },
    { field: "training_title", headerName: "Training Title", flex: 2 },
    { field: "training_desc", headerName: "Description", flex: 2 },
    { field: "training_link", headerName: "Link", flex: 3 },
    { field: "ut_status", headerName: "Status", width: 100 },
    { field: "due_date", headerName: "Due Date", width: 100 },
    { field: "ut_assigndate", headerName: "Assigned", width: 100 },
    { field: "ut_completedate", headerName: "Completed", width: 100 },
  ];

  const rows =
    selectedTeam === "ALL"
      ? Object.values(data)
          .flat()
          .map((row, i) => ({ ...row, id: i }))
      : (data[selectedTeam] || []).map((row, i) => ({ ...row, id: i }));

  return (
    <div className="dashboard-container">
      {/* KPI PANEL */}
      <div className="kpi-container">
        <div className="kpi-card" style={{ background: "#f796a5ff" }}>
          Overdue: {KPIs.overdue}
        </div>
        <div className="kpi-card" style={{ background: "#9bf8c5ff" }}>
          Completed: {KPIs.completed}
        </div>
        <div className="kpi-card" style={{ background: "#eff7b8ff" }}>
          Pending: {KPIs.pending}
        </div>
        <div className="kpi-card">Total Trainings: {KPIs.total}</div>
      </div>

      <div className="user-layout">
        {/* LEFT PANEL */}
        <div className="user-left">
          <div
            className="user-info-box"
            style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px" }}
          >
            <h3 style={{ margin: 0 }}>Lead Dashboard</h3>
            <p><b>User ID:</b> {userId}</p>
            <p><b>First Name:</b> {userFirstName}</p>
            <p><b>Last Name:</b> {userLastName}</p>
          </div>

          <div className="user-select">
            <h3>Select Team</h3>
            <Select
              fullWidth
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <MenuItem value="ALL">All Teams</MenuItem>
              {teams.map((team) => (
                <MenuItem key={team.team_id} value={team.team_name}>
                  {team.team_name}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="user-right">
          <DataGrid rows={rows} columns={trainingColumns} autoHeight pageSize={10} />
          <Button
            variant="contained"
            onClick={handleSaveAll}
            style={{ marginBottom: "10px" }}
          >
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
