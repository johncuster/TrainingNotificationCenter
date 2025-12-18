import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
} from "@mui/material";

export default function UserTeams({ userId, userRole, onLeadUpdate }) {
  const [teams, setTeams] = useState([]);
  const [leadTeams, setLeadTeams] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:8081/team/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setTeams(Array.isArray(data) ? data : []))
      .catch(console.error);

    fetch(`http://localhost:8081/team_lead/${userId}`)
      .then((res) => res.json())
      .then((data) =>
        setLeadTeams(Array.isArray(data) ? data.map((t) => t.team_id) : [])
      )
      .catch(console.error);
  }, [userId]);

  const handleAddLead = (teamId) => {
    if (!leadTeams.includes(teamId)) {
      const updated = [...leadTeams, teamId];
      setLeadTeams(updated);
      onLeadUpdate(updated);
    }
  };

  const handleRemoveLead = (teamId) => {
    if (leadTeams.includes(teamId)) {
      const updated = leadTeams.filter((id) => id !== teamId);
      setLeadTeams(updated);
      onLeadUpdate(updated);
    }
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
        Teams
      </Typography>

      {teams.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          This user is not assigned to any teams.
        </Typography>
      ) : (
        <Paper
          elevation={1}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid #ddd",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell sx={{ fontWeight: 600 }}>Team Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                {userRole === "lead" && (
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {teams.map((team) => {
                const isLead = leadTeams.includes(team.team_id);

                return (
                  <TableRow key={team.team_id}>
                    <TableCell>{team.team_name}</TableCell>
                    <TableCell>{isLead ? "Lead" : "Member"}</TableCell>

                    {userRole === "lead" && (
                      <TableCell>
                        {isLead ? (
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleRemoveLead(team.team_id)}
                          >
                            Remove as Lead
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleAddLead(team.team_id)}
                          >
                            Assign as Lead
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
