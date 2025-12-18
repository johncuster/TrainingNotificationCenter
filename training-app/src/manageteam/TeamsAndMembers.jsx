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
          onSelectTeam={setSelectedTeam}  
          refreshTeams={refreshTeams}    
        />
      </div>

      <div className="right-panel">
        <MemberTable team={selectedTeam} />
      </div>
    </div>
  );
}
