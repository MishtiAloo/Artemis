import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import Login from "./components/pages/Login";
import Dashboard from "./components/pages/Dashboard";
import Patients from "./components/pages/Patients";
import Diseases from "./components/pages/Diseases";
import Vaccines from "./components/pages/Vaccines";
import VaccineBatches from "./components/pages/VaccineBatches";
import VaccinationRecords from "./components/pages/VaccinationRecords";
import Hospitals from "./components/pages/Hospitals";
import Contacts from "./components/pages/Contacts";
import Areas from "./components/pages/Areas";
import Analytics from "./components/pages/Analytics";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/diseases" element={<Diseases />} />
        <Route path="/vaccines" element={<Vaccines />} />
        <Route path="/vaccine-batches" element={<VaccineBatches />} />
        <Route path="/vaccination-records" element={<VaccinationRecords />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/areas" element={<Areas />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
