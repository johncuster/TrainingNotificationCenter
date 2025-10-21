import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { useMatch, useResolvedPath, Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import "./trainingAction.css";

const TrainingAction = () => {
    return(
        <div className="actionHeader" >
            <div className="linkContainer">
                <CustomLink to="/managetraining">Create</CustomLink>
                <CustomLink to="/managetraining">Edit</CustomLink>                
                <CustomLink to="/managetraining">Delete</CustomLink>
            </div>
            Create Edit Delete
        </div>  
    )
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

export default TrainingAction;