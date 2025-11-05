import React, { useState } from "react";
import { useMatch, useResolvedPath, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./actionHeader.css";

const MemberAction = ({onCreate, onEdit, selectedMember, onDelete}) => {  
    const [showModal, setShowModal] = useState(false);

    return (
        <div className='actionHeader' style={{padding:0, margin:0}}>
            <nav className="action">
                <ul className="linkContainer" >
                    <a href = "#" onClick={(e) => { e.preventDefault(); onCreate(); }}>Create</a>
                    <a href = "#" className={!selectedMember ? "disabled-link" : ""} onClick={(e) => { e.preventDefault(); if(selectedMember!=null)onEdit();}}>Edit</a>
                    <a href = "#" onClick={(e) => { e.preventDefault(); onDelete();}}>Delete</a>
                </ul>
            </nav>
        </div>
    )
}

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
export default MemberAction;
