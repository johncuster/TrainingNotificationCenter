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
    setData(updatedData);
  };

  const saveUpdate = (row) => {
    fetch(`http://localhost:8081/member/update/${row.ut_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ut_status: row.ut_status,
        ut_completedate: row.ut_completedate,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        // Optional: reload dashboard
      })
      .catch((err) => console.error("Error updating training:", err));
  };

  const hasTraining = Object.values(data).some((teamRows) => teamRows.length > 0);

  return (
    <div className="dashboardDesign">
      <h1>LEADER DASHBOARD</h1>
      <h2>User ID: {userId}</h2>

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
                            <button
                              className="tableButton"
                              onClick={() => saveUpdate(row)}
                            >
                              Save
                            </button>
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
