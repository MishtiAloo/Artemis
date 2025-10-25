import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [areas, setAreas] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    areaid: "",
    contactno: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPatients();
    fetchAreas();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_URL}/patients`);
      setPatients(res.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
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

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/patients/search?name=${searchName}&areaid=${filterArea}`
      );
      setPatients(res.data);
    } catch (error) {
      console.error("Error searching patients:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/patients/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/patients`, formData);
      }
      setShowForm(false);
      setFormData({ name: "", areaid: "", contactno: "" });
      setEditingId(null);
      fetchPatients();
    } catch (error) {
      console.error("Error saving patient:", error);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      name: patient.name,
      areaid: patient.areaid,
      contactno: patient.contactno,
    });
    setEditingId(patient.patientid);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await axios.delete(`${API_URL}/patients/${id}`);
        fetchPatients();
      } catch (error) {
        console.error("Error deleting patient:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Patients Management</h1>
        <p className="text-muted">Manage patient records and health status</p>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", areaid: "", contactno: "" });
          }}
        >
          {showForm ? "Cancel" : "Add New Patient"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingId ? "Edit Patient" : "Add New Patient"}</h3>
          <form onSubmit={handleSubmit}>
            <label>Patient Name</label>
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

            <label>Contact Number</label>
            <input
              type="text"
              value={formData.contactno}
              onChange={(e) =>
                setFormData({ ...formData, contactno: e.target.value })
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
            placeholder="Patient name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div>
          <label>Filter by Area</label>
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area.areaid} value={area.areaid}>
                {area.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={() => {
            setSearchName("");
            setFilterArea("");
            fetchPatients();
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
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.patientid}>
              <td>{patient.patientid}</td>
              <td>{patient.name}</td>
              <td>{patient.area_name || "N/A"}</td>
              <td>{patient.contactno}</td>
              <td>
                <button
                  onClick={() => handleEdit(patient)}
                  className="secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(patient.patientid)}
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

export default Patients;
