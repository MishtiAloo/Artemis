import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function VaccinationRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientid: "",
    batchid: "",
    doseno: 1,
    date: "",
    nextduedate: "",
  });

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    fetchBatches();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccination-records`);
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients`);
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccine-batches`);
      setBatches(res.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/vaccination-records`, formData);
      setShowForm(false);
      setFormData({
        patientid: "",
        batchid: "",
        doseno: 1,
        date: "",
        nextduedate: "",
      });
      fetchRecords();
    } catch (error) {
      console.error("Error creating record:", error);
    }
  };

  const handleDelete = async (patientId, batchId) => {
    if (window.confirm("Delete this vaccination record?")) {
      try {
        await axios.delete(
          `${API_URL}/vaccination-records/${patientId}/${batchId}`
        );
        fetchRecords();
      } catch (error) {
        console.error("Error deleting record:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Vaccination Records</h1>
        <p className="text-muted">Track doses administered to patients</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Record"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Vaccination Record</h3>
          <form onSubmit={handleSubmit}>
            <label>Patient</label>
            <select
              value={formData.patientid}
              onChange={(e) =>
                setFormData({ ...formData, patientid: e.target.value })
              }
              required
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.patientid} value={p.patientid}>
                  {p.name}
                </option>
              ))}
            </select>

            <label>Vaccine Batch</label>
            <select
              value={formData.batchid}
              onChange={(e) =>
                setFormData({ ...formData, batchid: e.target.value })
              }
              required
            >
              <option value="">Select Batch</option>
              {batches.map((b) => (
                <option key={b.batchid} value={b.batchid}>
                  Batch #{b.batchid} - {b.vaccine_name} ({b.hospital_name})
                </option>
              ))}
            </select>

            <label>Dose Number</label>
            <input
              type="number"
              min="1"
              value={formData.doseno}
              onChange={(e) =>
                setFormData({ ...formData, doseno: e.target.value })
              }
              required
            />

            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <label>Next Due Date</label>
            <input
              type="date"
              value={formData.nextduedate}
              onChange={(e) =>
                setFormData({ ...formData, nextduedate: e.target.value })
              }
            />

            <button type="submit">Create Record</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Vaccine</th>
            <th>Batch ID</th>
            <th>Dose #</th>
            <th>Date</th>
            <th>Next Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, idx) => (
            <tr key={idx}>
              <td>{record.patient_name}</td>
              <td>{record.vaccine_name}</td>
              <td>{record.batchid}</td>
              <td>{record.doseno}</td>
              <td>{new Date(record.date).toLocaleDateString()}</td>
              <td>
                {record.nextduedate
                  ? new Date(record.nextduedate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <button
                  onClick={() => handleDelete(record.patientid, record.batchid)}
                  className="danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VaccinationRecords;
