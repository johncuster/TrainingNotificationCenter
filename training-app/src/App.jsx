  import React from "react";
  import "./App.css";
  import { BrowserRouter, Routes, Route } from "react-router-dom";

  //components
  import AdminNavbar from "./component/AdminNavbar";
  import IsNavBar from "./component/IsNavBar.jsx";

  //pages
  import ManageTraining from "./admintraining/ManageTraining.jsx";  
  import ManageMember from "./managemembers/MemberPage.jsx";
  import ManageTeam from "./adminteam/ManageTeam"; 
  import Login from "./adminuserlogin/Login.jsx";
  import LeadDashboard from "./leadDashboard/LeadDashboard.jsx";
  //import SampleDashboard from "./TrainingTable.jsx";
  import TeamPage from "./manageteam/TeamPage.jsx";
  import TrainingPage from "./managetraining/TrainingPage.jsx";
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
            <Route path="/leadDashboard" element={<LeadDashboard />}/>
            <Route path="/memberDashboard" element={<MemberDashboard />}/>
            <Route path="/managetraining" element={<ManageTraining />} />
            <Route path="/manageteam" element={<ManageTeam />} />
            <Route path="/managemember" element={<ManageMember />} />
            {/* <Route path="/" element={<SampleDashboard />}/> */}
            <Route path="/trainings" element={<TrainingPage />} />
            <Route path="/teams" element={<TeamPage />} />

          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  export default App;