import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select, TextField } from "@mui/material";
import "../view/userlayout.css";
import { showAlert } from "../component/alert"; 

export default function MemberDashboard() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [selectedTraining, setSelectedTraining] = useState("ALL"); // New state
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchText, setSearchText] = useState(""); // Search state
  const userEmail = localStorage.getItem("user_email") || "Email";
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

  const markComplete = async (row) => {
    try {
      const res = await fetch(
        `http://localhost:8081/user_training/update/${row.usertraining_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ut_status: "Completed", usertraining_id: row.usertraining_id }),
        }
      );
      if (!res.ok) throw new Error("Failed to update");

      const teamName = row.team_name;
      setData((prevData) => {
        const updatedTeamRows = prevData[teamName].map((r) =>
          r.usertraining_id === row.usertraining_id
            ? { ...r, ut_status: "Completed", ut_completedate: new Date().toISOString() }
            : r
        );
        return { ...prevData, [teamName]: updatedTeamRows };
      });

      showAlert("Training marked as Completed", "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to mark as Completed", "error");
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
  renderCell: (params) => {
    const status = params.row.ut_status || "Pending";
    const isOverdue =
      params.row.due_date &&
      new Date(params.row.due_date) < new Date() &&
      status !== "Completed";

    let bgColor = "transparent";
    let textColor = "#000";

    if (isOverdue) {
      bgColor = "#f796a5ff"; // red
      //textColor = "#a10000";
    } else if (status === "Pending") {
      bgColor = "#eff7b8ff"; // yellow
      //textColor = "#856404";
    } else if (status === "Completed") {
      bgColor = "#9bf8c5ff"; // green
      //textColor = "#155724";
    }

    return (
      <div
        style={{
          width: "100%",
          padding: "2px 4px",
          borderRadius: "6px",
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <Select
          value={status}
          disabled={params.row.ut_completedate != null}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          fullWidth
          size="small"
          style={{
            color: textColor,
            backgroundColor: "transparent",
          }}
          onChange={(e) => {
            const newValue = e.target.value;
            if (newValue === "Completed") {
              if (
                window.confirm(
                  `Mark "${params.row.training_title}" as Completed? This cannot be undone.`
                )
              )
                markComplete(params.row);
            } else {
              const teamName = params.row.team_name;
              setData((prevData) => {
                const updatedTeamRows = prevData[teamName].map((row) =>
                  row.usertraining_id === params.row.usertraining_id
                    ? { ...row, ut_status: newValue }
                    : row
                );
                return { ...prevData, [teamName]: updatedTeamRows };
              });
            }
          }}
        >
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Completed">Completed</MenuItem>
        </Select>
      </div>
    );
  },
},
    { field: "ut_assigndate", headerName: "Assigned", width: 150 },
    { field: "due_date", headerName: "Due Date", width: 150 },
    { field: "ut_completedate", headerName: "Completed", width: 150 },
  ];

  // Prepare list of training titles for filter
  const allRows = Object.values(data).flat();
  const trainingTitles = Array.from(new Set(allRows.map((r) => r.training_title)));

  // Filter rows based on team, training, status, and search
  let rows =
    selectedTeam === "ALL"
      ? Object.values(data).flat()
      : data[selectedTeam] || [];

  if (selectedTraining !== "ALL") {
    rows = rows.filter((r) => r.training_title === selectedTraining);
  }

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

  if (searchText.trim() !== "") {
    rows = rows.filter((r) =>
      [r.training_title, r.training_desc, r.team_name, r.ut_status]
        .join(" ")
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  rows = rows.map((row, i) => ({ ...row, id: i }));

  return (
    <div className="dashboard-container">
      {/* KPI CARDS */}
      <div className="kpi-container">
        <div className="kpi-card" onClick={() => setStatusFilter("ALL")} style={{ cursor: "pointer" }}>
          Total Trainings: {KPIs.total}
        </div>
        <div className="kpi-card" style={{ background: "#f796a5ff", cursor: "pointer" }} onClick={() => setStatusFilter("Overdue")}>
          Overdue: {KPIs.overdue}
        </div>
        <div className="kpi-card" style={{ background: "#9bf8c5ff", cursor: "pointer" }} onClick={() => setStatusFilter("Completed")}>
          Completed: {KPIs.completed}
        </div>
        <div className="kpi-card" style={{ background: "#eff7b8ff", cursor: "pointer" }} onClick={() => setStatusFilter("Pending")}>
          Pending: {KPIs.pending}
        </div>
      </div>

      <div className="user-layout">
        <div className="user-left">
          <div className="user-info-box" style={{ marginBottom: "15px", padding: "10px", borderRadius: "8px" }}>
            <h3 style={{ margin: 0 }}>My Trainings</h3>
            <p style={{ margin: "5px 0" }}><b>Email:</b> {userEmail}</p>
            <p style={{ margin: "5px 0" }}><b>First Name:</b> {userFirstName}</p>
            <p style={{ margin: "5px 0" }}><b>Last Name:</b> {userLastName}</p>
          </div>

          {/* Team Filter */}
          <div className="user-select">
            <h3>Select Team</h3>
            <Select
              fullWidth
              value={selectedTeam}
              onChange={(e) => {
                setSelectedTeam(e.target.value);
                setSelectedTraining("ALL"); // reset training filter
                setStatusFilter("ALL");     // reset status filter
              }}
            >
              <MenuItem value="ALL">All Teams</MenuItem>
              {Object.keys(data).map((team) => (
                <MenuItem key={team} value={team}>{team}</MenuItem>
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
                <MenuItem key={idx} value={title}>{title}</MenuItem>
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
          //   getRowClassName={(params) => {
          //     const due = params.row.due_date ? new Date(params.row.due_date) : null;
          //     if (due && !isNaN(due.getTime()) && params.row.ut_status !== "Completed" && due < today)
          //       return "row-overdue";
          //     if (params.row.ut_status === "Pending") return "row-pending";
          //     if (params.row.ut_status === "Completed") return "row-completed";
          //     return "";
          //   }}
          //   sx={{
          //     "& .row-overdue": { backgroundColor: "#ffcccc !important" },
          //     "& .row-pending": { backgroundColor: "#fff3cd !important" },
          //     "& .row-completed": { backgroundColor: "#d4edda !important" },
          //   }}
          />
        </div>
      </div>
    </div>
  );
}
