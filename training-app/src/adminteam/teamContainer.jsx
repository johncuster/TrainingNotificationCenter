import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../adminView/adminGlobal.css";  

const TeamContainer = ({data, onSelectTeam}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(40);
  const [selectedRows, setSelectedRows] = useState([]);
 
  useEffect(() => {
    if (onSelectTeam) {
      if (selectedRows.length === 1) {
        const selectedRow = data.find(t => t.team_id === selectedRows[0]);
        onSelectTeam(selectedRow);
        console.log("Selected Team Row");
      } else {
        onSelectTeam(null);
        console.log("Deselected Team Row");
      }
    }}, [selectedRows, data, onSelectTeam]);
  

  const [filters] = useState({
      team_id: "",
      team_name: ""
    });

  //Data Filtering Logic
  const filteredData = data.filter((row) =>
    (!filters.team_id || row.team_id.toString().includes(filters.team_id)) &&
    (!filters.team_name || row.team_name?.toLowerCase().includes(filters.team_name.toLowerCase()))
  );

  //Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  //Handling Checkbox Selection Logic
  const handleCheckboxChange = (team_id) => {
    setSelectedRows((prev) =>
      prev.includes(team_id) ? prev.filter((rowId) => rowId !== team_id) : [...prev, team_id]
    );
  };

  //If Select All is checked
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = currentRows.map((row) => row.team_id);
      const newSelected = Array.from(new Set([...selectedRows, ...currentPageIds]));
      setSelectedRows(newSelected);
    } else {
      const currentPageIds = currentRows.map((row) => row.team_id);
      const newSelected = selectedRows.filter((team_id) => !currentPageIds.includes(team_id));
      setSelectedRows(newSelected);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const isAllSelected = currentRows.every((row) => selectedRows.includes(row.team_id));
  const isChecked = (team_id) => selectedRows.includes(team_id);

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
                  <th>Team Name<br/><input type = "text"/></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.team_id} className={isChecked(row.team_id) ? "active-row" : ""}>
                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.team_id)} onChange={() => handleCheckboxChange(row.team_id)}/>
                  </td>
                  <td>{row.team_id}</td>
                  <td>{row.team_name}</td>
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

export default TeamContainer;