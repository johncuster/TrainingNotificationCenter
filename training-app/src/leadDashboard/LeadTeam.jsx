import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select, TextField } from "@mui/material";
import "../view/userlayout.css";

export default function LeadTeam() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [teams, setTeams] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTraining, setSelectedTraining] = useState("ALL");
  const [searchText, setSearchText] = useState("");

  const userEmail = localStorage.getItem("user_email") || "Email";
  const userId = localStorage.getItem("user_id");
  const userFirstName = localStorage.getItem("user_fn") || "FirstName";
  const userLastName = localStorage.getItem("user_ln") || "LastName";

  useEffect(() => {
    fetch(`http://localhost:8081/team_lead/${userId}`)
      .then((res) => res.json())
      .then((rows) => setTeams(rows))
      .catch((err) => console.error("Error fetching lead teams:", err));
  }, [userId]);

  useEffect(() => {
    fetch(`http://localhost:8081/team_training/lead/${userId}/members`)
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};

        rows
          // 🔴 CHANGE #1
          // Remove members that do NOT have an assigned training
          .filter(
            (row) =>
              row.usertraining_id != null &&
              row.training_title != null
          )
          .forEach((row) => {
            if (!grouped[row.team_name]) grouped[row.team_name] = [];
            grouped[row.team_name].push(row);
          });

        setData(grouped);
      })
      .catch((err) =>
        console.error("Error fetching team training data:", err)
      );
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

  const getTrainingProgress = () => {
    const rows =
      selectedTraining === "ALL"
        ? selectedTeam === "ALL"
          ? Object.values(data).flat()
          : data[selectedTeam] || []
        : selectedTeam === "ALL"
        ? Object.values(data)
            .flat()
            .filter((r) => r.training_title === selectedTraining)
        : (data[selectedTeam] || []).filter(
            (r) => r.training_title === selectedTraining
          );

    const totalMembers = rows.length;
    const completedMembers = rows.filter(
      (r) => r.ut_status === "Completed"
    ).length;

    const progressPercent =
      totalMembers === 0
        ? 0
        : Math.round((completedMembers / totalMembers) * 100);

    return { totalMembers, completedMembers, progressPercent };
  };

  const trainingColumns = [
    { field: "team_name", headerName: "Team", flex: 2 },
    { field: "user_fn", headerName: "First Name", flex: 2 },
    { field: "user_ln", headerName: "Last Name", flex: 2 },
    { field: "training_title", headerName: "Training Title", flex: 2 },
    { field: "training_desc", headerName: "Description", flex: 2 },
    { field: "training_link", headerName: "Link", flex: 3 },
    {
      field: "ut_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const status = params.row.ut_status;
        const isOverdue =
          params.row.due_date &&
          new Date(params.row.due_date) < new Date() &&
          status !== "Completed";

        let bgColor = "transparent";

        if (isOverdue) bgColor = "#f796a5ff";
        else if (status === "Pending") bgColor = "#eff7b8ff";
        else if (status === "Completed") bgColor = "#9bf8c5ff";

        return (
          <div
            style={{
              width: "100%",
              padding: "5px 8px",
              borderRadius: "6px",
              textAlign: "center",
              backgroundColor: bgColor,
            }}
          >
            {status}
          </div>
        );
      },
    },
    { field: "due_date", headerName: "Due Date", width: 100 },
    { field: "ut_assigndate", headerName: "Assigned", width: 100 },
    { field: "ut_completedate", headerName: "Completed", width: 100 },
  ];

  const today = new Date();

  let filteredRows =
    selectedTeam === "ALL"
      ? Object.values(data).flat()
      : data[selectedTeam] || [];

  if (statusFilter === "Overdue") {
    filteredRows = filteredRows.filter(
      (r) =>
        r.due_date &&
        new Date(r.due_date) < today &&
        r.ut_status !== "Completed"
    );
  } else if (statusFilter === "Pending") {
    filteredRows = filteredRows.filter(
      (r) => r.ut_status === "Pending"
    );
  } else if (statusFilter === "Completed") {
    filteredRows = filteredRows.filter(
      (r) => r.ut_status === "Completed"
    );
  }

  if (selectedTraining !== "ALL") {
    filteredRows = filteredRows.filter(
      (r) => r.training_title === selectedTraining
    );
  }

  // 🔴 CHANGE #2
  // Final safety filter so members without training NEVER reach the grid
  filteredRows = filteredRows.filter(
    (r) => r.usertraining_id != null && r.training_title != null
  );

  // Search filter (UNCHANGED)
  if (searchText.trim() !== "") {
    filteredRows = filteredRows.filter((r) =>
      [r.user_fn, r.user_ln, r.training_title, r.training_desc, r.ut_status]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  const KPIs = {
    total: filteredRows.length,
    completed: filteredRows.filter(
      (r) => r.ut_status === "Completed"
    ).length,
    pending: filteredRows.filter(
      (r) => r.ut_status === "Pending"
    ).length,
    overdue: filteredRows.filter(
      (r) =>
        r.due_date &&
        new Date(r.due_date) < today &&
        r.ut_status !== "Completed"
    ).length,
  };

  const rows = filteredRows.map((row, i) => ({
    ...row,
    id: i,
  }));

  const allRows = Object.values(data).flat();
  const trainingTitles = Array.from(
    new Set(allRows.map((r) => r.training_title))
  );

  return (
    <div className="dashboard-container">
      <div className="kpi-container">
        <div className="kpi-card" onClick={() => setStatusFilter("ALL")}>
          Total Trainings: {KPIs.total}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#f796a5ff" }}
          onClick={() => setStatusFilter("Overdue")}
        >
          Overdue: {KPIs.overdue}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#9bf8c5ff" }}
          onClick={() => setStatusFilter("Completed")}
        >
          Completed: {KPIs.completed}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#eff7b8ff" }}
          onClick={() => setStatusFilter("Pending")}
        >
          Pending: {KPIs.pending}
        </div>
      </div>

      <div className="user-layout">
        <div className="user-left">
          <div className="user-info-box">
            <h3>My Members</h3>
            <p><b>Email:</b> {userEmail}</p>
            <p><b>First Name:</b> {userFirstName}</p>
            <p><b>Last Name:</b> {userLastName}</p>
          </div>

          {/* SEARCH — preserved */}
          <div className="user-select" style={{ marginBottom: "15px" }}>
            <h3>Search</h3>
            <TextField
                          fullWidth
                          size="small"
                          placeholder="Search"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
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

          <div className="user-select" style={{ marginTop: "15px" }}>
            <h3>Select Training</h3>
            <Select
              fullWidth
              value={selectedTraining}
              onChange={(e) => setSelectedTraining(e.target.value)}
            >
              <MenuItem value="ALL">All Trainings</MenuItem>
              {trainingTitles.map((title, idx) => (
                <MenuItem key={idx} value={title}>
                  {title}
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
        </div>
      </div>
    </div>
  );
}
