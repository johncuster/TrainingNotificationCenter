import { useState, useEffect } from "react";
import "../adminView/adminGlobal.css";

const MemberDashboard = () => {
  const [data, setData] = useState({});
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetch(`http://localhost:8081/member/${userId}`)
      .then((res) => res.json())
      .then((rows) => {
        const grouped = {};
        rows.forEach((row) => {
          if (!grouped[row.team_name]) grouped[row.team_name] = [];
          grouped[row.team_name].push(row);
        });
        setData(grouped);
      })
      .catch((err) => console.error("Error loading dashboard:", err));
  }, [userId]);

  const handleUpdate = (teamName, index, field, value) => {
    const updatedData = { ...data };
    updatedData[teamName][index][field] = value;

    if (field === "ut_status") {
      updatedData[teamName][index].ut_completedate =
        value === "Completed" ? new Date() : null;
    }

    setData(updatedData);
  };
const saveUpdate = (row) => {
    return fetch(`http://localhost:8081/user_training/update/${row.usertraining_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ut_status: row.ut_status,
        usertraining_id : row.usertraining_id,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.error("Error updating training:", err));
  };

  const handleSaveAll = async () => {
    try {
      const allRows = Object.values(data).flat();

      if (allRows.length === 0) {
        alert("No training data to save.");
        return;
      }

      await Promise.all(allRows.map((row) => saveUpdate(row)));

      alert("All changes saved successfully!");
    } catch (err) {
      console.error("Error saving all changes:", err);
      alert("Failed to save changes.");
    }
  };

  const hasTraining = Object.values(data).some((teamRows) => teamRows.length > 0);

  return (
    <div className="dashboardDesign">
      <h1>MEMBER DASHBOARD</h1>
      <h2>User ID: {userId}</h2>
      <button className="tableButton" onClick={handleSaveAll}>
        Save All Changes
      </button>
      {hasTraining ? (
        Object.entries(data).map(([teamName, teamRows]) =>
          teamRows.length > 0 ? (
            <div key={teamName} className="team-table">
              <h2>Team: {teamName}</h2>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Training Title</th>
                    <th>Description</th>
                    <th>Link</th>
                    <th>Status</th>
                    <th>Assigned</th>
                    <th>Due Date</th>
                    <th>Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {teamRows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.training_title || "-"}</td>
                      <td>{row.training_desc || "-"}</td>
                      <td>{row.training_link || "-"}</td>
                      <td>
                        {row.ut_status ? (
                          <>
                            <select
                              value={row.ut_status}
                              onChange={(e) =>
                                handleUpdate(teamName, index, "ut_status", e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {row.ut_assigndate
                          ? new Date(row.ut_assigndate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {row.due_date
                          ? new Date(row.due_date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>
                        {row.ut_completedate
                          ? new Date(row.ut_completedate).toLocaleDateString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null
        )
      ) : (
        <p>No training data found.</p>
      )}
    </div>
  );
};

export default MemberDashboard;
