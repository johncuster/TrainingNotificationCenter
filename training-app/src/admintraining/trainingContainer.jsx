import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../adminView/adminGlobal.css";  

const TrainingContainer = ({ data, onSelectTraining}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(40);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (onSelectTraining) {
      if (selectedRows.length === 1) {
        const selectedRow = data.find(t => t.training_id === selectedRows[0]);
        onSelectTraining(selectedRow);
      } else {
        onSelectTraining(null);
      }
    }
  }, [selectedRows, data, onSelectTraining]);
  
  const [filters] = useState({
    training_id: "",
    team: "",
    title: "",
    due_date: "",
    progress: "",
    training_status: ""
  });

  //Data Filtering Logic
  const filteredData = data.filter((row) =>
    (!filters.training_id || row.training_id.toString().includes(filters.training_id)) &&
    (!filters.team || row.team?.toLowerCase().includes(filters.team.toLowerCase())) &&
    (!filters.title || row.title?.toLowerCase().includes(filters.title.toLowerCase())) &&
    (!filters.due_date || row.due_date?.toLowerCase().includes(filters.due_date.toLowerCase())) &&
    (!filters.training_status || row.training_status?.toLowerCase().includes(filters.training_status.toLowerCase()))
  );

  //Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  //Handling Checkbox Selection Logic
  const handleCheckboxChange = (training_id) => {
    setSelectedRows((prev) =>
      prev.includes(training_id) ? prev.filter((rowId) => rowId !== training_id) : [...prev, training_id]
    );
  };

  //If Select All is checked
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = currentRows.map((row) => row.training_id);
      const newSelected = Array.from(new Set([...selectedRows, ...currentPageIds]));
      setSelectedRows(newSelected);
    } else {
      const currentPageIds = currentRows.map((row) => row.training_id);
      const newSelected = selectedRows.filter((training_id) => !currentPageIds.includes(training_id));
      setSelectedRows(newSelected);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const isAllSelected = currentRows.every((row) => selectedRows.includes(row.training_id));
  const isChecked = (training_id) => selectedRows.includes(training_id);
  
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
                  <th>Assigned Team<br/><input type = "text"/></th>
                  <th>Training Title<br/><input type = "text"/></th>
                  <th>Due Date<br/><input type = "text"/></th>
                  <th>Team Progress<br/><input type = "text"/></th>                            
                  <th>Status<br/><input type = "text"/></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                //onClick={() => setSelectedRows([row.training_id])}
                <tr key={row.training_id}  className={isChecked(row.training_id) ? "active-row" : "" }>
                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.training_id)} onChange={(e) =>{ e.stopPropagation(); handleCheckboxChange(row.training_id)}}/>
                  </td>
                  <td>{row.training_id}</td>
                  <td>{row.team}</td>
                  <td>{row.title}</td>
                  <td>{new Date(row.due_date).toISOString().split('T')[0]}</td>
                  <td>{row.progress ?? 0}%</td>
                  <td>{row.training_status}</td>
                </tr>
              ))}
            </tbody>
        </table>
        <br/>

    <div className="pagination">
      <div className="rows-per-page">
        Rows per page: &nbsp;
          <select value={rowsPerPage} onChange={handleRowsPerPageChange}>{[10, 20, 30, 40].map((num) => (
                <option key={num} value={num}>{num}</option>
            ))}
          </select>
      </div>  
      <div className="page-controls">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>&nbsp;⟨⟨&nbsp;&nbsp;</button>
        &nbsp;&nbsp;<span>Page {currentPage} of {totalPages}</span>&nbsp;&nbsp;
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>&nbsp;&nbsp;⟩⟩&nbsp;</button>
      </div>
    </div>
    </div>
    </div>
    )
};

export default TrainingContainer;