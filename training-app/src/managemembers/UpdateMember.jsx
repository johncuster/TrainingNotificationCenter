import React, { useState, useEffect } from "react";
import "./memberFormStyle.css";

const UpdateMember = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    user_ln: "",
    user_fn: "",
    user_role: "member",
    user_email: "",
    lead_team: "",
  });

  const [availableTeams, setAvailableTeams] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch available teams when modal opens
  useEffect(() => {
    if (isOpen) {
      fetch("http://localhost:8081/team") // your endpoint for all teams
        .then((res) => res.json())
        .then((teams) => setAvailableTeams(Array.isArray(teams) ? teams : []))
        .catch((err) => console.error("Failed to fetch teams:", err));
    }
  }, [isOpen]);

  // Populate form with initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        lead_team: initialData.lead_team || "",
        user_role: initialData.user_role || "member",
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      const payload =
        formData.user_role === "lead"
          ? formData
          : { ...formData, lead_team: "" };
      onSubmit(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Member</h2>

        <form onSubmit={handleSubmit} className="create-form">
          <label>
            Last Name:<br />
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
            First Name:<br />
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
            User Role:<br />
            <select
              className="text-input"
              name="user_role"
              value={formData.user_role}
              onChange={handleChange}
              required
            >
              <option value="member">member</option>
              <option value="lead">lead</option>
            </select>
          </label>

          {/* Show team selection only if role is lead */}
          {formData.user_role === "lead" && (
            <label>
              Team to Lead:<br />
              <select
                className="text-input"
                name="lead_team"
                value={formData.lead_team}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Team --</option>
                {availableTeams.map((team) => (
                  <option key={team.team_id} value={team.team_id}>
                    {team.team_name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Email:<br />
            <input
              className="text-input"
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              required
            />
          </label>

          <br />
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
