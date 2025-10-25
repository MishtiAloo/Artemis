import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientid: "",
    contactpersonid: "",
    date: "",
    areaid: "",
    contacttype: "Direct",
  });

  useEffect(() => {
    fetchContacts();
    fetchPatients();
    fetchAreas();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get(`${API_URL}/contacts`);
      setContacts(res.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
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
      await axios.post(`${API_URL}/contacts`, formData);
      setShowForm(false);
      setFormData({
        patientid: "",
        contactpersonid: "",
        date: "",
        areaid: "",
        contacttype: "Direct",
      });
      fetchContacts();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleDelete = async (patientId, contactPersonId) => {
    if (window.confirm("Delete this contact record?")) {
      try {
        await axios.delete(
          `${API_URL}/contacts/${patientId}/${contactPersonId}`
        );
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
      }
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Contact Tracing</h1>
        <p className="text-muted">Track patient contacts and exposure areas</p>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Contact"}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Contact Record</h3>
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

            <label>Contact Person</label>
            <select
              value={formData.contactpersonid}
              onChange={(e) =>
                setFormData({ ...formData, contactpersonid: e.target.value })
              }
              required
            >
              <option value="">Select Contact Person</option>
              {patients.map((p) => (
                <option key={p.patientid} value={p.patientid}>
                  {p.name}
                </option>
              ))}
            </select>

            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
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
              {areas.map((a) => (
                <option key={a.areaid} value={a.areaid}>
                  {a.name}
                </option>
              ))}
            </select>

            <label>Contact Type</label>
            <select
              value={formData.contacttype}
              onChange={(e) =>
                setFormData({ ...formData, contacttype: e.target.value })
              }
              required
            >
              <option value="Direct">Direct</option>
              <option value="Indirect">Indirect</option>
              <option value="Household">Household</option>
              <option value="Healthcare">Healthcare</option>
            </select>

            <button type="submit">Create Contact</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Contact Person</th>
            <th>Date</th>
            <th>Area</th>
            <th>Contact Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, idx) => (
            <tr key={idx}>
              <td>{contact.patient_name}</td>
              <td>{contact.contact_person_name}</td>
              <td>{new Date(contact.date).toLocaleDateString()}</td>
              <td>{contact.area_name}</td>
              <td>{contact.contacttype}</td>
              <td>
                <button
                  onClick={() =>
                    handleDelete(contact.patientid, contact.contactpersonid)
                  }
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

export default Contacts;
