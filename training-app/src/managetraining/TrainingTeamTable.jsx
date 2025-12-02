import  { useState, useEffect } from "react";
import { DataGrid, GridToolbar  } from "@mui/x-data-grid";
import { Button, Stack, Dialog, DialogTitle, DialogContent, TextField } from "@mui/material";
import AssignTeamModal from "./AssignTeamModal.jsx";

export default function TrainingTeamTable({ trainingId, teams = [], allTeams = [], refreshTeams }) {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);
  const [openMembers, setOpenMembers] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState("");

  const [dueDates, setDueDates] = useState({}); // new: { team_id: "YYYY-MM-DD" }

    useEffect(() => {
    setSelectedTeamId(null); // reset selection when training changes
  }, [trainingId, teams]);

  const handleDelete = async () => {
    if (!selectedTeamId) return alert("Select a team to remove");
    if (!window.confirm("Are you sure you want to remove the selected team?")) return;

    try {
      await fetch(`http://localhost:8081/team_training/${trainingId}/${selectedTeamId}`, { method: "DELETE" });
      setSelectedTeamId(null);
      await refreshTeams();
    } catch (err) {
      console.error(err);
      alert("Failed to remove team");
    }
  };

  // Double-click handler to show members
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
      alert("Failed to load members");
    }
  };

  // New: handle date change
  const handleDateChange = (teamId, date) => {
    setDueDates(prev => ({ ...prev, [teamId]: date }));
  };

  // New: save due date
  const saveDueDate = async (teamId) => {
    const selectedDate = dueDates[teamId];
    if (!selectedDate) return alert("Select a due date first");

    try {
      // Update team_training
      await fetch(`http://localhost:8081/team_training/due_date/${trainingId}/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: selectedDate })
      });

      // Update user_training
      await fetch(`http://localhost:8081/user_training/due_date/${trainingId}/${teamId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: selectedDate })
      });

      alert("Due date updated successfully!");
      refreshTeams();
    } catch (err) {
      console.error("Failed to update due date:", err);
      alert("Failed to update due date");
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
        <Button variant="contained" color="error" disabled={!selectedTeamId} onClick={handleDelete}>Remove</Button>
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
                { field: "user_id", headerName: "ID", width: 100 },
                { field: "user_ln", headerName: "Last Name", flex: 1 },
                { field: "user_fn", headerName: "First Name", flex: 1 },
                { field: "ut_status", headerName: "Status", width: 150 },
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
