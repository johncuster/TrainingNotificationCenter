import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CreateTrainingModal from "../admintraining/CreateTraining.jsx"
import TrainingContainer from "./TrainingContainer.jsx";    
import '../adminView/adminGlobal.css';

import TrainingAction from "../component/TrainingAction.jsx";

const ManageTraining = () => {
    const [showModal, setShowModal] = useState(false);
    const [trainings, setTrainings] = useState([]);

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

    

    return (    
        <main>
            <h2 className="titleHeader">Manage Trainings</h2> 
            <TrainingAction onCreateTraining={handleCreateTraining} />

            <TrainingContainer data={trainings} setData={setTrainings} />

            <CreateTrainingModal isOpen={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreateTraining}/>
        </main>
    )
};

export default ManageTraining;