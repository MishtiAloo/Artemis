import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [areas, setAreas] = useState([]);
  const [vaccineBatches, setVaccineBatches] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchAreaId, setSearchAreaId] = useState("");
  const [searchBatchId, setSearchBatchId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    areaid: "",
    capacity: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchHospitals();
    fetchAreas();
    fetchVaccineBatches();
  }, []);

  const fetchHospitals = async () => {
    try {
      const res = await axios.get(`${API_URL}/hospitals`);
      setHospitals(res.data);
    } catch (error) {
      console.error("Error fetching hospitals:", error);
    }
  };

  const fetchAreas = async () => {
    try {
      const res = await axios.get(`${API_URL}/areas`);
      setAreas(res.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const fetchVaccineBatches = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccine-batches`);
      setVaccineBatches(res.data);
    } catch (error) {
      console.error("Error fetching vaccine batches:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = {};
      if (searchName && searchName.trim() !== "")
        params.name = searchName.trim();
      if (searchAreaId) params.areaid = searchAreaId;
      if (searchBatchId) params.batchid = searchBatchId;

      const res = await axios.get(`${API_URL}/hospitals/search`, { params });
      setHospitals(res.data);
    } catch (error) {
      console.error("Error searching hospitals:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/hospitals/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/hospitals`, formData);
      }
      setShowForm(false);
      setFormData({ name: "", areaid: "", capacity: "" });
      setEditingId(null);
      fetchHospitals();
    } catch (error) {
      console.error("Error saving hospital:", error);
    }
  };

  const handleEdit = (hospital) => {
    setFormData({
      name: hospital.name,
      areaid: hospital.areaid,
      capacity: hospital.capacity,
    });
    setEditingId(hospital.hospitalid);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this hospital?")) {
      try {
        await axios.delete(`${API_URL}/hospitals/${id}`);
        fetchHospitals();
      } catch (error) {
        console.error("Error deleting hospital:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Hospital Management</h1>
        <p className="text-muted">Manage hospitals, locations, and capacity</p>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", areaid: "", capacity: "" });
          }}
        >
          {showForm ? "Cancel" : "Add New Hospital"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingId ? "Edit Hospital" : "Add New Hospital"}</h3>
          <form onSubmit={handleSubmit}>
            <label>Hospital Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <label>Area</label>
            <select
              value={formData.areaid}
              onChange={(e) =>
                setFormData({ ...formData, areaid: e.target.value })
              }
              required
            >
              <option value="">Select Area</option>
              {areas.map((area) => (
                <option key={area.areaid} value={area.areaid}>
                  {area.name}
                </option>
              ))}
            </select>

            <label>Capacity</label>
            <input
              type="number"
              min="1"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              required
            />

            <button type="submit">{editingId ? "Update" : "Create"}</button>
          </form>
        </div>
      )}

      <div className="filter-bar">
        <div>
          <label>Search by Name</label>
          <input
            type="text"
            placeholder="Hospital name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div>
          <label>Filter by Area</label>
          <select
            value={searchAreaId}
            onChange={(e) => setSearchAreaId(e.target.value)}
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area.areaid} value={area.areaid}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Filter by Vaccine Batch</label>
          <select
            value={searchBatchId}
            onChange={(e) => setSearchBatchId(e.target.value)}
          >
            <option value="">All Batches</option>
            {vaccineBatches.map((b) => (
              <option key={b.batchid} value={b.batchid}>
                #{b.batchid} - {b.vaccine_name} ({b.hospital_name})
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={() => {
            setSearchName("");
            setSearchAreaId("");
            setSearchBatchId("");
            fetchHospitals();
          }}
          className="secondary"
        >
          Reset
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Area</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map((hospital) => (
            <tr key={hospital.hospitalid}>
              <td>{hospital.hospitalid}</td>
              <td>{hospital.name}</td>
              <td>{hospital.area_name}</td>
              <td>{hospital.capacity}</td>
              <td>
                <button
                  onClick={() => handleEdit(hospital)}
                  className="secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hospital.hospitalid)}
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

export default Hospitals;
