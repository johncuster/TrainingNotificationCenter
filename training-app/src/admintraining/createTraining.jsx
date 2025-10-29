import React, { useState, useEffect } from "react";
import "../adminView/createTraining.css";

const CreateTraining = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    training_link: "",
    team: "",
    training_status: "",
    progress: ""
  });

  useEffect(() => {
    if (initialData) setFormData(initialData);}, [initialData]);

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
        <h2>{initialData ? "Edit Training" : "Create Training"}</h2>
        
        {/* CREATE/EDIT FORM MODAL */}
        <form onSubmit={handleSubmit} className="create-form">
          <label>
            Training Title:<br/>
            <input
              className="text-input"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:<br/>
            <textarea 
              className="text-input"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Assigned Team:<br/>
            <input
              className="text-input"
              type="text"
              name="team"
              value={formData.team}
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
              required
            />
          </label>

          <label>
            Due Date:<br/>
            <input
              type="Date"
              name="due_date"
              value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0]: ''}
              onChange={handleChange}
              required
            />
          </label>
          <br/>
          <div className="modal-buttons">
          <button type="submit" className="create-btn">
          {initialData ? "Update" : "Create"}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTraining;
