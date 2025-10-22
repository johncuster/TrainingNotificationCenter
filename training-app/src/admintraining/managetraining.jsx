import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import TrainingContainer from "./trainingContainer.jsx";    
import '../adminView/adminGlobal.css';

import TrainingAction from "../component/TrainingAction.jsx";

const AdminTraining = () => {
    const [showPopup, setShowPopup] = useState(false);

  // Detect if navigation came with openCreatePopup flag
  useEffect(() => {
    if (location.state?.openCreatePopup) {
      setShowOverlay(true);
      // Clear the history state so popup doesn’t reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
    return (    
        <main>
            <h2 className="titleHeader">Manage Trainings</h2> 
            <TrainingAction />
            <TrainingContainer />
        </main>
    )
};

export default AdminTraining;