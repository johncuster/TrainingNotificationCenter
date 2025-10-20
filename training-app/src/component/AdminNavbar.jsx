import { useMatch, useResolvedPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import './AdminNavbar.css';

const AdminNavbar = () => {
    return (
        <header>
            <nav>
                <ul>
                    <CustomLink to="/managetraining">Manage Trainings</CustomLink>
                    <CustomLink to="/manageteam">Manage Teams</CustomLink>
                    <CustomLink to="/managemember">Manage Members</CustomLink>
                </ul>
            </nav>
            <div className="buttonDesign" >
                <Link to="/" className="">
                    <button className="bg-orange-600 text-white p-2 rounded-lg pl-3 pr-3 cursor-pointer hover:bg-orange-700">
                        Log In
                    </button>
                </Link>

                <div style = {{color:"white"}}>|</div>

                <Link to="/signup">
                    <button className="border border-solid border-orange-600 p-2 rounded-lg pl-3 pr-3 text-orange-600 cursor-pointer hover:bg-gray-200">
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