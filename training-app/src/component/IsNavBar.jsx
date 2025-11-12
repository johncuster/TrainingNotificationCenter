import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import { Children } from 'react';
import Navbar from './AdminNavbar.jsx';

const IsNavBar = (props) => {

    const location = useLocation();

    const [showNavBar, setShowNavBar] = useState(true)

    useEffect(()=> {
        console.log('this is location: ', location);

        if(location.pathname === '/login' || location.pathname === '/signup'){
            setShowNavBar(false);
        } else {
            setShowNavBar(true);
        }

    }, [location])

    return (
        <div>
            
        {showNavBar && (<>
            <div style={{background: "#22313B", height: "5%",margin: 0, padding: 0, color: "white", paddingTop: 5, paddingBottom: 0.5, textAlign:"center", fontSize:10}}>
                    <h1>Admin Dashboard</h1>
                  </div>
                  <Navbar /></>)}
        
        </div>
    );
}

export default IsNavBar;