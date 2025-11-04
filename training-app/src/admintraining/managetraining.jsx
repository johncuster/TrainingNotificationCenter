import React, { useState, useEffect } from "react";
import CreateTrainingModal from "../admintraining/CreateTraining.jsx"
import UpdateTrainingModal from "../admintraining/UpdateTraining.jsx"
import TrainingContainer from "../admintraining/TrainingContainer.jsx"; 
import TrainingAction from "../component/TrainingAction.jsx";   
import '../adminView/adminGlobal.css';

const ManageTraining = () => {
  const [showModal, setShowModal] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const [selectedTraining, setSelectedTraining] = useState(null);  
  const [modalMode, setModalMode] = useState(null);  

  const handleSelectTraining = (training) => {
    setSelectedTraining(training);
  };

  useEffect(() => {
    fetch("http://localhost:8081/training")
      .then(res => res.json())
      .then(data => setTrainings(data))
      .catch((err) => {
    console.error("Fetch error:", err);
  });}, []);

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
          .catch((err) => { console.error("Fetch error:", err);
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
        window.location.reload();
      })
      .catch(console.error);
  };

  const handleDeleteTraining = () => {
    fetch(`http://localhost:8081/training/${selectedTraining.training_id}`, {
    method: "DELETE",
  })
    .then(res => res.json())
    .then(() => {
      setTrainings(prev =>
        prev.filter(t => t.training_id !== selectedTraining.training_id)
      );
      setSelectedTraining(null);
      window.location.reload();
    })
    .catch(err => console.error("Delete error:", err));
};
  
  return (    
    <main>
      <h2 className="titleHeader">Manage Trainings</h2> 
      
      <TrainingAction
          onCreate={() => {
            //setSelectedTraining(null);
            setModalMode('create');
            setShowModal(true);
          }}

          onEdit={() => {
            if (!selectedTraining) {
              alert("Select exactly one row to edit!");
              return;
            }
            setModalMode('update');
            setShowModal(true);
          }}
          
          onDelete={() => {
            if (selectedTraining.length === 0) {
              return alert("Select at least one training to delete!");
            }

            const confirmDelete = window.confirm("Are you sure you want to delete the selected training(s)?");
            if (!confirmDelete) return;
              handleDeleteTraining()
            }
          }
          selectedTraining={selectedTraining}
        />
      
      <TrainingContainer
        data={trainings}
        setData={setTrainings}
        onSelectTraining={handleSelectTraining}
      />

      {modalMode === 'create' && (
        <CreateTrainingModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setModalMode("");
          }}
          onSubmit={handleCreateTraining}
        />
      )}
      
      {modalMode === 'update' && (
        <UpdateTrainingModal
          isOpen={showModal}
          onClose={() => {
              setShowModal(false);
              setModalMode(null);
            }}
          onSubmit={handleUpdateTraining}
          initialData={selectedTraining}
      />
      )}
    </main>
    )
};

export default ManageTraining; 