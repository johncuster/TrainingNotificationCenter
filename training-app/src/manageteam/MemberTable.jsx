import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import AddMemberModal from "./AddMemberModal";

export default function MemberTable({ team }) {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    setSelectedMemberId(null);
    if (!team) {
      setMembers([]);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(
          `http://localhost:8081/team/${team.team_id}/members`
        );
        const data = await res.json();
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Load members failed", err);
        setMembers([]);
      }
    };
    load();
  }, [team]);

  const handleDelete = async () => {
    if (!team || !selectedMemberId) return;
    if (!window.confirm(`Remove this member from ${team.team_name}?`)) return;

    try {
      const res = await fetch(
        `http://localhost:8081/user_team/${team.team_id}/${selectedMemberId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Delete failed");

      // Refresh members list
      const refreshed = await fetch(
        `http://localhost:8081/team/${team.team_id}/members`
      ).then((r) => r.json());
      setMembers(Array.isArray(refreshed) ? refreshed : []);
      setSelectedMemberId(null);
      alert("Member removed successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

 return (
    <div style={{ width: "100%", height: 500 }}>
      <h2>{team ? `Members of ${team.team_name}` : "Team Members"}</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button
          variant="contained"
          onClick={() => setOpenAdd(true)}
          disabled={!team}
        >
          Add Member
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={!team || !selectedMemberId}
          onClick={handleDelete}
        >
          Remove Member
        </Button>
      </Stack>

      <DataGrid
        rows={members.map((m) => ({ ...m, id: m.user_id }))}
        columns={[
          { field: "user_id", headerName: "ID", width: 120 },
          { field: "user_ln", headerName: "Last Name", flex: 1 },
          { field: "user_fn", headerName: "First Name", flex: 1 },
        ]}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedMemberId(params.id)}
        hideFooterSelectedRowCount
        autoHeight={false} // ensures the grid height stays fixed
        localeText={{ noRowsLabel: team ? "No members" : "Select a team" }}
      />

      {team && (
        <AddMemberModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          teamId={team.team_id}
          onAdded={async () => {
            setOpenAdd(false);
            const refreshed = await fetch(
              `http://localhost:8081/team/${team.team_id}/members`
            ).then((r) => r.json());
            setMembers(Array.isArray(refreshed) ? refreshed : []);
          }}
        />
      )}
    </div>
  );
}
