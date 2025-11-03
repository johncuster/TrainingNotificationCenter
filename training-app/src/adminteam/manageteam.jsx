import React, { useState, useEffect } from "react";
import TeamContainer from "./TeamContainer.jsx";   
import TeamAction from "../component/TeamAction.jsx";
import '../adminView/adminGlobal.css';

const ManageTeam = () => {
    //const [showModal, setShowModal] = useState(false);
    //const [modalMode, setModalMode] = useState("create");
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);    
    
    const handleSelectTeam = (team) => {
        setSelectedTeam(team);
    };

    useEffect(() => {
        fetch("http://localhost:8081/team")
          .then(res => res.json())
          .then(data => setTeams(data))
          .catch((err) => {
        console.error("Fetch error:", err);
      });
    }, []);

    return (
        <main>
            <h2 className="titleHeader">Manage Teams</h2>  
            <TeamAction 
                selectedTeam={selectedTeam}
            />
            <TeamContainer 
                data={teams}
                onSelectTeam={handleSelectTeam}
            />
        </main>
    )
};

export default ManageTeam;