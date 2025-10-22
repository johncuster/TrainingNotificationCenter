import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';

import "../adminView/adminGlobal.css";

const columns = [
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Email', selector: row => row.email },
  { name: 'Age', selector: row => row.age, sortable: true },
];

const data = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', age: 25 },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com', age: 30 },
  { id: 3, name: 'Pedro Reyes', email: 'pedro@example.com', age: 28 },
];

function TeamContainer() { 

    return (
        <div>
            <div style={{paddingLeft: '50px', paddingRight: '50px'}}>
                    <DataTable className="dataTableHeader"
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        persistTableHead
                        selectableRows
                    />
            </div>
        </div>
    )
};

export default TeamContainer;
