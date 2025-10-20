import TrainingContainer from "./trainingContainer.jsx";    
import '../adminView/adminGlobal.css';

const AdminTraining = () => {
    return (    
        <main>
            <div className="titleHeader">
                <h2>Manage Trainings</h2>  
            </div>

            <TrainingContainer />
        </main>
    )
};

export default AdminTraining;