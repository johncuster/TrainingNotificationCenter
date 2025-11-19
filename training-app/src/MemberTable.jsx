// MemberTable.jsx
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import AddMemberModal from "./AddMemberModal";

export default function MemberTable({ team }) {
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    setSelected([]);
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
    if (!team || !selected.length) return;
    if (!window.confirm(`Remove ${selected.length} member(s) from ${team.team_name}?`))
      return;
    try {
      // Using your earlier style: delete endpoint user_team/:teamId/:userId
      await Promise.all(
        selected.map((userId) =>
          fetch(`http://localhost:8081/user_team/${team.team_id}/${userId}`, {
            method: "DELETE",
          })
        )
      );
      // refresh members
      const res = await fetch(`http://localhost:8081/team/${team.team_id}/members`);
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
      setSelected([]);
    } catch (err) {
      console.error(err);
      alert("Failed to remove member(s)");
    }
  };

  return (
    <div style={{ width: "100%", height: 520 }}>
      <h2>{team ? `Members of ${team.team_name}` : "Select a team to view members"}</h2>

      {team && (
        <>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Button variant="contained" onClick={() => setOpenAdd(true)}>
              Add Member
            </Button>
            <Button variant="contained" color="error" disabled={selected.length === 0} onClick={handleDelete}>
              Remove Member
            </Button>
          </Stack>

          <DataGrid
            rows={members}
            columns={[
              { field: "user_id", headerName: "ID", width: 120 },
              { field: "user_ln", headerName: "Last Name", flex: 1 },
              { field: "user_fn", headerName: "First Name", flex: 1 },
            ]}
            getRowId={(r) => r.user_id}
            checkboxSelection
            onRowSelectionModelChange={(sel) => setSelected(sel)}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f0f0f0",
                fontWeight: "600",
              },
            }}
          />

          <AddMemberModal
            open={openAdd}
            onClose={() => setOpenAdd(false)}
            teamId={team.team_id}
            onAdded={async () => {
              setOpenAdd(false);
              const res = await fetch(`http://localhost:8081/team/${team.team_id}/members`);
              const data = await res.json();
              setMembers(Array.isArray(data) ? data : []);
            }}
          />
        </>
      )}
    </div>
  );
}
