import TrainingContainer from "./trainingContainer.jsx";    
import '../adminView/adminGlobal.css';
import TrainingAction from "./trainingAction.jsx";

const AdminTraining = () => {
    return (    
        <main>
            <div className="titleHeader">
                <h2>Manage Trainings</h2>  
            </div>
            <TrainingAction />
            <TrainingContainer />
        </main>
    )
};

export default AdminTraining;