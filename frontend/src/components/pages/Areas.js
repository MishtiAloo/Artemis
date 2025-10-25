import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Areas() {
  const [areas, setAreas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    infectionrate: 0,
    risklevel: "Low",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const res = await axios.get(`${API_URL}/areas`);
      setAreas(res.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/areas/${editingId}`, formData);
      } else {
        await axios.post(`${API_URL}/areas`, formData);
      }
      setShowForm(false);
      setFormData({ name: "", infectionrate: 0, risklevel: "Low" });
      setEditingId(null);
      fetchAreas();
    } catch (error) {
      console.error("Error saving area:", error);
    }
  };

  const handleEdit = (area) => {
    setFormData({
      name: area.name,
      infectionrate: area.infectionrate,
      risklevel: area.risklevel,
    });
    setEditingId(area.areaid);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this area?")) {
      try {
        await axios.delete(`${API_URL}/areas/${id}`);
        fetchAreas();
      } catch (error) {
        console.error("Error deleting area:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Area & Risk Management</h1>
        <p className="text-muted">
          Manage areas, infection rates, and risk levels
        </p>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", infectionrate: 0, risklevel: "Low" });
          }}
        >
          {showForm ? "Cancel" : "Add New Area"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingId ? "Edit Area" : "Add New Area"}</h3>
          <form onSubmit={handleSubmit}>
            <label>Area Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <label>Infection Rate (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={formData.infectionrate}
              onChange={(e) =>
                setFormData({ ...formData, infectionrate: e.target.value })
              }
              required
            />

            <label>Risk Level</label>
            <select
              value={formData.risklevel}
              onChange={(e) =>
                setFormData({ ...formData, risklevel: e.target.value })
              }
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>

            <button type="submit">{editingId ? "Update" : "Create"}</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Infection Rate (%)</th>
            <th>Risk Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area.areaid}>
              <td>{area.areaid}</td>
              <td>{area.name}</td>
              <td>{area.infectionrate}</td>
              <td>{area.risklevel}</td>
              <td>
                <button onClick={() => handleEdit(area)} className="secondary">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(area.areaid)}
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

export default Areas;
