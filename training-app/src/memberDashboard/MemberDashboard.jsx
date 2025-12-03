import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, MenuItem, Select } from "@mui/material";
import "../view/userlayout.css";

export default function MemberDashboard() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL"); // New state
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

      // Re-fetch latest data from the server
      fetch(`http://localhost:8081/member/${userId}`)
        .then((res) => res.json())
        .then((rows) => {
          const grouped = {};
          rows.forEach((row) => {
            if (!grouped[row.team_name]) grouped[row.team_name] = [];
            grouped[row.team_name].push(row);
          });
          setData(grouped);
        });

      alert("Saved successfully and DataGrid refreshed!");
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
      editable: true,  
      renderCell: (params) => (
        <Select
          value={params.row.ut_status || "Pending"}
          disabled={params.row.ut_completedate != null}
          autoFocus
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => {
            const teamName = params.row.team_name;
            setData((prevData) => {
              const updatedTeamRows = prevData[teamName].map((row) =>
                row.training_id === params.row.training_id
                  ? { ...row, ut_status: e.target.value }
                  : { ...row }
              );
              return { ...prevData, [teamName]: updatedTeamRows };
            });
          }}
          size="small"
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      ),
    },
    { field: "ut_assigndate", headerName: "Assigned", width: 150 },
    { field: "due_date", headerName: "Due Date", width: 150 },
    { field: "ut_completedate", headerName: "Completed", width: 150 },
  ];

  // Filter rows based on team and statusFilter
  let rows =
    selectedTeam === "ALL"
      ? Object.values(data).flat()
      : data[selectedTeam] || [];

  const today = new Date();
  if (statusFilter === "Overdue") {
    rows = rows.filter(
      (r) => r.due_date && new Date(r.due_date) < today && r.ut_status !== "Completed"
    );
  } else if (statusFilter === "Pending") {
    rows = rows.filter((r) => r.ut_status === "Pending");
  } else if (statusFilter === "Completed") {
    rows = rows.filter((r) => r.ut_status === "Completed");
  }

  rows = rows.map((row, i) => ({ ...row, id: i }));

  return (
    <div className="dashboard-container">
      <div className="kpi-container">
        <div className="kpi-card" onClick={() => setStatusFilter("ALL")} style={{ cursor: "pointer" }}>
          Total Trainings: {KPIs.total}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#f796a5ff", cursor: "pointer" }}
          onClick={() => setStatusFilter("Overdue")}
        >
          Overdue: {KPIs.overdue}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#9bf8c5ff", cursor: "pointer" }}
          onClick={() => setStatusFilter("Completed")}
        >
          Completed: {KPIs.completed}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#eff7b8ff", cursor: "pointer" }}
          onClick={() => setStatusFilter("Pending")}
        >
          Pending: {KPIs.pending}
        </div>
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
            getRowClassName={(params) => {
              const due = params.row.due_date ? new Date(params.row.due_date) : null;

              if (due && !isNaN(due.getTime()) && params.row.ut_status !== "Completed" && due < today)
                return "row-overdue";

              if (params.row.ut_status === "Pending") return "row-pending";
              
              if (params.row.ut_status === "Completed") return "row-completed";

              return "";
            }}
            sx={{
              "& .row-overdue": { backgroundColor: "#ffcccc !important" },
              "& .row-pending": { backgroundColor: "#fff3cd !important" },
              "& .row-completed": { backgroundColor: "#d4edda !important" },
            }}
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
