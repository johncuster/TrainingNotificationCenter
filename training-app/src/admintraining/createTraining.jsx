import React, { useState} from "react";
import "../adminView/createTraining.css";

const CreateTraining = ({ isOpen, onClose, onSubmit}) => {
  const [formData, setFormData] = useState({
    training_title: "",
    training_desc: "",
    training_link: "",
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
        <h2>Create Training</h2>
    
        <form onSubmit={handleSubmit} className="create-form">
          <label>
            Training Title:<br/>
            <input
              className="text-input"
              type="text"
              name="training_title"
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
              onChange={handleChange}
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

export default CreateTraining;
