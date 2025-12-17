import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Stack,
  Box,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import AddMemberModal from "./AddMemberModal";
import { showAlert } from "../component/alert";

export default function MemberTable({ team }) {
  const [members, setMembers] = useState([]);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [searchText, setSearchText] = useState("");

  // NEW STATES
  const [openTrainings, setOpenTrainings] = useState(false);
  const [memberTrainings, setMemberTrainings] = useState([]);
  const [selectedMemberName, setSelectedMemberName] = useState("");

  // Function to load members and determine their display roles
  const loadMembers = async () => {
    if (!team) {
      setMembers([]);
      setSelectedMemberId(null);
      return;
    }

    try {
      const membersRes = await fetch(
        `http://localhost:8081/team/${team.team_id}/members`
      );
      const membersData = await membersRes.json();

      const leadDataPromises = membersData.map((m) =>
        fetch(`http://localhost:8081/team_lead/${m.user_id}`)
          .then((res) => res.json())
          .catch(() => [])
      );
      const allLeadTeams = await Promise.all(leadDataPromises);

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

  // NEW: Double-click handler → show trainings
  const handleRowDoubleClick = async (params) => {
    const userId = params.row.user_id;
    const name = `${params.row.user_fn} ${params.row.user_ln}`;

    try {
      const res = await fetch(
        `http://localhost:8081/user_training/member/${selectedMemberId}`
      );
      const data = await res.json();

      setMemberTrainings(data);
      setSelectedMemberName(name);
      setOpenTrainings(true);
    } catch (err) {
      console.error("Failed to load member trainings:", err);
      showAlert("Failed to load member trainings", "error");
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
      {/* Header */}
      {!team && <h2>Members</h2>}
      {team && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 0 }}
        >
          {/* <Typography variant="h5">
            Members of {team.team_name}
          </Typography> */}
          <h2>{team.team_name} Members</h2>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              bgcolor: "grey.200",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Members Count: {members.length}
            </Typography>
          </Box>
        </Stack>
      )}

      {/* Actions + Search */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
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

        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Stack>

      {/* Members DataGrid */}
      <DataGrid
        rows={filteredMembers.map((m) => ({ ...m, id: m.user_id }))}
        columns={[
          { field: "user_ln", headerName: "Last Name", flex: 1 },
          { field: "user_fn", headerName: "First Name", flex: 1 },
          { field: "display_role", headerName: "Role", flex: 1 },
        ]}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => setSelectedMemberId(params.id)}
        // onRowDoubleClick={handleRowDoubleClick}
        hideFooterSelectedRowCount
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

      {/* Trainings Dialog */}
      <Dialog
        open={openTrainings}
        onClose={() => setOpenTrainings(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Trainings for {selectedMemberName}
        </DialogTitle>

        <DialogContent>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={memberTrainings.map((t, index) => ({
                ...t,
                id: index,
              }))}
              columns={[
                { field: "training_name", headerName: "Training", flex: 1 },
                { field: "team_name", headerName: "Team", flex: 1 },
                { field: "ut_status", headerName: "Status", width: 150 },
                { field: "due_date", headerName: "Due Date", width: 150 },
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
