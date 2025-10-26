import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Diseases() {
  const [diseases, setDiseases] = useState([]);
  const [diseasesNoVax, setDiseasesNoVax] = useState([]);
  const [infections, setInfections] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activeTab, setActiveTab] = useState("diseases");
  const [showForm, setShowForm] = useState(false);
  const [diseaseForm, setDiseaseForm] = useState({
    variant: "",
    name: "",
    transmissionmode: "",
    severity: "",
  });
  const [infectionForm, setInfectionForm] = useState({
    patientid: "",
    diseaseid: "",
    diagnosisdate: "",
    recoverydate: "",
    status: "Active",
  });
  const [editingInfectionKeys, setEditingInfectionKeys] = useState(null); // { patientid, diseaseid }

  useEffect(() => {
    fetchDiseases();
    fetchDiseasesNoVax();
    fetchInfections();
    fetchPatients();
  }, []);

  const fetchDiseases = async () => {
    try {
      const res = await axios.get(`${API_URL}/diseases`);
      setDiseases(res.data);
    } catch (error) {
      console.error("Error fetching diseases:", error);
    }
  };

  const fetchDiseasesNoVax = async () => {
    try {
      const res = await axios.get(`${API_URL}/diseases/without-vaccines`);
      setDiseasesNoVax(res.data);
    } catch (error) {
      console.error("Error fetching diseases without vaccines:", error);
    }
  };

  const fetchInfections = async () => {
    try {
      const res = await axios.get(`${API_URL}/infections`);
      setInfections(res.data);
    } catch (error) {
      console.error("Error fetching infections:", error);
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

  const handleDiseaseSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/diseases`, diseaseForm);
      setShowForm(false);
      setDiseaseForm({
        variant: "",
        name: "",
        transmissionmode: "",
        severity: "",
      });
      fetchDiseases();
    } catch (error) {
      console.error("Error creating disease:", error);
    }
  };

  const handleInfectionSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInfectionKeys) {
        // Update existing infection (don't allow changing patient/disease keys here)
        const { patientid, diseaseid } = editingInfectionKeys;
        const payload = {
          diagnosisdate: infectionForm.diagnosisdate,
          recoverydate: infectionForm.recoverydate || null,
          status: infectionForm.status,
        };
        await axios.put(
          `${API_URL}/infections/${patientid}/${diseaseid}`,
          payload
        );
      } else {
        // Create new infection
        await axios.post(`${API_URL}/infections`, infectionForm);
      }
      setShowForm(false);
      setInfectionForm({
        patientid: "",
        diseaseid: "",
        diagnosisdate: "",
        recoverydate: "",
        status: "Active",
      });
      setEditingInfectionKeys(null);
      fetchInfections();
    } catch (error) {
      console.error(
        editingInfectionKeys
          ? "Error updating infection:"
          : "Error creating infection:",
        error
      );
    }
  };

  const handleDeleteDisease = async (id) => {
    if (window.confirm("Delete this disease?")) {
      try {
        await axios.delete(`${API_URL}/diseases/${id}`);
        fetchDiseases();
      } catch (error) {
        console.error("Error deleting disease:", error);
      }
    }
  };

  const handleDeleteInfection = async (patientId, diseaseId) => {
    if (window.confirm("Delete this infection record?")) {
      try {
        await axios.delete(`${API_URL}/infections/${patientId}/${diseaseId}`);
        fetchInfections();
      } catch (error) {
        console.error("Error deleting infection:", error);
      }
    }
  };

  const handleEditInfection = (infection) => {
    setActiveTab("infections");
    setShowForm(true);
    // lock keys via editing state; keep selects disabled during edit
    setEditingInfectionKeys({
      patientid: infection.patientid,
      diseaseid: infection.diseaseid,
    });
    setInfectionForm({
      patientid: infection.patientid,
      diseaseid: infection.diseaseid,
      diagnosisdate: infection.diagnosisdate
        ? new Date(infection.diagnosisdate).toISOString().slice(0, 10)
        : "",
      recoverydate: infection.recoverydate
        ? new Date(infection.recoverydate).toISOString().slice(0, 10)
        : "",
      // Normalize into the display options used in the select
      status: (() => {
        const v = String(infection.status || "").toLowerCase();
        if (v === "active") return "Active";
        if (v === "cured" || v === "recovered") return "Recovered";
        if (v === "dead" || v === "deceased") return "Deceased";
        if (v === "hospitalized") return "Hospitalized";
        return "Active";
      })(),
    });
  };

  return (
    <div className="container">
      <div className="page-header">
        <h1>Disease & Infection Tracking</h1>
        <p className="text-muted">
          Manage diseases and track infection history
        </p>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => setActiveTab("diseases")}
          className={activeTab === "diseases" ? "" : "secondary"}
        >
          Diseases
        </button>
        <button
          onClick={() => setActiveTab("infections")}
          className={activeTab === "infections" ? "" : "secondary"}
        >
          Infections
        </button>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm
            ? "Cancel"
            : `Add New ${activeTab === "diseases" ? "Disease" : "Infection"}`}
        </button>
      </div>

      {showForm && activeTab === "diseases" && (
        <div className="card">
          <h3>Add New Disease</h3>
          <form onSubmit={handleDiseaseSubmit}>
            <label>Disease Name</label>
            <input
              type="text"
              value={diseaseForm.name}
              onChange={(e) =>
                setDiseaseForm({ ...diseaseForm, name: e.target.value })
              }
              required
            />

            <label>Variant</label>
            <input
              type="text"
              value={diseaseForm.variant}
              onChange={(e) =>
                setDiseaseForm({ ...diseaseForm, variant: e.target.value })
              }
            />

            <label>Transmission Mode</label>
            <select
              value={diseaseForm.transmissionmode}
              onChange={(e) =>
                setDiseaseForm({
                  ...diseaseForm,
                  transmissionmode: e.target.value,
                })
              }
              required
            >
              <option value="">Select Mode</option>
              <option value="Airborne">Airborne</option>
              <option value="Contact">Contact</option>
              <option value="Droplet">Droplet</option>
              <option value="Vector">Vector</option>
              <option value="Foodborne">Foodborne</option>
            </select>

            <label>Severity (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={diseaseForm.severity}
              onChange={(e) =>
                setDiseaseForm({ ...diseaseForm, severity: e.target.value })
              }
              required
            />

            <button type="submit">Create Disease</button>
          </form>
        </div>
      )}

      {showForm && activeTab === "infections" && (
        <div className="card">
          <h3>
            {editingInfectionKeys
              ? "Edit Infection Record"
              : "Add New Infection Record"}
          </h3>
          <form onSubmit={handleInfectionSubmit}>
            <label>Patient</label>
            <select
              value={infectionForm.patientid}
              onChange={(e) =>
                setInfectionForm({
                  ...infectionForm,
                  patientid: e.target.value,
                })
              }
              required
              disabled={!!editingInfectionKeys}
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.patientid} value={p.patientid}>
                  {p.name}
                </option>
              ))}
            </select>

            <label>Disease</label>
            <select
              value={infectionForm.diseaseid}
              onChange={(e) =>
                setInfectionForm({
                  ...infectionForm,
                  diseaseid: e.target.value,
                })
              }
              required
              disabled={!!editingInfectionKeys}
            >
              <option value="">Select Disease</option>
              {diseases.map((d) => (
                <option key={d.diseaseid} value={d.diseaseid}>
                  {d.name} ({d.variant})
                </option>
              ))}
            </select>

            <label>Diagnosis Date</label>
            <input
              type="date"
              value={infectionForm.diagnosisdate}
              onChange={(e) =>
                setInfectionForm({
                  ...infectionForm,
                  diagnosisdate: e.target.value,
                })
              }
              required
            />

            <label>Recovery Date</label>
            <input
              type="date"
              value={infectionForm.recoverydate}
              onChange={(e) =>
                setInfectionForm({
                  ...infectionForm,
                  recoverydate: e.target.value,
                })
              }
            />

            <label>Status</label>
            <select
              value={infectionForm.status}
              onChange={(e) =>
                setInfectionForm({ ...infectionForm, status: e.target.value })
              }
              required
            >
              <option value="Active">Active</option>
              <option value="Recovered">Recovered</option>
              <option value="Deceased">Deceased</option>
              <option value="Hospitalized">Hospitalized</option>
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">
                {editingInfectionKeys
                  ? "Update Infection"
                  : "Create Infection Record"}
              </button>
              {editingInfectionKeys && (
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingInfectionKeys(null);
                    setInfectionForm({
                      patientid: "",
                      diseaseid: "",
                      diagnosisdate: "",
                      recoverydate: "",
                      status: "Active",
                    });
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {activeTab === "diseases" && (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Variant</th>
                <th>Transmission</th>
                <th>Severity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {diseases.map((disease) => (
                <tr key={disease.diseaseid}>
                  <td>{disease.diseaseid}</td>
                  <td>{disease.name}</td>
                  <td>{disease.variant}</td>
                  <td>{disease.transmissionmode}</td>
                  <td>{disease.severity}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteDisease(disease.diseaseid)}
                      className="danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="card" style={{ marginTop: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Diseases without vaccines</h3>
              <button className="secondary" onClick={fetchDiseasesNoVax}>
                Refresh
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Variant</th>
                  <th>Transmission</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {diseasesNoVax.map((d) => (
                  <tr key={d.diseaseid}>
                    <td>{d.diseaseid}</td>
                    <td>{d.name}</td>
                    <td>{d.variant || "-"}</td>
                    <td>{d.transmissionmode || "-"}</td>
                    <td>{d.severity}</td>
                  </tr>
                ))}
                {diseasesNoVax.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      All diseases have at least one vaccine.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "infections" && (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Disease</th>
              <th>Diagnosis Date</th>
              <th>Recovery Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {infections.map((infection, idx) => (
              <tr key={idx}>
                <td>{infection.patient_name}</td>
                <td>{infection.disease_name}</td>
                <td>
                  {new Date(infection.diagnosisdate).toLocaleDateString()}
                </td>
                <td>
                  {infection.recoverydate
                    ? new Date(infection.recoverydate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{infection.status}</td>
                <td>
                  <button
                    onClick={() => handleEditInfection(infection)}
                    className="secondary"
                    style={{ marginRight: 8 }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteInfection(
                        infection.patientid,
                        infection.diseaseid
                      )
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
      )}
    </div>
  );
}

export default Diseases;
