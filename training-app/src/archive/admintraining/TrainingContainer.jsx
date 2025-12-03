import { useState, useEffect} from 'react';
import "../adminView/adminGlobal.css";  

const TrainingContainer = ({data, onSelectTraining}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(40);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (onSelectTraining) {
      if (selectedRows.length === 1) {
        const selectedRow = data.find(t => t.training_id === selectedRows[0]);
        onSelectTraining(selectedRow);
        console.log("Selected Row");
      } else {
        onSelectTraining(null);
        console.log("Deselected Row");
      }
    }}, [selectedRows, data, onSelectTraining]);
  
  const [filters] = useState({
    training_id: "",
    training_title: "",
    training_desc: "",
    training_link: ""
  });

  //Data Filtering Logic
  const filteredData = data.filter((row) =>
    (!filters.training_id || row.training_id.toString().includes(filters.training_id)) &&
    (!filters.training_title || row.training_title?.toLowerCase().includes(filters.training_title.toLowerCase())) &&
    (!filters.training_desc || row.training_desc?.toLowerCase().includes(filters.training_desc.toLowerCase())) &&
    (!filters.training_link || row.training_link?.toLowerCase().includes(filters.training_link.toLowerCase()))
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
                  <th>Training Title<br/><input type = "text"/></th>
                  <th>Description<br/><input type = "text"/></th>
                  <th>Training Link<br/><input type = "text"/></th>                            
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row) => (
                <tr key={row.training_id}  className={isChecked(row.training_id) ? "active-row" : "" }>
                  <td className="selectColumn">
                    <input type="checkbox" checked={isChecked(row.training_id)} onChange={(e) =>{ e.stopPropagation(); handleCheckboxChange(row.training_id)}}/>
                  </td>
                  <td>{row.training_id}</td>
                  <td>{row.training_title}</td>
                  <td>{row.training_desc}</td>
                  <td>{row.training_link}</td>
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