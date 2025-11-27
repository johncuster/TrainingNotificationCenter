import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack, Checkbox, FormControlLabel } from "@mui/material";
import CreateMember from "./CreateMember";
import UpdateMember from "./UpdateMember";
import UserTeams from "./UserTeams";

import "./memberLayout.css";

export default function MemberPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  const [memberTeams, setMemberTeams] = useState([]);       // ⭐ teams user is in
  const [leadTeams, setLeadTeams] = useState([]);           // ⭐ teams user leads

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

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

  // 🔹 When selecting a member, load their teams + lead assignments
  const handleRowClick = async (member) => {
    setSelectedMember(member);

    if (!member) return;

    // fetch teams they are part of
    const teamRes = await fetch(`http://localhost:8081/team/user/${member.user_id}`);
    const teamData = await teamRes.json();
    setMemberTeams(teamData);

    // fetch teams they lead
    const leadRes = await fetch(`http://localhost:8081/team_lead/${member.user_id}`);
    const leadData = await leadRes.json();
    setLeadTeams(leadData.map(t => t.team_id)); // just IDs
  };

  // CREATE
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
      alert("Failed to create member");
    }
  };

  // UPDATE MEMBER + TEAM LEADS
  const handleEditSubmit = async (formData, updatedLeadTeams) => {
    if (!selectedMember) return;

    try {
      // update member details
      await fetch(`http://localhost:8081/member/${selectedMember.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // update lead assignments
      await fetch(`http://localhost:8081/team_lead/update/${selectedMember.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead_teams: updatedLeadTeams }),
      });

      await loadMembers();
      setSelectedMember(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update member");
    }
  };

  // DELETE
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
      alert("Failed to delete member");
    }
  };

  const columns = [
    { field: "user_id", headerName: "ID", width: 90 },
    { field: "user_ln", headerName: "Last Name", flex: 1 },
    { field: "user_fn", headerName: "First Name", flex: 1 },
    { field: "user_role", headerName: "Role", flex: 1 },
    { field: "user_email", headerName: "Email", flex: 1 },
  ];

  // Toggle lead assignment from right panel
  const toggleLeadTeam = (teamId) => {
    setLeadTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  return (
    <div className="members-layout">

      {/* LEFT PANEL */}
      <div className="left-panel">
        <h2>Members</h2>
        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
          <Button variant="contained" onClick={() => setOpenCreate(true)}>Add Member</Button>
          <Button variant="outlined" disabled={!selectedMember} onClick={() => setOpenEdit(true)}>Edit</Button>
          <Button variant="contained" color="error" disabled={!selectedMember} onClick={handleDelete}>Delete</Button>
        </Stack>

        <DataGrid
          rows={members.map(m => ({ ...m, id: m.user_id }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          onRowClick={(params) => handleRowClick(params.row)}
          autoHeight
        />
      </div>
{/* RIGHT PANEL */}
<div className="right-panel">
  {selectedMember ? (
    <>
      <h3>Selected Member</h3>
      <p><b>Last Name:</b> {selectedMember.user_ln}</p>
      <p><b>First Name:</b> {selectedMember.user_fn}</p>
      <p><b>Role:</b> {selectedMember.user_role}</p>
      <p><b>Email:</b> {selectedMember.user_email}</p>

      <hr />

      {/* Teams the user belongs to */}
      <UserTeams
        userId={selectedMember.user_id}
        userRole={selectedMember.user_role}
        onLeadUpdate={(updatedLeadTeams) => handleEditSubmit(selectedMember, updatedLeadTeams)}
      />
    </>
  ) : (
    <h2>Select a member to see details</h2>
  )}
</div>


      {/* MODALS */}
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
