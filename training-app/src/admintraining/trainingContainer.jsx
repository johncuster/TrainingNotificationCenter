import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../adminView/adminGlobal.css";  

const data = [
  {
    id: 1,
    team: "Dev Team",
    trainingTitle: "React Basics",
    dueDate: "2024-11-01",
    teamProgress: "80%",
    status: "Ongoing"
  },
  {
    id: 2,
    team: "HR",
    trainingTitle: "Workplace Ethics",
    dueDate: "2024-10-25",
    teamProgress: "100%",
    status: "Completed"
  },
  {
    id: 3,
    team: "Marketing",
    trainingTitle: "SEO Fundamentals",
    dueDate: "2024-11-10",
    teamProgress: "60%",
    status: "Ongoing"
  },
  {
    id: 4,
    team: "Sales",
    trainingTitle: "CRM Training",
    dueDate: "2024-10-30",
    teamProgress: "90%",
    status: "Ongoing"
  },
  {
    id: 5,
    team: "IT Support",
    trainingTitle: "Cybersecurity Awareness",
    dueDate: "2024-11-15",
    teamProgress: "40%",
    status: "Ongoing"
  },
  {
    id: 6,
    team: "Finance",
    trainingTitle: "Budget Planning",
    dueDate: "2024-11-05",
    teamProgress: "100%",
    status: "Completed"
  },
  {
    id: 7,
    team: "Dev Team",
    trainingTitle: "Git & Version Control",
    dueDate: "2024-11-20",
    teamProgress: "20%",
    status: "Not Started"
  },
  {
    id: 8,
    team: "HR",
    trainingTitle: "Diversity & Inclusion",
    dueDate: "2024-11-12",
    teamProgress: "70%",
    status: "Ongoing"
  },
  {
    id: 9,
    team: "Marketing",
    trainingTitle: "Social Media Strategy",
    dueDate: "2024-11-18",
    teamProgress: "50%",
    status: "Ongoing"
  },
  {
    id: 10,
    team: "Sales",
    trainingTitle: "Negotiation Skills",
    dueDate: "2024-11-08",
    teamProgress: "100%",
    status: "Completed"
  }
];

const TrainingContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  
  const [filters, setFilters] = useState({
    id: "",
    team: "",
    trainingTitle: "",
    dueDate: "",
    teamProgress: "",
    status: ""
  });

  //Data Filtering Logic
  const filteredData = data.filter((row) =>
    row.id.toString().includes(filters.id) &&
    row.team.toLowerCase().includes(filters.team.toLowerCase()) &&
    row.trainingTitle.toLowerCase().includes(filters.trainingTitle.toLowerCase()) &&
    row.dueDate.toLowerCase().includes(filters.dueDate.toLowerCase()) &&
    row.teamProgress.toLowerCase().includes(filters.teamProgress.toLowerCase()) &&
    row.status.toLowerCase().includes(filters.status.toLowerCase())
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
                  <th>Assigned Team<br/><input type = "text"/></th>
                  <th>Training Title<br/><input type = "text"/></th>
                  <th>Due Date<br/><input type = "text"/></th>
                  <th>Team Progress<br/><input type = "text"/></th>                            
                  <th>Status<br/><input type = "text"/></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.id} className={isChecked(row.id) ? "active-row" : ""}>
                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.id)} onChange={() => handleCheckboxChange(row.id)}/>
                  </td>
                  <td>{row.id}</td>
                  <td>{row.team}</td>
                  <td>{row.trainingTitle}</td>
                  <td>{row.dueDate}</td>
                  <td>{row.teamProgress}</td>
                  <td>{row.status}</td>
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