import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../adminView/adminGlobal.css";  

const data = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', age: 25 },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com', age: 30 },
  { id: 3, name: 'Pedro Reyes', email: 'pedro@example.com', age: 28 },
];

const TrainingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [filters, setFilters] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
  });

  //Data Filtering Logic
  const filteredData = data.filter((row) =>
    row.id.toString().includes(filters.id) &&
    row.name.toLowerCase().includes(filters.name.toLowerCase()) &&
    row.email.toLowerCase().includes(filters.email.toLowerCase())
  );

  //Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  //Handling Checkbox Selection Logic
  const handleCheckboxChange = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  //If Select All is checked
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = currentRows.map((row) => row.id);
      const newSelected = Array.from(new Set([...selectedRows, ...currentPageIds]));
      setSelectedRows(newSelected);
    } else {
      const currentPageIds = currentRows.map((row) => row.id);
      const newSelected = selectedRows.filter((id) => !currentPageIds.includes(id));
      setSelectedRows(newSelected);
    }
  };

  const isAllSelected = currentRows.every((row) => selectedRows.includes(row.id));
  const isChecked = (id) => selectedRows.includes(id);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

return (
    <div>   
      <div className="table_design">
        <table>
          <thead>
              <tr className="tableHeader">
                  <th className="selectColumn">
                    <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll}/>
                  </th>
                  <th className="selectColumn">ID<br/><input type = "text"/></th>
                  <th>Name<br/><input type = "text"/></th>
                  <th>Email<br/><input type = "text"/></th>
                  <th>Age<br/><input type = "text"/></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} className={isChecked(row.id) ? "active-row" : ""}>
                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.id)} onChange={() => handleCheckboxChange(row.id)}/>
                  </td>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.age}</td>
                </tr>
              ))}
            </tbody>
        </table>
        <br/>

    <div className="pagination">
      <div className="rows-per-page">
        Rows per page: &nbsp;
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>{[3, 5, 7, 10].map((num) => (
                <option key={num} value={num}>{num}</option>
            ))}
          </select>
      </div>  
      <div className="page-controls">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>&nbsp;⟨&nbsp;&nbsp;</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&nbsp;&nbsp;⟩&nbsp;</button>
      </div>
    </div>
    </div>
    </div>
    )
};

export default TrainingContainer;