import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function VaccineBatches() {
  const [batches, setBatches] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    vaccineid: "",
    numberofvaccines: "",
    hospitalid: "",
  });

  useEffect(() => {
    fetchBatches();
    fetchVaccines();
    fetchHospitals();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccine-batches`);
      setBatches(res.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchVaccines = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccines`);
      setVaccines(res.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API_URL}/hospitals`);
      setHospitals(res.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/vaccine-batches`, formData);
      setShowForm(false);
      setFormData({ vaccineid: "", numberofvaccines: "", hospitalid: "" });
      fetchBatches();
    } catch (error) {
      console.error("Error creating batch:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this batch?")) {
      try {
        await axios.delete(`${API_URL}/vaccine-batches/${id}`);
        fetchBatches();
      } catch (error) {
        console.error("Error deleting batch:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Vaccine Batch & Stock Management</h1>
        <p className="text-muted">Monitor vaccine stock by hospital</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Batch"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Vaccine Batch</h3>
          <form onSubmit={handleSubmit}>
            <label>Vaccine</label>
            <select
              value={formData.vaccineid}
              onChange={(e) =>
                setFormData({ ...formData, vaccineid: e.target.value })
              }
              required
            >
              <option value="">Select Vaccine</option>
              {vaccines.map((v) => (
                <option key={v.vaccineid} value={v.vaccineid}>
                  {v.name}
                </option>
              ))}
            </select>

            <label>Number of Vaccines</label>
            <input
              type="number"
              min="1"
              value={formData.numberofvaccines}
              onChange={(e) =>
                setFormData({ ...formData, numberofvaccines: e.target.value })
              }
              required
            />

            <label>Hospital</label>
            <select
              value={formData.hospitalid}
              onChange={(e) =>
                setFormData({ ...formData, hospitalid: e.target.value })
              }
              required
            >
              <option value="">Select Hospital</option>
              {hospitals.map((h) => (
                <option key={h.hospitalid} value={h.hospitalid}>
                  {h.name}
                </option>
              ))}
            </select>

            <button type="submit">Create Batch</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Batch ID</th>
            <th>Vaccine</th>
            <th>Hospital</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {batches.map((batch) => (
            <tr key={batch.batchid}>
              <td>{batch.batchid}</td>
              <td>{batch.vaccine_name}</td>
              <td>{batch.hospital_name}</td>
              <td>{batch.numberofvaccines}</td>
              <td>
                <button
                  onClick={() => handleDelete(batch.batchid)}
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

export default VaccineBatches;
