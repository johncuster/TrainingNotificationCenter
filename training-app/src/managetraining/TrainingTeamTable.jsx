import  { useState, useEffect } from "react";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { Button, Stack, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import AssignTeamModal from "./AssignTeamModal.jsx";
import { showAlert } from "../component/alert"; 

export default function TrainingTeamTable({ trainingId, teams = [], allTeams = [], refreshTeams }) {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  const [dueDates, setDueDates] = useState({}); 
    useEffect(() => {
    setSelectedTeamId(null);
  }, [trainingId, teams]);

  const handleDelete = async () => {
    if (!selectedTeamId) return showAlert("No team selected", "info");
    if (!window.confirm("Are you sure you want to remove the selected team?")) return;

    try {
      await fetch(`http://localhost:8081/team_training/${trainingId}/${selectedTeamId}`, { method: "DELETE" });
      setSelectedTeamId(null);
      await refreshTeams();
    } catch (err) {
      console.error(err);
      showAlert("Failed to remove team from training", "error");
    }
  };

  const handleRowDoubleClick = async (params) => {
    const teamId = params.row.team_id;
    const teamName = params.row.team_name;
    try {
      const res = await fetch(`http://localhost:8081/training/${trainingId}/members`);
      const data = await res.json();
      const membersForTeam = data.filter(m => m.team_id === teamId);
      setTeamMembers(membersForTeam);
      setSelectedTeamName(teamName);
      setOpenMembers(true);
    } catch (err) {
      console.error("Failed to load team members:", err);
      showAlert("Failed to load team members", "error");
    }
  };

  const handleDateChange = (teamId, date) => {
    setDueDates(prev => ({ ...prev, [teamId]: date }));
  };

  const saveDueDate = async (teamId) => {
    const selectedDate = dueDates[teamId];
    if (!selectedDate) return showAlert("Please select a due date", "info");

    try {
      await fetch(`http://localhost:8081/team_training/due_date/${trainingId}/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: selectedDate })
      });

      await fetch(`http://localhost:8081/user_training/due_date/${trainingId}/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: selectedDate })
      });

      showAlert ("Due date updated successfully", "success");
      refreshTeams();
    } catch (err) {
      console.error("Failed to update due date:", err);
      showAlert("Failed to update due date", "error");
    }
  };

console.log("Teams for DataGrid:", teams);

  const columns = [
    // { field: "team_id", headerName: "ID", width: 100 },
    { field: "team_name", headerName: "Team Name", flex: 1 },
    { field: "completion_percentage", headerName: "Progress (%)", width: 120, renderCell: (params) => `${params.value} %` },
    
    {
      field: "due_date",
      headerName: "Due Date",
      flex: 1,
      renderCell: (params) => (
        <TextField
          type="date"
          value={dueDates[params.row.team_id] || params.row.due_date || ""}
          onChange={(e) => handleDateChange(params.row.team_id, e.target.value)}
          size="small"
        />
      )
    },
    {
      field: "save",
      headerName: "",
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => saveDueDate(params.row.team_id)}>Save</Button>
      )
    }
    
  ];

  return (
    <div>
      
      <h2>Assigned Teams</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="contained" disabled={!trainingId} onClick={() => setOpenAssign(true)}>Add Team</Button>
        <Button variant="contained" color="error" disabled={!selectedTeamId} onClick={handleDelete}>Remove Team</Button>
      </Stack>

      <DataGrid
        rows={(teams || []).map(t => ({ ...t, id: t.team_id }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => setSelectedTeamId(params.row.team_id)}
        onRowDoubleClick={handleRowDoubleClick}
        components={{ Toolbar: GridToolbar }} 
        hideFooterSelectedRowCount
      />

      <AssignTeamModal
        open={openAssign}
        onClose={() => setOpenAssign(false)}
        trainingId={trainingId}
        onAssigned={async () => {
          setOpenAssign(false);
          await refreshTeams();
        }}
        availableTeams={allTeams.filter(t => !teams.some(a => a.team_id === t.team_id))}
      />

      <Dialog open={openMembers} onClose={() => setOpenMembers(false)} maxWidth="md" fullWidth>
        <DialogTitle>Members of {selectedTeamName}</DialogTitle>
        <DialogContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={teamMembers.map((m, index) => ({ ...m, id: index }))}
              columns={[
                // { field: "user_id", headerName: "ID", width: 100 },
                { field: "user_ln", headerName: "Last Name", flex: 1 },
                { field: "user_fn", headerName: "First Name", flex: 1 },
                {
                  field: "ut_status",
                  headerName: "Status",
                  width: 150,
                  renderCell: (params) => (
                    <span
                      style={{
                      fontWeight: 600,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor:
                        params.value === "Completed"
                          ? "#c8e6c9"
                          : params.value === "Pending"
                          ? "#fff3cd"
                          : "transparent",
                      }}
                    >
                      {params.value}
                    </span>
                  ),
                },
                // { field: "ut_status", headerName: "Status", width: 150 },
              ]}
              pageSize={5}
              autoHeight
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
