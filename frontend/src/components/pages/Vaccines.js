import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Vaccines() {
  const [vaccines, setVaccines] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [poorList, setPoorList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [formData, setFormData] = useState({
    targeteddiseaseid: "",
    name: "",
    manufacturer: "",
    dosecount: 1,
    effectivedays: 365,
  });

  useEffect(() => {
    fetchVaccines();
    fetchDiseases();
  }, []);

  const fetchVaccines = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccines`);
      setVaccines(res.data);
    } catch (error) {
      console.error("Error fetching vaccines:", error);
    }
  };

  const fetchDiseases = async () => {
    try {
      const res = await axios.get(`${API_URL}/diseases`);
      setDiseases(res.data);
    } catch (error) {
      console.error("Error fetching diseases:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/vaccines/search?name=${searchName}`
      );
      setVaccines(res.data);
    } catch (error) {
      console.error("Error searching vaccines:", error);
    }
  };

  const loadPoorPerformance = async () => {
    try {
      const res = await axios.get(`${API_URL}/vaccines/poor-performance`);
      setPoorList(res.data);
    } catch (error) {
      console.error("Error loading poor performance list:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/vaccines`, formData);
      setShowForm(false);
      setFormData({
        targeteddiseaseid: "",
        name: "",
        manufacturer: "",
        dosecount: 1,
        effectivedays: 365,
      });
      fetchVaccines();
    } catch (error) {
      console.error("Error creating vaccine:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this vaccine?")) {
      try {
        await axios.delete(`${API_URL}/vaccines/${id}`);
        fetchVaccines();
      } catch (error) {
        console.error("Error deleting vaccine:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Vaccine & Manufacturer Management</h1>
        <p className="text-muted">
          Manage vaccines, targeted diseases, and effectiveness
        </p>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Vaccine"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Vaccine</h3>
          <form onSubmit={handleSubmit}>
            <label>Vaccine Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <label>Targeted Disease</label>
            <select
              value={formData.targeteddiseaseid}
              onChange={(e) =>
                setFormData({ ...formData, targeteddiseaseid: e.target.value })
              }
              required
            >
              <option value="">Select Disease</option>
              {diseases.map((d) => (
                <option key={d.diseaseid} value={d.diseaseid}>
                  {d.name}
                </option>
              ))}
            </select>

            <label>Manufacturer</label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) =>
                setFormData({ ...formData, manufacturer: e.target.value })
              }
              required
            />

            <label>Dose Count</label>
            <input
              type="number"
              min="1"
              value={formData.dosecount}
              onChange={(e) =>
                setFormData({ ...formData, dosecount: e.target.value })
              }
              required
            />

            <label>Effective Days</label>
            <input
              type="number"
              min="1"
              value={formData.effectivedays}
              onChange={(e) =>
                setFormData({ ...formData, effectivedays: e.target.value })
              }
              required
            />

            <button type="submit">Create Vaccine</button>
          </form>
        </div>
      )}

      <div className="filter-bar">
        <div>
          <label>Search by Name</label>
          <input
            type="text"
            placeholder="Vaccine name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <button onClick={handleSearch}>Search</button>
        <button
          onClick={() => {
            setSearchName("");
            fetchVaccines();
          }}
          className="secondary"
        >
          Reset
        </button>
        <button onClick={loadPoorPerformance} className="warning">
          Show Poorly Performing
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Targeted Disease</th>
            <th>Manufacturer</th>
            <th>Doses</th>
            <th>Effective Days</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccines.map((vaccine) => (
            <tr key={vaccine.vaccineid}>
              <td>{vaccine.vaccineid}</td>
              <td>{vaccine.name}</td>
              <td>{vaccine.disease_name}</td>
              <td>{vaccine.manufacturer}</td>
              <td>{vaccine.dosecount}</td>
              <td>{vaccine.effectivedays}</td>
              <td>
                <button
                  onClick={() => handleDelete(vaccine.vaccineid)}
                  className="danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {poorList.length > 0 && (
        <div className="card" style={{ marginTop: 24 }}>
          <h3>Poorly Performing Vaccines (Highest death % first)</h3>
          <table>
            <thead>
              <tr>
                <th>Vaccine</th>
                <th>Targeted Disease</th>
                <th>Vaccinated People</th>
                <th>Deceased People</th>
                <th>Death %</th>
              </tr>
            </thead>
            <tbody>
              {poorList.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.vaccine_name}</td>
                  <td>{row.disease_name}</td>
                  <td>{row.vaccinated_people}</td>
                  <td>{row.deceased_people}</td>
                  <td>{Number(row.death_percentage).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Vaccines;
