import React, { useState, useEffect } from "react";
import "../adminView/updateTraining.css";

const UpdateTraining = ({ isOpen, onClose, onSubmit, initialData}) => {
    const [formData, setFormData] = useState({
        training_title: "",
        training_desc: "",
        training_link: "",
    });

    const [assignedTeams, setAssignedTeams] = useState([]);

    useEffect(() => {
        if (initialData){
            setFormData(initialData);

            fetch(`http://localhost:8081/training/${initialData.training_id}/teams`)
                .then((res) => res.json())
                .then((data) => setAssignedTeams(data))
                .catch((err) => console.error("Error fetching assigned teams:", err));
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
                <h2>Edit Training</h2>
                
                <form onSubmit={handleSubmit} className="create-form">
                <label>
                    Training Title:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="training_title"
                    value={formData.training_title}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    Description:<br/>
                    <input 
                    className="text-input"
                    type = "text"
                    name="training_desc"
                    value={formData.training_desc}
                    onChange={handleChange}
                    required
                    />
                </label>

                <label>
                    Training Link:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="training_link"
                    value={formData.training_link}
                    onChange={handleChange}
                    />
                </label>

                <br/>
                <div className="modal-buttons">
                    <button type="submit" className="create-btn">
                    Update
                    </button>
                </div>
                </form>
                <h3 style={{ marginTop: "20px" }}>Assigned Teams</h3>
                <table className = "tb_design">
                <thead>
                    <tr>
                        <th>Team ID</th>
                        <th>Team Name</th>
                    </tr>
                </thead>
                <tbody>
                    {assignedTeams.length > 0 ? (
                    assignedTeams.map((team) => (
                        <tr key={team.team_id}>
                        <td>{team.team_id}</td>
                        <td>{team.team_name}</td>
                        </tr>
                    ))
                    ) : (
                    <tr>
                        <td colSpan="2" style={{ textAlign: "center" }}>
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

export default UpdateTraining;
