import React, { useEffect, useState } from "react";
import TeamsAndMembers from "./TeamsAndMembers";

export default function TeamPage() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8081/team")
      .then(res => res.json())
      .then(data => {
        console.log("Fetched teams:", data);
        setTeams(data);
      })
      .catch(err => console.error("Error:", err));
  }, []);

  return <TeamsAndMembers teams={teams} />;
}
