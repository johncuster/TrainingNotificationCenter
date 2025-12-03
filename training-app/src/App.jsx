  import React from "react";
  import "./App.css";
  import { BrowserRouter, Routes, Route } from "react-router-dom";

  //components
  import AdminNavbar from "./component/AdminNavbar";
  import IsNavBar from "./component/IsNavBar.jsx";

  //pages
  import MemberPage from "./managemembers/MemberPage.jsx";
  import Login from "./login/Login.jsx";
  import LeadDashboard from "./leadDashboard/LeadDashboard.jsx";
  import LeadTeam from "./leadDashboard/LeadTeam.jsx";
  //import SampleDashboard from "./TrainingTable.jsx";
  import TeamPage from "./manageteam/TeamPage.jsx";
  import TrainingPage from "./managetraining/TrainingPage.jsx";
  import MemberDashboard from "./memberDashboard/MemberDashboard.jsx";

  import { AuthProvider } from "./AuthContext";
  import ProtectedRoute from "./ProtectedRoute";
  

  function App() {
    return (
      <BrowserRouter>
      <AuthProvider>
      
        <div style={{ textAlign: "center", }}>
          <IsNavBar>
           
            <AdminNavbar />
          </IsNavBar>
        </div>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Login />}/>
            <Route path="/leadDashboard" element={<ProtectedRoute allowedRoles={["lead"]}><LeadDashboard /></ProtectedRoute>}/>
            <Route path="/leadTeam" element={<ProtectedRoute allowedRoles={["lead"]}><LeadTeam /></ProtectedRoute>}/>
            <Route path="/memberDashboard" element={<ProtectedRoute allowedRoles={["member"]}><MemberDashboard /></ProtectedRoute>}/>
            <Route path="/managemember" element={<ProtectedRoute allowedRoles={["admin"]}><MemberPage /></ProtectedRoute>} />
            <Route path="/trainings" element={<ProtectedRoute allowedRoles={["admin"]}><TrainingPage /></ProtectedRoute>} />
            <Route path="/teams" element={<ProtectedRoute allowedRoles={["admin"]}><TeamPage /></ProtectedRoute>} />
          </Routes>
      </AuthProvider>
      </BrowserRouter>
    );
  }

  export default App;