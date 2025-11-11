import React, { useState, useEffect } from "react";
import MemberContainer from "./MemberContainer.jsx";   
import MemberAction from "../component/MemberAction.jsx";
import '../adminView/adminGlobal.css';

import CreateMemberModal from "../adminmembers/CreateMember.jsx"
import UpdateMemberModal from "../adminmembers/UpdateMember.jsx"

const ManageMembers = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create");
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState(null);    
    
    const handleSelectMember = (members) => {
        setSelectedMember(members);
    };

    useEffect(() => {
        fetch("http://localhost:8081/member")
          .then(res => res.json())
          .then(data => setMembers(data))
          .catch((err) => {
        console.error("Fetch error:", err);
      });
    }, []);

    const handleCreateMember = (newMember) => {
        fetch("http://localhost:8081/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
        })
            .then(res => res.json())
            .then(created => {
            setMembers(prev => [...prev, created]);
            })
            .catch((err) => { console.error("Fetch error:", err);
            });
    };

    const handleUpdateMember = (updatedMember) => {
        fetch(`http://localhost:8081/member/${selectedMember.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMember),
        })
            .then(res => res.json())
            .then(saved => {
                setMembers(prev =>
                prev.map(t => t.user_id === saved.user_id ? saved : t)
                );
                setShowModal(false);
                window.location.reload();
        }).catch(console.error);
    };
  
    const handleDeleteMember = () => {
        fetch(`http://localhost:8081/member/${selectedMember.user_id}`, {
        method: "DELETE",
    })
        .then(res => res.json())
        .then(() => {
        setMembers(prev =>
            prev.filter(t => t.user_id !== selectedMember.user_id)
        );
        setSelectedMember(null);
        window.location.reload();
        }).catch(err => console.error("Delete error:", err));
    };

    return (
        <main>
            <h2 className="titleHeader">Manage Members</h2>  
            <MemberAction 
                onCreate={() => {
                    setModalMode('create');
                    setShowModal(true);
                }}

                onEdit={() => {
                    if (!selectedMember) {
                    alert("Select exactly one row to edit!");
                    return;
                    }
                    setModalMode('update');
                    setShowModal(true);
                }}

                onDelete={() => {
                    if (selectedMember.length === 0) {
                     return alert("Select one team to delete!");
                    }
            
                     const confirmDelete = window.confirm("Are you sure you want to delete the selected member?");
                     if (!confirmDelete) return;
                     handleDeleteMember()
                     }
                }
                selectedMember={selectedMember}
            />
            <MemberContainer 
                data={members}
                setData={setMembers}
                onSelectMember={handleSelectMember}
            />
            
            {modalMode === 'create' && (
                <CreateMemberModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setModalMode("");
                }}
                    onSubmit={handleCreateMember}
                />
             )}

            {modalMode === 'update' && (
                <UpdateMemberModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setModalMode(null);
                    }}
                    onSubmit={handleUpdateMember}
                    initialData={selectedMember}
                />
            )} 
        </main>
    )
};

export default ManageMembers;