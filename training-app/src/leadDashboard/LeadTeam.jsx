import { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { MenuItem, Select, TextField, Button } from "@mui/material";
import { LinearProgress, Box, Typography } from "@mui/material";
import { showAlert } from "../component/alert"; 
import "../view/userlayout.css";

export default function LeadTeam() {
  const [data, setData] = useState({});
  const [teams, setTeams] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [selectedTraining, setSelectedTraining] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showMemberGrid, setShowMemberGrid] = useState(false);
  const [memberRows, setMemberRows] = useState([]);

  const userEmail = localStorage.getItem("user_email") || "Email";
  const userId = localStorage.getItem("user_id");
  const userFirstName = localStorage.getItem("user_fn") || "FirstName";
  const userLastName = localStorage.getItem("user_ln") || "LastName";
  const today = new Date();

  useEffect(() => {
    fetch(`http://localhost:8081/team_lead/${userId}`)
      .then(res => res.json())
      .then(rows => setTeams(rows))
      .catch(err => console.error("Error fetching lead teams:", err));
  }, [userId]);

  useEffect(() => {
    fetch(`http://localhost:8081/team_training/lead/${userId}/members`)
      .then(res => res.json())
      .then(rows => {
        const grouped = {};
        rows.filter(r => r.usertraining_id && r.training_title)
            .forEach(r => {
              if (!grouped[r.team_name]) grouped[r.team_name] = [];
              grouped[r.team_name].push(r);
            });
        setData(grouped);
      })
      .catch(err => console.error("Error fetching team training data:", err));
  }, [userId]);

  const markComplete = async (row) => {
    try {
      const res = await fetch(`http://localhost:8081/user_training/update/${row.usertraining_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ut_status: "Completed", usertraining_id: row.usertraining_id }),
      });
      if (!res.ok) throw new Error("Failed to update");

      const teamName = row.team_name;
      setData(prevData => {
        const updatedTeamRows = prevData[teamName].map(r =>
          r.usertraining_id === row.usertraining_id
            ? { ...r, ut_status: "Completed", ut_completedate: new Date().toISOString() }
            : r
        );
        return { ...prevData, [teamName]: updatedTeamRows };
      });

      setMemberRows(prev => prev.map(r =>
        r.usertraining_id === row.usertraining_id
          ? { ...r, ut_status: "Completed", ut_completedate: new Date().toISOString() }
          : r
      ));

      showAlert("Training marked as Completed", "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to mark as Completed", "error");
    }
  };

  const summaryRows = useMemo(() => {
  return Object.keys(data).flatMap(teamName => {
    const trainings = data[teamName];

    const groupedByTraining = {};
    trainings.forEach(t => {
      if (!groupedByTraining[t.training_title]) groupedByTraining[t.training_title] = [];
      groupedByTraining[t.training_title].push(t);
    });

    return Object.keys(groupedByTraining).map(title => {
      const tRows = groupedByTraining[title];
      const completed = tRows.filter(t => t.ut_status === "Completed").length;
      const overdue = tRows.filter(t => t.due_date && new Date(t.due_date) < today && t.ut_status !== "Completed").length;
      const pending = tRows.length - completed - overdue;
      const progress = tRows.length === 0 ? 0 : Math.round((completed / tRows.length) * 100);

      const dates = tRows.map(r => r.due_date).filter(d => d);
      let mostCommonDueDate = "";
      if (dates.length > 0) {
        const freq = {};
        dates.forEach(d => freq[d] = (freq[d] || 0) + 1);
        let maxCount = 0;
        Object.entries(freq).forEach(([date, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostCommonDueDate = date;
          }
        });
      }

      return {
        id: `${teamName}-${title}`,
        team_name: teamName,
        training_title: title,
        progress,
        total: tRows.length,
        completed,
        pending,
        overdue,
        members: tRows,
        due_date: mostCommonDueDate, 
      };
    });
  });
}, [data]);

  const filteredMemberRows = useMemo(() => {
    if (!showMemberGrid) return [];
    return memberRows.filter(r => {
      const lowerSearch = searchText.toLowerCase();
      const matchesSearch = searchText.trim() === "" || [r.user_fn, r.user_ln, r.training_title, r.training_desc].join(" ").toLowerCase().includes(lowerSearch);
      const isOverdue = r.due_date && new Date(r.due_date) < today && r.ut_status !== "Completed";
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "Overdue" && isOverdue) ||
        (statusFilter === "Pending" && r.ut_status === "Pending") ||
        (statusFilter === "Completed" && r.ut_status === "Completed");
      const matchesTeam = selectedTeam === "ALL" || r.team_name === selectedTeam;
      const matchesTraining = selectedTraining === "ALL" || r.training_title === selectedTraining;
      return matchesSearch && matchesStatus && matchesTeam && matchesTraining;
    });
  }, [memberRows, searchText, statusFilter, selectedTeam, selectedTraining, showMemberGrid]);

  const memberKPIs = useMemo(() => {
    if (!showMemberGrid) return { totalTrainings: 0, completedTrainings: 0, pendingTrainings: 0, overdueTrainings: 0, progressPercent: 0 };
    const totalTrainings = memberRows.length;
    const completedTrainings = memberRows.filter(r => r.ut_status === "Completed").length;
    const overdueTrainings = memberRows.filter(r => r.due_date && new Date(r.due_date) < today && r.ut_status !== "Completed").length;
    const pendingTrainings = totalTrainings - completedTrainings - overdueTrainings;
    const progressPercent = totalTrainings === 0 ? 0 : Math.round((completedTrainings / totalTrainings) * 100);
    return { totalTrainings, completedTrainings, pendingTrainings, overdueTrainings, progressPercent };
  }, [memberRows, showMemberGrid]);

 const teamColumns = [
    { field: "team_name", headerName: "Team", flex: 2 },
    { field: "training_title", headerName: "Training Title", flex: 3 },
    { field: "due_date", headerName: "Due Date", flex: 2 },
    {
      field: "progress",
      headerName: "Progress",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.3, // space between bar and text
        }}>
        
          <LinearProgress
            variant="determinate"
            value={params.value || 0}
            sx={{ height: 15, borderRadius: 5, width: "100%" }}
          />
          <Typography variant="caption" align="center">
            {params.value || 0}% ({params.row.completed}/{params.row.total})
          </Typography>
        </Box>
      ),
    },
  ];

  const memberColumns = [
    { field: "team_name", headerName: "Team", flex: 2 },
    { field: "training_title", headerName: "Training Title", flex: 3 },
    { field: "user_fn", headerName: "First Name", flex: 2 },
    { field: "user_ln", headerName: "Last Name", flex: 2 },
    {
      field: "ut_status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        const status = params.row.ut_status || "Pending";
        const isOverdue = params.row.due_date && new Date(params.row.due_date) < today && status !== "Completed";
        let bgColor = "transparent";
        if (isOverdue) bgColor = "#f796a5ff";
        else if (status === "Pending") bgColor = "#eff7b8ff";
        else if (status === "Completed") bgColor = "#9bf8c5ff";

        return (
          <div style={{ width: "100%", padding: "2px 4px", borderRadius: "6px", backgroundColor: bgColor }}>
            <Select
              value={status}
              size="small"
              fullWidth
              disabled={params.row.ut_completedate != null}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue === "Completed") {
                  if (window.confirm(`Mark "${params.row.training_title}" as Completed?`)) markComplete(params.row);
                } else {
                  setData(prevData => {
                    const updatedTeamRows = prevData[params.row.team_name].map(r =>
                      r.usertraining_id === params.row.usertraining_id ? { ...r, ut_status: newValue } : r
                    );
                    return { ...prevData, [params.row.team_name]: updatedTeamRows };
                  });
                  setMemberRows(prev => prev.map(r =>
                    r.usertraining_id === params.row.usertraining_id ? { ...r, ut_status: newValue } : r
                  ));
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
    { field: "due_date", headerName: "Due Date", width: 100 },
    { field: "ut_assigndate", headerName: "Assigned", width: 100 },
    { field: "ut_completedate", headerName: "Completed", width: 100 },
  ];

  const handleTeamRowDoubleClick = (params) => {
    setMemberRows(params.row.members.map((r, i) => ({ ...r, id: i })));
    setShowMemberGrid(true);
    setSelectedTeam("ALL");
    setSelectedTraining("ALL");
    setStatusFilter("ALL");
    setSearchText("");
  };

  const handleReturn = () => {
    setShowMemberGrid(false);
    setSelectedTeam("ALL");
    setSelectedTraining("ALL");
    setStatusFilter("ALL");
    setSearchText("");
  };

  return (
    <div className="dashboard-container">
      <div className="kpi-container">
        <div
          className="kpi-card"
          style={{ cursor: showMemberGrid ? "pointer" : "default" }}
          onClick={() => showMemberGrid && setStatusFilter("ALL")}
        >
          Total Trainings: {memberKPIs.totalTrainings}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#f796a5ff", cursor: showMemberGrid ? "pointer" : "default" }}
          onClick={() => showMemberGrid && setStatusFilter("Overdue")}
        >
          Overdue: {memberKPIs.overdueTrainings}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#9bf8c5ff", cursor: showMemberGrid ? "pointer" : "default" }}
          onClick={() => showMemberGrid && setStatusFilter("Completed")}
        >
          Completed: {memberKPIs.completedTrainings}
        </div>
        <div
          className="kpi-card"
          style={{ background: "#eff7b8ff", cursor: showMemberGrid ? "pointer" : "default" }}
          onClick={() => showMemberGrid && setStatusFilter("Pending")}
        >
          Pending: {memberKPIs.pendingTrainings}
        </div>
      </div>

      <div className="user-layout">
        <div className="user-left">
          <div className="user-info-box">
            <h3>Information:</h3>
            <p><b>Email:</b> {userEmail}</p>
            <p><b>First Name:</b> {userFirstName}</p>
            <p><b>Last Name:</b> {userLastName}</p>
            <p><b>Team Lead of</b> {teams.map(t => t.team_name).join(", ")}</p>
          </div>

          {showMemberGrid && (
            <>
              <div className="user-select" style={{ marginBottom: "15px" }}>
                <h3>Search</h3>
                <TextField fullWidth size="small" placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
              </div>

              {/* <div className="user-select">
                <h3>Select Team</h3>
                <Select fullWidth value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                  <MenuItem value="ALL">All Teams</MenuItem>
                  {teams.map(t => <MenuItem key={t.team_id} value={t.team_name}>{t.team_name}</MenuItem>)}
                </Select>
              </div>

              <div className="user-select" style={{ marginTop: "15px" }}>
                <h3>Select Training</h3>
                <Select fullWidth value={selectedTraining} onChange={(e) => setSelectedTraining(e.target.value)}>
                  <MenuItem value="ALL">All Trainings</MenuItem>
                  {Array.from(new Set(Object.values(data).flat().map(r => r.training_title))).map((title, idx) => <MenuItem key={idx} value={title}>{title}</MenuItem>)}
                </Select>
              </div> */}
            </>
          )}
        </div>

        <div className="user-right">
          {/* <Box sx={{ height: 80, mb: 2, p: 2, borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Training Completion Progress</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LinearProgress variant="determinate" value={memberKPIs.progressPercent} sx={{ flexGrow: 1, height: 10, borderRadius: 5, backgroundColor: "#e0e0e0", "& .MuiLinearProgress-bar": { backgroundColor: memberKPIs.progressPercent === 100 ? "#4caf50" : "#1976d2" } }} />
              <Typography variant="body2" fontWeight="bold">{memberKPIs.progressPercent}%</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">{memberKPIs.completedTrainings} of {memberKPIs.totalTrainings} trainings completed</Typography>
          </Box> */}

          {showMemberGrid ? (
            <>
              <Button onClick={handleReturn} variant="outlined" style={{ marginBottom: "10px" }}>Return</Button>
              <DataGrid rows={filteredMemberRows} columns={memberColumns} autoHeight pageSize={10} />
            </>
          ) : (
            <DataGrid rows={summaryRows} columns={teamColumns} autoHeight pageSize={10} onRowDoubleClick={handleTeamRowDoubleClick} />
          )}
        </div>
      </div>
    </div>
  );
}
