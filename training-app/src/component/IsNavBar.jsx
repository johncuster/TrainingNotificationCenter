import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Children } from 'react';
import AdminNavbar from './AdminNavbar.jsx';
import MemberNavbar from './MemberNavBar.jsx';
import LeadNavbar from './LeadNavBar.jsx'

const IsNavBar = (props) => {

    const location = useLocation();

    const [showAdminNavBar, setShowNavBar] = useState(true);
    const [showMemberNavBar, setMemberNavBar] = useState(true);
    const [showLeadNavBar, setLeadNavBar] = useState(true);

    useEffect(()=> {
        console.log('this is location: ', location);

        if(location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/'){
            setShowNavBar(false);
            setMemberNavBar(false);
            setLeadNavBar(false);
        } 
        else if(location.pathname === '/memberDashboard')
        {
            setShowNavBar(false);
            setMemberNavBar(true);
            setLeadNavBar(false);
        }
        else if(location.pathname === '/leadDashboard' || location.pathname === '/leadTeam')
        {
            setShowNavBar(false);
            setMemberNavBar(false);
            setLeadNavBar(true);
        }
        else {
            setMemberNavBar(false);
            setShowNavBar(true);
            setLeadNavBar(false);
        }

    }, [location])

    return (
        <div>
            
        {showAdminNavBar == true && (<>
            <div style={{background: "#22313B", height: "1px",margin: 0, padding: 0, color: "white", paddingTop: 5, paddingBottom: 0.5, textAlign:"center", fontSize:10}}>
    
                  </div>
                  <AdminNavbar /></>)}

        {showMemberNavBar == true && (<>
            <div style={{background: "#22313B", height: "1px",margin: 0, padding: 0, color: "white", paddingTop: 5, paddingBottom: 0.5, textAlign:"center", fontSize:10}}>
               
            </div>
            <MemberNavbar /></>)}

        {showLeadNavBar == true && (<>
            <div style={{background: "#22313B", height: "1px",margin: 0, padding: 0, color: "white", paddingTop: 5, paddingBottom: 0.5, textAlign:"center", fontSize:10}}>
                
            </div>
            <LeadNavbar /></>)}
        
        </div>
    );
}

export default IsNavBar;