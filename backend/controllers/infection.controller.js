const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all infections with JOIN
exports.getAllInfections = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        i.PatientID,
        i.DiseaseID,
        i.DiagnosisDate,
        i.RecoveryDate,
        i.Status,
        p.Name AS patient_name,
        d.Name AS disease_name
      FROM Infection i
      LEFT JOIN Patient p ON i.PatientID = p.PatientID
      LEFT JOIN Disease d ON i.DiseaseID = d.DiseaseID
      ORDER BY i.DiagnosisDate DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllInfections");
  }
};

// CREATE infection
exports.createInfection = async (req, res) => {
  try {
    const { patientid, diseaseid, diagnosisdate, recoverydate, status } =
      req.body;

    // Normalize status to match DB enum (lowercase values: cured, dead, hospitalized, active)
    const normalizeStatus = (s) => {
      if (!s) return "active";
      const v = String(s).toLowerCase();
      if (v.includes("recover") || v === "recovered") return "cured";
      if (v.includes("dead") || v.includes("deceased")) return "dead";
      if (v.includes("hospital")) return "hospitalized";
      if (v.includes("active")) return "active";
      return v; // assume already valid
    };

    const statusEnum = normalizeStatus(status);
    const recovery = recoverydate ? recoverydate : null; // allow null/empty recovery date

    const result = await db.query(
      "INSERT INTO Infection (PatientID, DiseaseID, DiagnosisDate, RecoveryDate, Status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patientid, diseaseid, diagnosisdate, recovery, statusEnum]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createInfection");
  }
};

// UPDATE infection
exports.updateInfection = async (req, res) => {
  try {
    const { patientid, diseaseid } = req.params;
    const { diagnosisdate, recoverydate, status } = req.body;
    const normalizeStatus = (s) => {
      if (!s) return "active";
      const v = String(s).toLowerCase();
      if (v.includes("recover") || v === "recovered") return "cured";
      if (v.includes("dead") || v.includes("deceased")) return "dead";
      if (v.includes("hospital")) return "hospitalized";
      if (v.includes("active")) return "active";
      return v;
    };
    const statusEnum = normalizeStatus(status);
    const recovery = recoverydate ? recoverydate : null; // allow null/empty recovery date
    const result = await db.query(
      "UPDATE Infection SET DiagnosisDate=$1, RecoveryDate=$2, Status=$3 WHERE PatientID=$4 AND DiseaseID=$5 RETURNING *",
      [diagnosisdate, recovery, statusEnum, patientid, diseaseid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Infection not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updateInfection");
  }
};

// DELETE infection
exports.deleteInfection = async (req, res) => {
  try {
    const { patientid, diseaseid } = req.params;
    const result = await db.query(
      "DELETE FROM Infection WHERE PatientID=$1 AND DiseaseID=$2 RETURNING *",
      [patientid, diseaseid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Infection not found" });
    res.json({ message: "Infection deleted" });
  } catch (err) {
    handleError(res, err, "deleteInfection");
  }
};
