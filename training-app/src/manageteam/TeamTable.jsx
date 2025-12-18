import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import CreateTeamModal from "./CreateTeamModal";
import EditTeamModal from "./EditTeamModal";
import { showAlert } from "../component/alert"; 
export default function TeamTable({ teams = [], onSelectTeam, refreshTeams }) {
  const [selection, setSelection] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);


  
  const columns = [
    // { field: "team_id", headerName: "ID", width: 90 },
    { field: "team_name", headerName: "Team Name", flex: 1 },
  ];

  const handleDelete = async () => {
    if (!selection.length) return;
    if (!window.confirm(`Delete the selected team?`)) return;

    try {
      const res = await fetch(`http://localhost:8081/team/${Number(selection[0])}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      setSelection([]);
      onSelectTeam(null);
      if (refreshTeams) await refreshTeams();
      window.location.reload();
      showAlert("Team deleted successfully", "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete team", "error");
    }
  };

  return (
    <div>
      <h2>Teams</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Add Team
        </Button>

        <Button variant="outlined" disabled={selection.length !== 1} onClick={() => setOpenEdit(true)}>
        Update Team</Button>

        <Button
          variant="contained"
          color="error"
          disabled={selection.length === 0}
          onClick={handleDelete}
        >
          Remove Team
        </Button>
      </Stack>

      <DataGrid
        rows={teams}
        columns={columns}
        getRowId={(r) => r.team_id}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => {
          setSelection([params.row.team_id]);
          onSelectTeam(params.row);
        }}
        selectionModel={selection}
      />

      <CreateTeamModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={refreshTeams}
      />

      <EditTeamModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        team={teams.find((t) => t.team_id === selection[0]) || null}
        onUpdated={refreshTeams}
      />
    </div>
  );
}
