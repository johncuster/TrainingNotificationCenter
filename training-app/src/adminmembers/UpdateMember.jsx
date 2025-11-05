import React, { useState, useEffect } from "react";
import "../adminView/updateTraining.css";

const UpdateMember = ({ isOpen, onClose, onSubmit, initialData}) => {
    const [formData, setFormData] = useState({
        user_ln: "",
        user_fn: "",
        user_role: "",
        user_email: ""
    });
        const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        if (initialData){
            setFormData(initialData);
                //fetch assigned teams
            fetch(`http://localhost:8081/member`)
                .then((res) => res.json())
                .catch((err) => console.error("Error fetching assigned teams:", err));
        }
    }, [initialData]);

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
                <h2>Edit Member</h2>
                
                <form onSubmit={handleSubmit} className="create-form">
                <label>
                    Last Name:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="user_ln"
                    value={formData.user_ln}
                    onChange={handleChange}
                    required
                    />
                </label>
                <label>
                    First Name:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="user_fn"
                    value={formData.user_fn}
                    onChange={handleChange}
                    required
                    />
                </label>
                <label>
                    User Role:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="user_role"
                    value={formData.user_role}
                    onChange={handleChange}
                    required
                    />
                </label>
                <label>
                    Email:<br/>
                    <input
                    className="text-input"
                    type="text"
                    name="user_email"
                    value={formData.user_email}
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

export default UpdateMember;
