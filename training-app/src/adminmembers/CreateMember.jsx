import React, { useState} from "react";
import "../adminView/createTraining.css";

const CreateMember = ({ isOpen, onClose, onSubmit}) => {
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
        <h2>Add Member</h2>
    
        <form onSubmit={handleSubmit} className="create-form">
          <label>
            Last Name:<br/>
            <input
              className="text-input"
              type="text"
              name="user_ln"
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
              onChange={handleChange}
              required
            />
          </label>
          <label>
            User Email:<br/>
            <input
              className="text-input"
              type="text"
              name="user_email"
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

export default CreateMember;
