import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateTrainingModal from "../admintraining/CreateTraining.jsx"
import TrainingContainer from "./TrainingContainer.jsx";    
import '../adminView/adminGlobal.css';

import TrainingAction from "../component/TrainingAction.jsx";

const ManageTraining = () => {
    const [showModal, setShowModal] = useState(false);
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [modalMode, setModalMode] = useState("create");

const handleSelectTraining = (training) => {
  setSelectedTraining(training);
};

    useEffect(() => {
        fetch("http://localhost:8081/training")
            .then(res => res.json())
            .then(data => setTrainings(data))
            .catch((err) => {
    console.error("Fetch error:", err);
  });
    }, []);

    const handleCreateTraining = (newTraining) => {
        fetch("http://localhost:8081/training", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTraining),
        })
            .then(res => res.json())
            .then(created => {
            setTrainings(prev => [...prev, created]);
            })
            .catch((err) => {
            console.error("Fetch error:", err);
        });
    };

    const handleUpdateTraining = (updatedTraining) => {
  fetch(`http://localhost:8081/training/${selectedTraining.training_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTraining),
  })
    .then(res => res.json())
    .then(saved => {
      setTrainings(prev =>
        prev.map(t => t.training_id === saved.training_id ? saved : t)
      );
      setShowModal(false);
    })
    .catch(console.error);
};

    return (    
        <main>
            <h2 className="titleHeader">Manage Trainings</h2> 
            <TrainingAction
  onCreate={() => {
    setModalMode("create");
    setSelectedTraining(null);
    setShowModal(true);
  }}
  onEdit={() => {
    if (!selectedTraining) return alert("Select a row first!");
    setModalMode("edit");
    setShowModal(true);
  }}
/>
<TrainingContainer
  data={trainings}
  setData={setTrainings}
  onSelectTraining={handleSelectTraining}
/>

      <CreateTrainingModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSubmit={modalMode === "create" ? handleCreateTraining : handleUpdateTraining}
  initialData={modalMode === "edit" ? selectedTraining : null}
/>
      </main>
    )
};

export default ManageTraining;