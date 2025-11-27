import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, MenuItem, Select } from "@mui/material";
import "./userLayout.css";

export default function MemberDashboard() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const userId = localStorage.getItem("user_id");
  const userFirstName = localStorage.getItem("user_fn") || "FirstName";
  const userLastName = localStorage.getItem("user_ln") || "LastName";

  // Fetch data and group by team
  useEffect(() => {
    fetch(`http://localhost:8081/member/${userId}`)
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setData(grouped);
      })
      .catch((err) => console.error("Error fetching member data:", err));
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
    { field: "team_name", headerName: "Team", width: 150 },
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
            const newData = { ...data };
            const teamName = params.row.team_name;
            const rowIndex = newData[teamName].findIndex(
              (r) => r.training_id === params.row.training_id
            );
            newData[teamName][rowIndex].ut_status = e.target.value;
            setData(newData);
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

  const rows =
    selectedTeam === "ALL"
      ? Object.values(data)
          .flat()
          .map((row, i) => ({ ...row, id: i }))
      : (data[selectedTeam] || []).map((row, i) => ({ ...row, id: i }));

  return (
    <div className="dashboard-container">

      <div className="kpi-container">
        <div className="kpi-card" style={{ background: '#f796a5ff',  }}>Overdue: {KPIs.overdue}</div>
        <div className="kpi-card" style={{ background: '#9bf8c5ff', }}>Completed: {KPIs.completed}</div>
        <div className="kpi-card" style={{ background: '#eff7b8ff', }}>Pending: {KPIs.pending}</div>
        <div className="kpi-card">Total Trainings: {KPIs.total}</div>
      </div>

      <div className="user-layout">
        <div className="user-left">
          <div className="user-info-box" style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px" }}>
            <h3 style={{ margin: 0 }}>Member Dashboard</h3>
            <p style={{ margin: "5px 0" }}><b>User ID:</b> {userId}</p>
            <p style={{ margin: "5px 0" }}><b>First Name:</b> {userFirstName}</p>
            <p style={{ margin: "5px 0" }}><b>Last Name:</b> {userLastName}</p>
          </div>
          <div className="user-select">
            <h3>Select Team</h3>
            <Select
              fullWidth
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <MenuItem value="ALL">All Teams</MenuItem>
              {Object.keys(data).map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <div className="user-right">
          <DataGrid
            rows={rows}
            columns={trainingColumns}
            autoHeight
            pageSize={10}
          />
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
