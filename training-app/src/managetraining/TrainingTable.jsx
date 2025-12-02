import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Stack } from "@mui/material";
import CreateTrainingModal from "./CreateTrainingModal";
import EditTrainingModal from "./EditTrainingModal";

export default function TrainingTable({ trainings = [], onSelectTraining, refreshTrainings }) {
  const [selectedId, setSelectedId] = useState();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const selectedTraining = trainings.find(t => t.training_id === selectedId) || null;

  const handleDelete = async () => {
    if (!selectedTraining) return;
    if (!window.confirm("Delete selected training?")) return;

    try {
      const res = await fetch(`http://localhost:8081/training/${selectedTraining.training_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      setSelectedId(null);
      onSelectTraining(null);
      await refreshTrainings();
      alert("Training deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete training");
    }
  };

  const columns = [
    // { field: "training_id", headerName: "ID", width: 90 },
    { field: "training_title", headerName: "Title", flex: 1 },
    { field: "training_desc", headerName: "Description", flex: 1 },
    { field: "training_link", headerName: "Link", flex: 1 }
  ];

  return (
    <div>
      <h2>Trainings</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>Add</Button>
        <Button variant="outlined" disabled={!selectedTraining} onClick={() => setOpenEdit(true)}>Edit</Button>
        <Button type="button" variant="contained" color="error" disabled={!selectedTraining} onClick={handleDelete}>Delete</Button>
      </Stack>

      <DataGrid
        rows={trainings.map(t => ({ ...t, id: t.training_id }))}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        onRowClick={(params) => {
          setSelectedId(params.row.training_id);
          onSelectTraining(params.row);
        }}
        hideFooterSelectedRowCount
      />

      <CreateTrainingModal
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
        onSubmit={async (newTraining) => {
          await fetch("http://localhost:8081/training", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTraining)
          });
          setOpenCreate(false);
          await refreshTrainings();
        }}
      />

      <EditTrainingModal
        isOpen={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={selectedTraining}
        onSubmit={async (updatedData) => {
          await fetch(`http://localhost:8081/training/${updatedData.training_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
          });
          setOpenEdit(false);
          await refreshTrainings();
        }}
      />
    </div>
  );
}
