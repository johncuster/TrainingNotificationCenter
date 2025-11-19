  import React from "react";
  import "./App.css";
  import { BrowserRouter, Routes, Route } from "react-router-dom";

  //components
  import AdminNavbar from "./component/AdminNavbar";
  import IsNavBar from "./component/IsNavBar.jsx";

  //pages
  import ManageTraining from "./admintraining/ManageTraining.jsx";  
  import ManageMember from "./adminmembers/ManageMembers.jsx";
  import ManageTeam from "./adminteam/ManageTeam"; 
  import Login from "./adminuserlogin/Login.jsx";
  import LeadDashboard from "./leadDashboard/LeadDashboard.jsx";
  import SampleDashboard from "./TeamsAndMembers.jsx";
    import TeamPage from "./TeamPage.jsx";
  import MemberDashboard from "./memberDashboard/MemberDashboard.jsx";

  function App() {
    return (
      <BrowserRouter>
      
        <div style={{ textAlign: "center", }}>
          <IsNavBar>
           
            <AdminNavbar />
          </IsNavBar>

        <div className="pages"></div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/lead" element={<LeadDashboard />}/>
            <Route path="/member" element={<MemberDashboard />}/>
            <Route path="/managetraining" element={<ManageTraining />} />
            <Route path="/manageteam" element={<ManageTeam />} />
            <Route path="/managemember" element={<ManageMember />} />
            <Route path="/" element={<SampleDashboard />}/>
            <Route path="/teams" element={<TeamPage />} />

          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  export default App;