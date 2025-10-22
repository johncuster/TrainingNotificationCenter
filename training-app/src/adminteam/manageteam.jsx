import TeamContainer from "./teamContainer.jsx";   
import TeamAction from "../component/TrainingAction.jsx";
import '../adminView/adminGlobal.css';


const AdminTeam = () => {
    return (
        <main>
            <h2 className="titleHeader">Manage Teams</h2>  
            <TeamAction />
            <TeamContainer />
        </main>
    )
};

export default AdminTeam;