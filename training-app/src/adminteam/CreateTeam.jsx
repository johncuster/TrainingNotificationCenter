import React, { useState} from "react";
import "../adminView/createTraining.css";

const CreateTeam = ({ isOpen, onClose, onSubmit}) => {
  const [formData, setFormData] = useState({
    team_name: ""
  });

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
        <h2>Create Team</h2>
    
        <form onSubmit={handleSubmit} className="create-form">
          <label>
            Team Name:<br/>
            <input
              className="text-input"
              type="text"
              name="team_name"
              onChange={handleChange}
              required
            />
          </label>
          <br/>
          <div className="modal-buttons">
              <button type="submit" className="create-btn">
              Create
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTeam;
