import React from "react";
import { Link } from "react-router-dom";

function Navbar({ onLogout }) {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/patients">Patients</Link>
        </li>
        <li>
          <Link to="/diseases">Diseases & Infections</Link>
        </li>
        <li>
          <Link to="/vaccines">Vaccines</Link>
        </li>
        <li>
          <Link to="/vaccine-batches">Vaccine Batches</Link>
        </li>
        <li>
          <Link to="/vaccination-records">Vaccination Records</Link>
        </li>
        <li>
          <Link to="/hospitals">Hospitals</Link>
        </li>
        <li>
          <Link to="/contacts">Contact Tracing</Link>
        </li>
        <li>
          <Link to="/areas">Areas & Risk</Link>
        </li>
        <li>
          <Link to="/analytics">Analytics</Link>
        </li>
        <li>
          <button onClick={onLogout} className="secondary">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
