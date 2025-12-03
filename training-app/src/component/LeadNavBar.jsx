import { useMatch, useResolvedPath, Link, useNavigate  } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext';
import ChangePasswordModal from './ChangePasswordModal';
import { useState } from 'react';
import logo from "../resources/infor-bgless.png";

import '../view/navbar.css';

const LeadNavBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout();        // Clear localStorage & auth state
        navigate('/login'); // Redirect to login page
    };
    return (
        <header className='navbar-header'>
            <div className="navbar-left">
                <div className="brand">
                    <img src={logo} alt="Logo" className="logo" />
                </div>
            <nav className="navbar">
                <ul className="navbar">
                    <CustomLink to="/leadDashboard">My Trainings</CustomLink>
                    <CustomLink to="/leadTeam">My Teams</CustomLink>
                </ul>
            </nav>
            </div>
            <div className="navbar-button" >
                
                <button onClick={() => setIsModalOpen(true)}>
                    Change Password
                </button>
                <Link to="/login" className="">
                    <button onClick={handleLogout}>
                        Log Out
                    </button>
                </Link>
            </div>
            {isModalOpen && (
                            <ChangePasswordModal onClose={() => setIsModalOpen(false)} />
                        )}
        </header>
    );
};

const CustomLink = ({ to, children, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
};

CustomLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default LeadNavBar;