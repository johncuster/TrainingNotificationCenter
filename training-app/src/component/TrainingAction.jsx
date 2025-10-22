import { useMatch, useResolvedPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import "./actionHeader.css";
<script type="module" src="./admintrainig/modalTraining.js"></script>

const TrainingAction = () => {  
    return (
        <div className='actionHeader' style={{padding:0, margin:0}}>
            <nav className="action">
                <ul className="linkContainer" >
                    <CustomLink to="#" onClick={openModal}>Create</CustomLink>
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
    if (typeof onClick === "function") {
      e.preventDefault();
      onClick(e);
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