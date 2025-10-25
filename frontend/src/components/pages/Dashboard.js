import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5050";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [highRiskAreas, setHighRiskAreas] = useState([]);
  const [hospitalsNearCapacity, setHospitalsNearCapacity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, areasRes, hospitalsRes] = await Promise.all([
        axios.get(`${API_URL}/analytics/stats`),
        axios.get(`${API_URL}/areas/high-risk`),
        axios.get(`${API_URL}/hospitals/near-capacity`),
      ]);

      setStats(statsRes.data);
      setHighRiskAreas(areasRes.data);
      setHospitalsNearCapacity(hospitalsRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
        <h1>Dashboard</h1>
        <p className="text-muted">System Overview & Key Metrics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Patients</h3>
          <div className="value">{stats.totalPatients || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Active Infections</h3>
          <div className="value">{stats.activeInfections || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Vaccines</h3>
          <div className="value">{stats.totalVaccines || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Hospitals</h3>
          <div className="value">{stats.totalHospitals || 0}</div>
        </div>
      </div>

      <div className="section">
        <h2>High Risk Areas</h2>
        {highRiskAreas.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Area Name</th>
                <th>Infection Rate (%)</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {highRiskAreas.map((area, index) => (
                <tr key={index}>
                  <td>{area.name}</td>
                  <td>{area.infectionrate}</td>
                  <td>{area.risklevel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No high risk areas found.</p>
        )}
      </div>

      <div className="section">
        <h2>Hospitals Nearing Capacity</h2>
        {hospitalsNearCapacity.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Hospital Name</th>
                <th>Area</th>
                <th>Capacity</th>
                <th>Current Load</th>
              </tr>
            </thead>
            <tbody>
              {hospitalsNearCapacity.map((hospital, index) => (
                <tr key={index}>
                  <td>{hospital.name}</td>
                  <td>{hospital.area_name}</td>
                  <td>{hospital.capacity}</td>
                  <td>{hospital.current_load || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">All hospitals operating normally.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
