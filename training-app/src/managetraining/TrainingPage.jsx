import React, { useEffect, useState } from "react";
import TrainingsAndTeams from "./TrainingsAndTeams";

export default function TrainingPage() {
  const [trainings, setTrainings] = useState([]);
  const [allTeams, setAllTeams] = useState([]);

  const fetchTrainings = async () => {
    try {
      const res = await fetch("http://localhost:8081/training");
      const data = await res.json();
      setTrainings(data);
    } catch (err) {
      console.error("Error fetching trainings:", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:8081/team");
      const data = await res.json();
      setAllTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchTeams();
  }, []);

  return (
    <TrainingsAndTeams
      trainings={trainings}
      allTeams={allTeams}
      refreshTrainings={fetchTrainings}
    />
  );
}
