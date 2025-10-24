import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../adminView/adminGlobal.css";  
/*
const data = [
  {
    training_id: 1,
    team: "Dev Team",
    title: "React Basics",
    due_date: "2024-11-01",
    progress: "80%",
    training_status: "Ongoing"
  },
  {
    training_id: 2,
    team: "HR",
    title: "Workplace Ethics",
    due_date: "2024-10-25",
    progress: "100%",
    training_status: "Completed"
  },
  {
    training_id: 3,
    team: "Marketing",
    title: "SEO Fundamentals",
    due_date: "2024-11-10",
    progress: "60%",
    training_status: "Ongoing"
  },
  {
    training_id: 4,
    team: "Sales",
    title: "CRM Training",
    due_date: "2024-10-30",
    progress: "90%",
    training_status: "Ongoing"
  },
  {
    training_id: 5,
    team: "IT Support",
    title: "Cybersecurity Awareness",
    due_date: "2024-11-15",
    progress: "40%",
    training_status: "Ongoing"
  }
];
*/
const TrainingContainer = ({ data, setData, onSelectTraining }) => {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);

  //For Edit Training
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    training_id: "",
    team: "",
    title: "",
    due_date: "",
    progress: "",
    training_status: ""
  });

 const handleRowClick = (training) => {
  setSelectedTraining(training);
  setSelectedRows([training.training_id]);
  if (onSelectTraining) onSelectTraining(training);
};
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

  const isAllSelected = currentRows.every((row) => selectedRows.includes(row.training_id));
  const isChecked = (training_id) => selectedRows.includes(training_id);

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
                  <th>Assigned Team<br/><input type = "text"/></th>
                  <th>Training Title<br/><input type = "text"/></th>
                  <th>Due Date<br/><input type = "text"/></th>
                  <th>Team Progress<br/><input type = "text"/></th>                            
                  <th>Status<br/><input type = "text"/></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr
  key={row.training_id}
  onClick={() => handleRowClick(row)}
  className={isChecked(row.training_id) ? "active-row" : ""}
>

                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.training_id)} onChange={() => handleCheckboxChange(row.training_id)}/>
                  </td>
                  <td>{row.training_id}</td>
                  <td>{row.team}</td>
                  <td>{row.title}</td>
                  <td>{row.due_date}</td>
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