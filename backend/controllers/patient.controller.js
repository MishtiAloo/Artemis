const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all patients with JOIN to Area
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.PatientID, 
        p.Name, 
        p.AreaID, 
        p.ContactNo,
        a.Name AS area_name,
        a.RiskLevel,
        a.InfectionRate
      FROM Patient p
      LEFT JOIN Area a ON p.AreaID = a.AreaID
      ORDER BY p.PatientID
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllPatients");
  }
};

// GET patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        p.*,
        a.Name AS area_name,
        a.RiskLevel,
        a.InfectionRate
      FROM Patient p
      LEFT JOIN Area a ON p.AreaID = a.AreaID
      WHERE p.PatientID = $1
    `,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Patient not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "getPatientById");
  }
};

// SEARCH patients by name (WHERE LIKE) and area (WHERE)
exports.searchPatients = async (req, res) => {
  try {
    const { name, areaid } = req.query;
    let query = `
      SELECT 
        p.PatientID, 
        p.Name, 
        p.AreaID, 
        p.ContactNo,
        a.Name AS area_name,
        a.RiskLevel
      FROM Patient p
      LEFT JOIN Area a ON p.AreaID = a.AreaID
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      params.push(`%${name}%`);
      query += ` AND p.Name ILIKE $${params.length}`;
    }

    if (areaid) {
      params.push(areaid);
      query += ` AND p.AreaID = $${params.length}`;
    }

    query += ` ORDER BY p.Name`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "searchPatients");
  }
};

// CREATE patient
exports.createPatient = async (req, res) => {
  try {
    const { name, areaid, contactno } = req.body;
    const result = await db.query(
      "INSERT INTO Patient (Name, AreaID, ContactNo) VALUES ($1, $2, $3) RETURNING *",
      [name, areaid, contactno]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createPatient");
  }
};

// UPDATE patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, areaid, contactno } = req.body;
    const result = await db.query(
      "UPDATE Patient SET Name=$1, AreaID=$2, ContactNo=$3 WHERE PatientID=$4 RETURNING *",
      [name, areaid, contactno, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Patient not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updatePatient");
  }
};

// DELETE patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Patient WHERE PatientID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Patient not found" });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    handleError(res, err, "deletePatient");
  }
};
