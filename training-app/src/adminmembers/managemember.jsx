import MemberContainer from "./memberContainer.jsx";    
import '../adminView/adminGlobal.css';



const AdminMember = () => {
    return (
        <main>
            <h2 className="titleHeader">Manage Members</h2>  

            <MemberContainer />
        </main>
    )
};

export default AdminMember;