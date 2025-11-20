import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import AssignTeamModal from "./AssignTeamModal.jsx";

export default function TrainingTeamTable({ trainingId, teams = [], allTeams = [], refreshTeams }) {
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [openAssign, setOpenAssign] = useState(false);

  const [openMembers, setOpenMembers] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeamName, setSelectedTeamName] = useState("");

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
    //alert("DOUBLE CLICK");
    const teamId = params.row.team_id;
    const teamName = params.row.team_name;
    try {
      const res = await fetch(`http://localhost:8081/training/${trainingId}/members`);
      const data = await res.json();

      // Filter members by selected team
      const membersForTeam = data.filter(m => m.team_id === teamId);

      setTeamMembers(membersForTeam);
      setSelectedTeamName(teamName);
      setOpenMembers(true);
    } catch (err) {
      console.error("Failed to load team members:", err);
      alert("Failed to load members");
    }
  };

  const columns = [
    { field: "team_id", headerName: "ID", width: 100 },
    { field: "team_name", headerName: "Team Name", flex: 1 },
    { field: "completion_percentage", headerName: "Progress", width: 120 }
  ];

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2>Assigned Teams</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="contained" onClick={() => setOpenAssign(true)}>Add Team</Button>
        <Button variant="contained" color="error" disabled={!selectedTeamId} onClick={handleDelete}>Remove</Button>
      </Stack>

      <DataGrid
        rows={teams.map(t => ({ ...t, id: t.team_id }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => setSelectedTeamId(params.row.team_id)}
        onRowDoubleClick={handleRowDoubleClick} // double-click opens members modal
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

      {/* Modal to show members of selected team */}
      <Dialog open={openMembers} onClose={() => setOpenMembers(false)} maxWidth="md" fullWidth>
        <DialogTitle>Members of {selectedTeamName}</DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teamMembers.map(member => (
                <TableRow key={member.user_id}>
                  <TableCell>{member.user_id}</TableCell>
                  <TableCell>{member.user_ln}</TableCell>
                  <TableCell>{member.user_fn}</TableCell>
                  <TableCell>{member.ut_status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
