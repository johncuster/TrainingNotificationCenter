import { useMatch, useResolvedPath, Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext';

//import './AdminNavbar.css';
import '../view/navbar.css';  

const AdminNavbar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();        // Clear localStorage & auth state
        navigate('/login'); // Redirect to login page
    };
    return (
        <header className="navbar-header">
            <nav className="navbar">
                <ul className="navbar">
                    <CustomLink to="/trainings">Manage Trainings</CustomLink>
                    <CustomLink to="/teams">Manage Teams</CustomLink>
                    <CustomLink to="/managemember">Manage Users</CustomLink>
                </ul>
            </nav>
            <div className="navbar-button" >
                <Link to="/login">
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

export default AdminNavbar;