  import React from "react";
  import "./App.css";
  import { BrowserRouter, Routes, Route } from "react-router-dom";

  //components
  import AdminNavbar from "./component/AdminNavbar";

  //pages
  import ManageTraining from "./admintraining/managetraining";  
  import ManageMember from "./adminmembers/managemember";
  import ManageTeam from "./adminteam/manageteam";  

  function App() {
    return (
      <BrowserRouter>
      <div style={{background: "#22313B", height: "3%",margin: 0, padding: 0, color: "white", paddingTop: 1, paddingBottom: 1, textAlign:"center", fontSize:10, textDecoration:"underline"}}>
        <h1>Admin Dashboard</h1>
      </div>
        <div style={{ textAlign: "center", }}>
          <AdminNavbar />

        <div className="pages"></div>
          <Routes>
            <Route path="/managetraining" element={<ManageTraining />} />
            <Route path="/manageteam" element={<ManageTeam />} />
            <Route path="/managemember" element={<ManageMember />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  export default App;