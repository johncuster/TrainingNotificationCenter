import { useMatch, useResolvedPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import "./actionHeader.css";



const TrainingAction = () => {
    return (
        <div className='actionHeader' style={{padding:0, margin:0}}>
            <nav className="action">
                <ul className="linkContainer" >
                    <CustomLink to="/training">Create</CustomLink>
                    <CustomLink to="/managetraining">Edit</CustomLink>
                    <CustomLink to="/managetraining">Delete</CustomLink>
                </ul>
            </nav>
        </div>
    )
};

const CustomLink = ({ to, children, onClick, ...props }) => {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    const handleClick = (e) => {
        if (onClick) {
            
        e.preventDefault(); // stop normal link navigation
        onClick(); // call handler from parent
        }
    };


    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to}
            onClick={handleClick}
             {...props}>
                {children}
            </Link>
        </li>
    );
};

TrainingAction.propTypes = {
  onCreate: PropTypes.func,
};

CustomLink.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
};

export default TrainingAction;