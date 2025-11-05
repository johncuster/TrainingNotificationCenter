import React from "react";
import { useState, useCallback, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "../adminView/adminGlobal.css";  

const MemberContainer = ({data, onSelectMember}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(40);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        if (onSelectMember) {
        if (selectedRows.length === 1) {
            const selectedRow = data.find(t => t.user_id === selectedRows[0]);
            onSelectMember(selectedRow);
            console.log("Selected Member Row");
        } else {
            onSelectMember(null);
            console.log("Deselected Member Row");
        }
        }}, [selectedRows, data, onSelectMember]);

    const [filters] = useState({
        user_id: "",
        user_ln: "",
        user_fn: "",
        user_role: "",
        user_email: "",
    });

    //Data Filtering Logic
    const filteredData = data.filter((row) =>
        (!filters.user_id || row.user_id.toString().includes(filters.user_id)) &&
        (!filters.user_ln || row.user_ln?.toLowerCase().includes(filters.user_ln.toLowerCase()))
    );

//Pagination Logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  //Handling Checkbox Selection Logic
  const handleCheckboxChange = (user_id) => {
    setSelectedRows((prev) =>
      prev.includes(user_id) ? prev.filter((rowId) => rowId !== user_id) : [...prev, user_id]
    );
  };

  //If Select All is checked
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const currentPageIds = currentRows.map((row) => row.user_id);
      const newSelected = Array.from(new Set([...selectedRows, ...currentPageIds]));
      setSelectedRows(newSelected);
    } else {
      const currentPageIds = currentRows.map((row) => row.user_id);
      const newSelected = selectedRows.filter((user_id) => !currentPageIds.includes(user_id));
      setSelectedRows(newSelected);
    }
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const isAllSelected = currentRows.every((row) => selectedRows.includes(row.user_id));
  const isChecked = (user_id) => selectedRows.includes(user_id);

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
                  <th>Last Name<br/><input type = "text"/></th>
                  <th>First Name<br/><input type = "text"/></th>
                  <th>User Role<br/><input type = "text"/></th>
                  <th>User Email<br/><input type = "text"/></th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.user_id} className={isChecked(row.user_id) ? "active-row" : ""}>
                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.user_id)} onChange={() => handleCheckboxChange(row.user_id)}/>
                  </td>
                  <td>{row.user_id}</td>
                  <td>{row.user_ln}</td>
                  <td>{row.user_fn}</td>
                  <td>{row.user_role}</td>
                  <td>{row.user_email}</td>
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

export default MemberContainer;