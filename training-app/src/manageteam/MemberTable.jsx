import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Box, Typography, TextField } from "@mui/material";
import AddMemberModal from "./AddMemberModal";
import { showAlert } from "../component/alert";

export default function MemberTable({ team }) {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Function to load members and determine their display roles
  const loadMembers = async () => {
    if (!team) {
      setMembers([]);
      setSelectedMemberId(null);
      return;
    }

    try {
      // Fetch team members
      const membersRes = await fetch(
        `http://localhost:8081/team/${team.team_id}/members`
      );
      const membersData = await membersRes.json();

      // Fetch lead info for each member
      const leadDataPromises = membersData.map((m) =>
        fetch(`http://localhost:8081/team_lead/${m.user_id}`)
          .then((res) => res.json())
          .catch(() => [])
      );
      const allLeadTeams = await Promise.all(leadDataPromises);

      // Map display roles
      const processed = membersData.map((m, idx) => {
        const leadTeams = allLeadTeams[idx].map((t) => t.team_id);
        let role = "Member";
        if (leadTeams.includes(team.team_id)) role = "Team Lead";
        else if (leadTeams.length > 0) role = "(Lead)";
        return { ...m, display_role: role };
      });

      setMembers(processed);
      setSelectedMemberId(null);
    } catch (err) {
      console.error("Load members failed", err);
      setMembers([]);
    }
  };

  useEffect(() => {
    loadMembers();
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

      await loadMembers();
      showAlert("Member removed from team", "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to remove member from team", "error");
    }
  };

  // Filter members based on search text
  const filteredMembers = members.filter((m) =>
    [m.user_fn, m.user_ln, m.display_role]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div>
      {/* Header with KPI on far right */}
      {team && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">Members of {team.team_name}</Typography>

          <Box
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "grey.200",
              borderRadius: 1,
              display: "inline-block",
            }}
          >
            <Typography
              variant="body2"
              color="black"
              sx={{ fontWeight: 500 }}
            >
              Members Count: {members.length}
            </Typography>
          </Box>

          </Stack>
        )}
      

      {/* Action buttons */}
      {/* Action buttons + Search */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        {/* Buttons on the left */}
        <Stack direction="row" spacing={2}>
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

        {/* Search on the right */}
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Stack>


      {/* DataGrid */}
      <DataGrid
        rows={filteredMembers.map((m) => ({ ...m, id: m.user_id }))}
        columns={[
          { field: "user_ln", headerName: "Last Name", flex: 1 },
          { field: "user_fn", headerName: "First Name", flex: 1 },
          { field: "display_role", headerName: "Role", flex: 1 },
        ]}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        getRowId={(row) => row.id}
        onRowClick={(params) => setSelectedMemberId(params.id)}
        hideFooterSelectedRowCount
        autoHeight={false}
        localeText={{ noRowsLabel: team ? "No members" : "Select a team" }}
      />

      {/* Add Member Modal */}
      {team && (
        <AddMemberModal
          open={openAdd}
          onClose={() => setOpenAdd(false)}
          teamId={team.team_id}
          onAdded={async () => {
            setOpenAdd(false);
            await loadMembers();
          }}
        />
      )}
    </div>
  );
}
