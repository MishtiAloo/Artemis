import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

// Minimal inline SVG icons to avoid extra deps
const Icon = ({ name, size = 22 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "virus":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      );
    case "syringe":
      return (
        <svg {...common}>
          <path d="M18 2l4 4M2 20l7-7M3 17l4 4M19 5l-7 7" />
          <path d="M14 7l3 3" />
        </svg>
      );
    case "boxes":
      return (
        <svg {...common}>
          <path d="M21 16V8l-9-4-9 4v8l9 4 9-4z" />
          <path d="M3.3 7.3L12 11l8.7-3.7" />
          <path d="M12 21V11" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...common}>
          <rect x="8" y="2" width="8" height="4" rx="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    case "hospital":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M12 7v10M7 12h10" />
        </svg>
      );
    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10 5" />
          <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L14 19" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z" />
          <path d="M9 3v15M15 6v15" />
        </svg>
      );
    case "chart":
      return (
        <svg {...common}>
          <path d="M3 3v18h18" />
          <rect x="7" y="13" width="3" height="5" />
          <rect x="12" y="9" width="3" height="9" />
          <rect x="17" y="5" width="3" height="13" />
        </svg>
      );
    case "power":
      return (
        <svg {...common}>
          <path d="M12 2v10" />
          <path d="M5 7a7 7 0 1 0 14 0" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      );
    default:
      return null;
  }
};

const routes = [
  { to: "/", label: "Dashboard", icon: "home" },
  { to: "/patients", label: "Patients", icon: "users" },
  { to: "/diseases", label: "Diseases & Infections", icon: "virus" },
  { to: "/vaccines", label: "Vaccines", icon: "syringe" },
  { to: "/vaccine-batches", label: "Vaccine Batches", icon: "boxes" },
  {
    to: "/vaccination-records",
    label: "Vaccination Records",
    icon: "clipboard",
  },
  { to: "/hospitals", label: "Hospitals", icon: "hospital" },
  { to: "/contacts", label: "Contact Tracing", icon: "link" },
  { to: "/areas", label: "Areas & Risk", icon: "map" },
  { to: "/analytics", label: "Analytics", icon: "chart" },
];

function Navbar({ onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar sticky">
      <div className="navbar-inner">
        <div className="navbar-left">
          <button
            className="navbar-toggle"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name="menu" />
          </button>
          <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
            <span className="brand-logo" aria-hidden>
              {/* Simple logo circle with A */}
              <svg width="28" height="28" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  fill="var(--accent-dark-green)"
                  stroke="var(--accent-green)"
                  strokeWidth="2"
                />
                <text
                  x="16"
                  y="20"
                  textAnchor="middle"
                  fontSize="14"
                  fill="var(--accent-green)"
                  fontWeight="bold"
                >
                  A
                </text>
              </svg>
            </span>
            <span className="brand-name">Artemis</span>
          </Link>
        </div>

        <nav className="nav-icons">
          <ul>
            {routes.map((r) => (
              <li
                key={r.to}
                className={location.pathname === r.to ? "active" : ""}
              >
                <Link to={r.to} title={r.label} aria-label={r.label}>
                  <Icon name={r.icon} />
                </Link>
              </li>
            ))}
            <li>
              <button
                title="Logout"
                aria-label="Logout"
                className="icon-btn secondary"
                onClick={onLogout}
              >
                <Icon name="power" />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {open && (
        <div className="nav-drawer" role="dialog" aria-modal="true">
          <div className="nav-drawer-backdrop" onClick={() => setOpen(false)} />
          <div className="nav-drawer-content" role="document">
            <div className="nav-drawer-header">
              <span className="brand-logo" aria-hidden>
                <svg width="28" height="28" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    fill="var(--accent-dark-green)"
                    stroke="var(--accent-green)"
                    strokeWidth="2"
                  />
                  <text
                    x="16"
                    y="20"
                    textAnchor="middle"
                    fontSize="14"
                    fill="var(--accent-green)"
                    fontWeight="bold"
                  >
                    A
                  </text>
                </svg>
              </span>
              <span className="brand-name">Artemis</span>
              <button
                className="icon-btn"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <ul className="nav-drawer-list">
              {routes.map((r) => (
                <li
                  key={r.to}
                  className={location.pathname === r.to ? "active" : ""}
                >
                  <Link to={r.to} onClick={() => setOpen(false)}>
                    <Icon name={r.icon} />
                    <span>{r.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <button onClick={onLogout} className="danger">
                  <Icon name="power" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
