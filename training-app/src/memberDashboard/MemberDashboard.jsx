import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import "./userLayout.css";

export default function MemberDashboard() {
  const [data, setData] = useState({});
  const [selectedTeam, setSelectedTeam] = useState(null);
  const userId = localStorage.getItem("user_id");

  // Fetch data and group by team
  useEffect(() => {
    fetch(`http://localhost:8081/member/${userId}`)
      .then((res) => res.json())
      .then((rows) => {
        console.log("Fetched member data:", rows);
        const grouped = {};
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setData(grouped);
      })
      .catch((err) => console.error("Error fetching member data:", err));
  }, [userId]);

  // Save single row
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

  // Save ALL rows
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

  const teamColumns = [{ field: "team_name", headerName: "Team Name", flex: 1 }];

  const teamRows = Object.keys(data).map((team, index) => ({
    id: index,
    team_name: team,
  }));

  // Formatter for dates
const cleanDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("en-CA"); 
  // en-CA = yyyy-mm-dd
};

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
          const newData = { ...data };
          const teamName = selectedTeam;

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

    {
    field: "ut_assigndate",
    headerName: "Assigned",
    width: 150,
  },

  {
    field: "due_date",
    headerName: "Due Date",
    width: 150,
  },

  {
    field: "ut_completedate",
    headerName: "Completed",
    width: 150,
  },
];

  return (
    <div className="user-dashboard-container">
      {/* TOP HEADER */}
      <div className="user-info-header">
        <h1>Member Dashboard</h1>
        <p>
          <b>User ID:</b> {userId}
        </p>
      </div>

      {/* PANELS */}
      <div className="user-layout">
        {/* LEFT PANEL */}
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

        {/* RIGHT PANEL */}
        <div className="user-right">
          {selectedTeam ? (
            <>
              {console.log("Selected team data:", data[selectedTeam])}
              <h2>Trainings for: {selectedTeam}</h2>
              <Button
                variant="contained"
                onClick={handleSaveAll}
                style={{ marginBottom: "10px" }}
              >
                Save All Changes
              </Button>

              <DataGrid
                rows={data[selectedTeam].map((t, i) => ({ ...t, id: i }))}
                columns={trainingColumns}
                autoHeight
                pageSize={10}
              />
            </>
          ) : (
            <p>Please select a team from the left.</p>
          )}
        </div>
      </div>
    </div>
  );
}
