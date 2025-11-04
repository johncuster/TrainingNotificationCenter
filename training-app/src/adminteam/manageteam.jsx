import React, { useState, useEffect } from "react";
import TeamContainer from "./TeamContainer.jsx";   
import TeamAction from "../component/TeamAction.jsx";
import '../adminView/adminGlobal.css';

import CreateTeamModal from "../adminteam/CreateTeam.jsx"
import UpdateTeamModal from "../adminteam/UpdateTeam.jsx"

const ManageTeam = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");
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

    const handleCreateTeam = (newTeam) => {
        fetch("http://localhost:8081/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam),
        })
            .then(res => res.json())
            .then(created => {
            setTeams(prev => [...prev, created]);
            })
            .catch((err) => { console.error("Fetch error:", err);
            });
    };

    const handleUpdateTeam = (updatedTeam) => {
        fetch(`http://localhost:8081/team/${selectedTeam.team_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeam),
        })
        .then(res => res.json())
        .then(saved => {
            setTeams(prev =>
            prev.map(t => t.team_id === saved.team_id ? saved : t)
            );
            setShowModal(false);
            window.location.reload();
        })
        .catch(console.error);
    };
  
    const handleDeleteTeam = () => {
        fetch(`http://localhost:8081/team/${selectedTeam.team_id}`, {
        method: "DELETE",
    })
        .then(res => res.json())
        .then(() => {
        setTeams(prev =>
            prev.filter(t => t.team_id !== selectedTeam.team_id)
        );
        setSelectedTeam(null);
        window.location.reload();
        })
        .catch(err => console.error("Delete error:", err));
    };

    return (
        <main>
            <h2 className="titleHeader">Manage Teams</h2>  
            <TeamAction 
                onCreate={() => {
                    setModalMode('create');
                    setShowModal(true);
                }}

                onEdit={() => {
                    if (!selectedTeam) {
                    alert("Select exactly one row to edit!");
                    return;
                    }
                    setModalMode('update');
                    setShowModal(true);
                }}

                onDelete={() => {
                    if (selectedTeam.length === 0) {
                    return alert("Select one team to delete!");
                    }

                    const confirmDelete = window.confirm("Are you sure you want to delete the selected training(s)?");
                    if (!confirmDelete) return;
                    handleDeleteTeam()
                    }
                }
                selectedTeam={selectedTeam}
            />
            <TeamContainer 
                data={teams}
                setData={setTeams}
                onSelectTeam={handleSelectTeam}
            />
            {modalMode === 'create' && (
                <CreateTeamModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setModalMode("");
                }}
                onSubmit={handleCreateTeam}
                />
             )}

             {modalMode === 'update' && (
                <UpdateTeamModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setModalMode(null);
                    }}
                onSubmit={handleUpdateTeam}
                initialData={selectedTeam}
            />
            )}
        </main>
    )
};

export default ManageTeam;