import TeamContainer from "./teamContainer.jsx";    
import '../adminView/adminGlobal.css';

const AdminTeam = () => {
    return (
        <main>
            <div className="titleHeader">
                <h2>Manage Teams</h2>  
            </div>

            <TeamContainer />
        </main>
    )
};

export default AdminTeam;