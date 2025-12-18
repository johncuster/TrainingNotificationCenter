import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, TextField, Box, Typography } from "@mui/material";
import CreateMember from "./CreateMember";
import UpdateMember from "./UpdateMember";
import UserTeams from "./UserTeams";
import { showAlert } from "../component/alert"; 
import "../view/splitlayout.css";
import "../view/memberLayout.css";

export default function MemberPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [memberTeams, setMemberTeams] = useState([]);
  const [leadTeams, setLeadTeams] = useState([]);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  // ⭐ SEARCH TEXT
  const [searchText, setSearchText] = useState("");

  const loadMembers = async () => {
    try {
      const res = await fetch("http://localhost:8081/member");
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load members:", err);
      setMembers([]);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const handleRowClick = async (member) => {
    setSelectedMember(member);

    if (!member) return;

    const teamRes = await fetch(`http://localhost:8081/team/user/${member.user_id}`);
    const teamData = await teamRes.json();
    setMemberTeams(teamData);

    const leadRes = await fetch(`http://localhost:8081/team_lead/${member.user_id}`);
    const leadData = await leadRes.json();
    setLeadTeams(leadData.map(t => t.team_id));
  };

  const handleCreateSubmit = async (formData) => {
    try {
      const res = await fetch("http://localhost:8081/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Create failed");
      await loadMembers();
    } catch (err) {
      console.error(err);
      showAlert("Failed to create member", "error");
    }
  };

  const handleEditSubmit = async (formData, updatedLeadTeams) => {
    if (!selectedMember) return;

    try {
      await fetch(`http://localhost:8081/member/${selectedMember.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await fetch(`http://localhost:8081/team_lead/update/${selectedMember.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_teams: updatedLeadTeams }),
      });

      await loadMembers();
      setSelectedMember(null);
    } catch (err) {
      console.error(err);
      showAlert("Failed to update member", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedMember) return;
    if (!window.confirm(`Delete ${selectedMember.user_fn} ${selectedMember.user_ln}?`)) return;

    try {
      await fetch(`http://localhost:8081/member/${selectedMember.user_id}`, {
        method: "DELETE",
      });

      setSelectedMember(null);
      await loadMembers();
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete member", "error");
    }
  };

  const columns = [
    { field: "user_fn", headerName: "First Name", flex: 1 },
    { field: "user_ln", headerName: "Last Name", flex: 1 },
    { field: "user_role", headerName: "Role", flex: 1 },
    { field: "user_email", headerName: "Email", flex: 1 },
  ];

  const filteredMembers = members.filter((m) =>
    [m.user_fn, m.user_ln, m.user_email, m.user_role]
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="container-layout">
      <div className="left-panel">
        <h2>Members</h2>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => setOpenCreate(true)}>
              Add Member
            </Button>
            <Button
              variant="outlined"
              disabled={!selectedMember}
              onClick={() => setOpenEdit(true)}
            >
              Update Member
            </Button>
            <Button
              variant="contained"
              color="error"
              disabled={!selectedMember}
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
            sx={{ width: 200 }}
          />
        </Stack>

        <DataGrid
          rows={filteredMembers.map(m => ({ ...m, id: m.user_id }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          onRowClick={(params) => handleRowClick(params.row)}
          autoHeight
        />
      </div>
      <div className="right-panel">
        {selectedMember ? (
          <Box
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              boxShadow: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
              Member Details
            </Typography>

            <Box
              sx={{
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 2,
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.1)",
              }}
            >
              <Stack spacing={1.2}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  {selectedMember.user_fn} {selectedMember.user_ln}
                </Typography>

                <Typography variant="body1">
                  <b>Role:</b> {selectedMember.user_role}
                </Typography>

                <Typography variant="body1">
                  <b>Email:</b> {selectedMember.user_email}
                </Typography>
              </Stack>
            </Box>
            <Box
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 1.5, fontWeight: 600 }}
              >
                Team Assignments
              </Typography>

              <UserTeams
                userId={selectedMember.user_id}
                userRole={selectedMember.user_role}
                onLeadUpdate={(updatedLeadTeams) =>
                  handleEditSubmit(selectedMember, updatedLeadTeams)
                }
              />
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: "100%",
              p: 3,
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
              boxShadow: 2,
            }}
          >
            <Typography variant="h5" color="text.secondary">
              Select a Member
            </Typography>
          </Box>
        )}
      </div>

      <CreateMember
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={handleCreateSubmit}
      />

      <UpdateMember
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedMember}
        leadTeams={leadTeams}
      />
    </div>
  );
}
