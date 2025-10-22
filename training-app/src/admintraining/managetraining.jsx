import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import TrainingContainer from "./trainingContainer.jsx";    
import '../adminView/adminGlobal.css';

import TrainingAction from "../component/TrainingAction.jsx";
import ModalDesign from "./modal.jsx";

const AdminTraining = () => {
    return (    
        <main>
            <h2 className="titleHeader">Manage Trainings</h2> 
            <TrainingAction />
            <TrainingContainer />
            <ModalDesign />
        </main>
    )
};

export default AdminTraining;