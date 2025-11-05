import React, { useState, useEffect } from "react";
import "../adminView/updateTraining.css";

const UpdateTeam = ({ isOpen, onClose, onSubmit, initialData}) => {
    const [formData, setFormData] = useState({
        team_name: "",
    });

    const [assignedMembers, setAssignedMembers] = useState([]);
    const [allMembers, setAllMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState("");

    useEffect(() => {
        if (initialData){
            setFormData(initialData);
            
            //fetch assigned teams
            fetch(`http://localhost:8081/team/${initialData.team_id}/members`)
                .then((res) => res.json())
                .then((data) => setAssignedMembers(data))
                .catch((err) => console.error("Error fetching team members:", err));

            // Fetch all available teams
            fetch("http://localhost:8081/member")
                .then((res) => res.json())
                .then((data) => setAllMembers(data))
                .catch((err) => console.error("Error fetching teams:", err));
        }
    }, [initialData]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) { onSubmit(formData); }
        onClose();
    };

    const handleAddMember = async () => {
        if (!selectedMember) {
            alert("Please select a member to assign.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/user_team", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                
                body: JSON.stringify({
                    team_id: initialData.team_id,
                    user_id: selectedMember,
                }),
            });

            if (response.ok) {
                // Refresh assigned teams list
                const updatedMembers = await fetch(
                    `http://localhost:8081/team/${initialData.team_id}/members`
                ).then((res) => res.json());

                setAssignedMembers(updatedMembers);
                setSelectedMember("");
                alert("UPDATED TEAM");
            } 
            else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to assign team.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error assigning team");
        }
        setSelectedMember("");
    };

    const handleDeleteMember = async (userId) => {
        if (!window.confirm("Are you sure you want to remove this team?")) return;

        try {
            const response = await fetch(
                `http://localhost:8081/user_team/${initialData.team_id}/${userId}`,
            { method: "DELETE" }
            );

            if (response.ok) {
                // refresh the team list
                const updatedMembers = await fetch(
                    `http://localhost:8081/team/${initialData.team_id}/members`
                ).then((res) => res.json());
                setAssignedMembers(updatedMembers);
                alert("Team removed successfully.");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to remove team.");
            }
        } catch (error) {
            console.error("Error deleting team:", error);
            alert("Error removing team from training.");
        }
    };

    // Filter out teams that are already assigned
    const availableMembers = allMembers.filter(
     (team) => !assignedMembers.some((assigned) => assigned.user_id === team.user_id)
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button> <br/>
                
                <h2>Edit Team</h2>
                    
                <form onSubmit={handleSubmit} className="create-form">
                    <label>
                         Name:<br/>
                        <input
                            className="text-input"
                            type="text"
                            name="team_name"
                            value={formData.team_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br/>
                    <div className="modal-buttons">
                        <button type="submit" className="create-btn">
                            Update
                        </button>
                    </div>
                </form>
                
                {/* Team selection and add button */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <select
                        value={selectedMember}
                        onChange={(e) => setSelectedMember(e.target.value)}
                        className="text-input"
                    >
                    
                    <option value="">-- Select Member --</option>

                    {availableMembers.length > 0 ? (
                        availableMembers.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                            {user.user_ln}
                            </option>
                    ))) : (<option disabled>No more teams available</option>)}

                    </select>
                    
                    <button onClick={handleAddMember} className="create-btn">
                        Add Member
                    </button>
                </div>

                <table className="tb_design" style={{ marginTop: "10px" }}>
                    <thead>
                        <tr>
                            <th>Team ID</th>
                            <th>Team Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignedMembers.length > 0 ? (
                            assignedMembers.map((user) => (
                                <tr key={user.user_id}>
                                    <td>{user.user_id}</td>
                                    <td>{user.user_ln}</td>
                                    <td>
                                        <button onClick={() => handleDeleteMember(user.user_id)} className="delete-btn">
                                        Remove
                                        </button>
                                    </td>
                                </tr>
                            ))) : (
                                <tr>
                                <td colSpan="3" style={{ textAlign: "center" }}>
                                    No teams assigned to this training.
                                </td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UpdateTeam;
