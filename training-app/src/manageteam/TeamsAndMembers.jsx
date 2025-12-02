// TeamsAndMembers.jsx
import React, { useState } from "react";
import TeamTable from "./TeamTable";
import MemberTable from "./MemberTable";
import "../view/splitlayout.css";

export default function TeamsAndMembers({ teams, refreshTeams }) {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="container-layout">
      <div className="left-panel">
        <TeamTable
          teams={teams}
          onSelectTeam={setSelectedTeam}    // gets team object or null
          refreshTeams={refreshTeams}      // to call after create/edit/delete
        />
      </div>

      <div className="right-panel">
        <MemberTable team={selectedTeam} />
      </div>
    </div>
  );
}
