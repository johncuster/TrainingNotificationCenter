import React, { useState, useEffect } from "react";
import "../adminView/updateTraining.css";

const UpdateTeam = ({ isOpen, onClose, onSubmit, initialData}) => {
    const [formData, setFormData] = useState({
        team_name: "",
    });

    const [assignedTeams, setAssignedTeams] = useState([]);
    const [allTeams, setAllTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");

    useEffect(() => {
        if (initialData){
            setFormData(initialData);
            //fetch assigned teams
            fetch(`http://localhost:8081/training/${initialData.training_id}/teams`)
                .then((res) => res.json())
                .then((data) => setAssignedTeams(data))
                .catch((err) => console.error("Error fetching assigned teams:", err));

            // Fetch all available teams
            fetch("http://localhost:8081/team")
                .then((res) => res.json())
                .then((data) => setAllTeams(data))
                .catch((err) => console.error("Error fetching teams:", err));
        }
    }, [initialData]);

        const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) {
        onSubmit(formData);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>&times;</button> <br/>
                <h2>Edit Team</h2>
                
                <form onSubmit={handleSubmit} className="create-form">
                <label>
                    Team Name:<br/>
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
            </div>
        </div>
    );
};

export default UpdateTeam;
