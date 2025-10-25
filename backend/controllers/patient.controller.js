const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all patients with JOIN to Area and hospitalized hospitals
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
        a.InfectionRate,
        COALESCE(STRING_AGG(DISTINCT h.Name, ', '), '') AS hospitals
      FROM Patient p
      LEFT JOIN Area a ON p.AreaID = a.AreaID
      LEFT JOIN Infection i ON i.PatientID = p.PatientID AND i.Status = 'hospitalized'
      LEFT JOIN Hospital h ON i.HospitalID = h.HospitalID
      GROUP BY p.PatientID, p.Name, p.AreaID, p.ContactNo, a.Name, a.RiskLevel, a.InfectionRate
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
        a.InfectionRate,
        COALESCE(STRING_AGG(DISTINCT h.Name, ', '), '') AS hospitals
      FROM Patient p
      LEFT JOIN Area a ON p.AreaID = a.AreaID
      LEFT JOIN Infection i ON i.PatientID = p.PatientID AND i.Status = 'hospitalized'
      LEFT JOIN Hospital h ON i.HospitalID = h.HospitalID
      WHERE p.PatientID = $1
      GROUP BY p.PatientID, a.Name, a.RiskLevel, a.InfectionRate
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

// Patients in areas with high infection rate (above average or threshold)
exports.getPatientsInHighInfectionAreas = async (req, res) => {
  try {
    const { threshold } = req.query;
    if (threshold) {
      const t = parseFloat(threshold);
      const result = await db.query(
        `SELECT p.PatientID, p.Name, p.AreaID, p.ContactNo, a.Name AS area_name, a.RiskLevel, a.InfectionRate
         FROM Patient p
         JOIN Area a ON p.AreaID = a.AreaID
         WHERE a.InfectionRate > $1
         ORDER BY a.InfectionRate DESC, p.Name`,
        [t]
      );
      return res.json(result.rows);
    }
    const result = await db.query(
      `SELECT p.PatientID, p.Name, p.AreaID, p.ContactNo, a.Name AS area_name, a.RiskLevel, a.InfectionRate
       FROM Patient p
       JOIN Area a ON p.AreaID = a.AreaID
       WHERE a.InfectionRate > (SELECT AVG(InfectionRate) FROM Area)
       ORDER BY a.InfectionRate DESC, p.Name`
    );
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getPatientsInHighInfectionAreas");
  }
};

// Patients who have diseases X,Y,Z using set operations (UNION for any, INTERSECT for all)
exports.getPatientsByDiseases = async (req, res) => {
  try {
    const { ids, mode } = req.query;
    if (!ids)
      return res
        .status(400)
        .json({
          error: "ids query param required (comma-separated disease IDs)",
        });
    const list = ids
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));
    if (list.length === 0)
      return res.status(400).json({ error: "No valid disease IDs provided" });

    const op =
      String(mode || "any").toLowerCase() === "all" ? "INTERSECT" : "UNION";
    const selects = list.map(
      (_, idx) =>
        `SELECT DISTINCT p.PatientID, p.Name, p.AreaID, p.ContactNo FROM Infection i JOIN Patient p ON i.PatientID = p.PatientID WHERE i.DiseaseID = $${
          idx + 1
        }`
    );
    const sql = selects.join(` ${op} `) + " ORDER BY Name";
    const result = await db.query(sql, list);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getPatientsByDiseases");
  }
};

// Overdue vaccinations (via DB VIEW)
exports.getOverdueVaccinations = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM OverdueVaccinations ORDER BY next_due_date ASC, patient_name`
    );
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getOverdueVaccinations");
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
