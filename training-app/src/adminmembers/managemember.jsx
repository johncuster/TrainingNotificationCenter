import MemberContainer from "./memberContainer.jsx";    
import '../adminView/adminGlobal.css';



const AdminMember = () => {
    return (
        <main>
            <div className="titleHeader">
                <h2>Manage Members</h2>  
            </div>

            <MemberContainer />
        </main>
    )
};

export default AdminMember;