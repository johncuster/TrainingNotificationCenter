import { useMatch, useResolvedPath, Link, useNavigate  } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext';

import '../view/navbar.css';

const LeadNavBar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();        // Clear localStorage & auth state
        navigate('/login'); // Redirect to login page
    };
    return (
        <header className='navbar-header'>
            <nav className="navbar">
                <ul className="navbar">
                    <CustomLink to="/leadDashboard">Manage Trainings</CustomLink>
                    <CustomLink to="/leadTeam">Manage Team</CustomLink>
                </ul>
            </nav>
            <div className="navbar-button" >
                <Link to="/login" className="">
                    <button onClick={handleLogout}>
                        Log Out
                    </button>
                </Link>
            </div>
            
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