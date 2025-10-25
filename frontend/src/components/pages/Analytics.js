import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Analytics() {
  const [diseasesByArea, setDiseasesByArea] = useState([]);
  const [fullyVaccinated, setFullyVaccinated] = useState([]);
  const [unvaccinatedInfected, setUnvaccinatedInfected] = useState([]);
  const [avgRecoveryDays, setAvgRecoveryDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [diseasesRes, vaccinatedRes, unvaccinatedRes, recoveryRes] =
        await Promise.all([
          axios.get(`${API_URL}/analytics/diseases-by-area`),
          axios.get(`${API_URL}/analytics/fully-vaccinated`),
          axios.get(`${API_URL}/analytics/unvaccinated-infected`),
          axios.get(`${API_URL}/analytics/avg-recovery-days`),
        ]);

      setDiseasesByArea(diseasesRes.data);
      setFullyVaccinated(vaccinatedRes.data);
      setUnvaccinatedInfected(unvaccinatedRes.data);
      setAvgRecoveryDays(recoveryRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );

  return (
    <div className="container">
      <div className="page-header">
        <h1>Analytics & Reports</h1>
        <p className="text-muted">Comprehensive analytical summaries</p>
      </div>

      <div className="section">
        <h2>Disease Prominence by Area</h2>
        {diseasesByArea.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Area</th>
                <th>Disease</th>
                <th>Case Count</th>
              </tr>
            </thead>
            <tbody>
              {diseasesByArea.map((item, index) => (
                <tr key={index}>
                  <td>{item.area_name}</td>
                  <td>{item.disease_name}</td>
                  <td>{item.case_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No data available.</p>
        )}
      </div>

      <div className="section">
        <h2>Fully Vaccinated Patients</h2>
        {fullyVaccinated.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Vaccine</th>
                <th>Required Doses</th>
                <th>Completed Doses</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fullyVaccinated.map((item, index) => (
                <tr key={index}>
                  <td>{item.patient_name}</td>
                  <td>{item.vaccine_name}</td>
                  <td>{item.required_doses}</td>
                  <td>{item.completed_doses}</td>
                  <td>{item.vaccination_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No data available.</p>
        )}
      </div>

      <div className="section">
        <h2>Patients Infected But Never Vaccinated</h2>
        {unvaccinatedInfected.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Disease</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {unvaccinatedInfected.map((item, index) => (
                <tr key={index}>
                  <td>{item.patient_name}</td>
                  <td>{item.disease_name}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No unvaccinated infected patients found.</p>
        )}
      </div>

      <div className="section">
        <h2>Average Recovery Days by Disease</h2>
        {avgRecoveryDays.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Disease</th>
                <th>Average Recovery Days</th>
              </tr>
            </thead>
            <tbody>
              {avgRecoveryDays.map((item, index) => (
                <tr key={index}>
                  <td>{item.disease_name}</td>
                  <td>
                    {item.avg_recovery_days
                      ? parseFloat(item.avg_recovery_days).toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No recovery data available.</p>
        )}
      </div>
    </div>
  );
}

export default Analytics;
