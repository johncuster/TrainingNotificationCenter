import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select } from "@mui/material";
import "../view/userlayout.css";

export default function LeadTeam() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [teams, setTeams] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTraining, setSelectedTraining] = useState("ALL"); 
  const [searchText, setSearchText] = useState(""); // Search state
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
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setData(grouped);
      })
      .catch((err) => console.error("Error fetching team training data:", err));
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
        ? Object.values(data).flat().filter((r) => r.training_title === selectedTraining)
        : (data[selectedTeam] || []).filter((r) => r.training_title === selectedTraining);

    const totalMembers = rows.length;
    const completedMembers = rows.filter((r) => r.ut_status === "Completed").length;
    const progressPercent = totalMembers === 0 ? 0 : Math.round((completedMembers / totalMembers) * 100);

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
    let textColor = "#000";

    if (isOverdue) {
      bgColor = "#f796a5ff";  // overdue red
      //textColor = "#a10000";
    } else if (status === "Pending") {
      bgColor = "#eff7b8ff";  // yellow
      //textColor = "#856404";
    } else if (status === "Completed") {
      bgColor = "#9bf8c5ff";  // green
      //textColor = "#155724";
    }

    return (
      <div
        style={{
          width: "100%",
          padding: "5px 8px",
          borderRadius: "6px",
          textAlign: "center",
          backgroundColor: bgColor,
          color: textColor,
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
      (r) => r.due_date && new Date(r.due_date) < today && r.ut_status !== "Completed"
    );
  } else if (statusFilter === "Pending") {
    filteredRows = filteredRows.filter((r) => r.ut_status === "Pending");
  } else if (statusFilter === "Completed") {
    filteredRows = filteredRows.filter((r) => r.ut_status === "Completed");
  }

  if (selectedTraining !== "ALL") {
    filteredRows = filteredRows.filter((r) => r.training_title === selectedTraining);
  }

  // Apply search filter
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
    completed: filteredRows.filter((r) => r.ut_status === "Completed").length,
    pending: filteredRows.filter((r) => r.ut_status === "Pending").length,
    overdue: filteredRows.filter(
      (r) => r.due_date && new Date(r.due_date) < today && r.ut_status !== "Completed"
    ).length,
  };

  const trainingProgress = getTrainingProgress();

  const rows = filteredRows.map((row, i) => ({ ...row, id: i }));

  const allRows = Object.values(data).flat();
  const trainingTitles = Array.from(new Set(allRows.map((r) => r.training_title)));

  return (
    <div className="dashboard-container">
      {/* KPI CARDS */}
      <div className="kpi-container">
        <div
          className="kpi-card"
          onClick={() => setStatusFilter("ALL")}
          style={{ cursor: "pointer" }}
        >
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
        {/* LEFT PANEL */}
        <div className="user-left">
          <div
            className="user-info-box"
            style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px" }}
          >
            <h3 style={{ margin: 0 }}>My Members</h3>
            <p style={{ margin: "5px 0" }}>
              <b>Email:</b> {userEmail}
            </p>
            <p style={{ margin: "5px 0" }}>
              <b>First Name:</b> {userFirstName}
            </p>
            <p style={{ margin: "5px 0" }}>
              <b>Last Name:</b> {userLastName}
            </p>
          </div>

          {/* Search Filter */}
          <div className="user-select" style={{ marginBottom: "15px" }}>
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{  boxSizing: "border-box",width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", overflow: "hidden" }}
            />
          </div>

          {/* Team Filter */}
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

          {/* Training Filter */}
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
            // getRowClassName={(params) => {
            //   const due = params.row.due_date
            //     ? new Date(params.row.due_date)
            //     : null;

            //   if (
            //     due &&
            //     !isNaN(due.getTime()) &&
            //     params.row.ut_status !== "Completed" &&
            //     due < today
            //   )
            //     return "row-overdue";

            //   if (params.row.ut_status === "Pending") return "row-pending";

            //   if (params.row.ut_status === "Completed") return "row-completed";

            //   return "";
            // }}
            // sx={{
            //   "& .row-overdue": { backgroundColor: "#ffcccc !important" },
            //   "& .row-pending": { backgroundColor: "#fff3cd !important" },
            //   "& .row-completed": { backgroundColor: "#d4edda !important" },
            // }}
          />
        </div>
      </div>
    </div>
  );
}
