import { useMatch, useResolvedPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './AdminNavbar.css';

const AdminNavbar = () => {
    return (
        <header>
            <nav className="navbar">
                <ul className="navbar">
                    <CustomLink to="/managetraining">Manage Trainings</CustomLink>
                    <CustomLink to="/manageteam">Manage Teams</CustomLink>
                    <CustomLink to="/managemember">Manage Members</CustomLink>
                </ul>
            </nav>
            <div className="buttonDesign" >
                <Link to="/login" className="">
                    <button>
                        Log In
                    </button>
                </Link>

                <div style = {{color:"white"}}>|</div>

                <Link to="/signup">
                    <button>
                        Sign Up
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