const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all areas
exports.getAllAreas = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Area ORDER BY AreaID");
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllAreas");
  }
};

// GET area by ID
exports.getAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM Area WHERE AreaID = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Area not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "getAreaById");
  }
};

// CREATE area
exports.createArea = async (req, res) => {
  try {
    const { name, infectionrate, risklevel } = req.body;

    // Normalize risk level to DB enum values (lowercase)
    const normalizeRisk = (r) => {
      if (!r) return "low";
      const v = String(r).toLowerCase();
      if (v.includes("extreme") || v.includes("critical")) return "extreme";
      if (v.includes("danger")) return "dangerous";
      if (v.includes("high")) return "high";
      if (v.includes("medium")) return "medium";
      if (v.includes("low")) return "low";
      if (v.includes("risky")) return "risky";
      if (v.includes("safe")) return "safe";
      return "low";
    };

    const riskEnum = normalizeRisk(risklevel);

    const rate =
      infectionrate === undefined || infectionrate === null
        ? null
        : parseFloat(infectionrate);
    const result = await db.query(
      "INSERT INTO Area (Name, InfectionRate, RiskLevel) VALUES ($1, $2, $3) RETURNING *",
      [name, rate, riskEnum]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createArea");
  }
};

// UPDATE area
exports.updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, infectionrate, risklevel } = req.body;
    const normalizeRisk = (r) => {
      if (!r) return "low";
      const v = String(r).toLowerCase();
      if (v.includes("extreme") || v.includes("critical")) return "extreme";
      if (v.includes("danger")) return "dangerous";
      if (v.includes("high")) return "high";
      if (v.includes("medium")) return "medium";
      if (v.includes("low")) return "low";
      if (v.includes("risky")) return "risky";
      if (v.includes("safe")) return "safe";
      return "low";
    };
    const riskEnum = normalizeRisk(risklevel);
    const rate =
      infectionrate === undefined || infectionrate === null
        ? null
        : parseFloat(infectionrate);

    const result = await db.query(
      "UPDATE Area SET Name=$1, InfectionRate=$2, RiskLevel=$3 WHERE AreaID=$4 RETURNING *",
      [name, rate, riskEnum, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Area not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updateArea");
  }
};

// DELETE area
exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Area WHERE AreaID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Area not found" });
    res.json({ message: "Area deleted" });
  } catch (err) {
    handleError(res, err, "deleteArea");
  }
};

// GET high risk areas - Areas with infection rate higher than global average
exports.getHighRiskAreas = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM Area
      WHERE InfectionRate > (SELECT AVG(InfectionRate) FROM Area)
      ORDER BY InfectionRate DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getHighRiskAreas");
  }
};

// GET areas with ongoing infections
exports.getAreasWithOngoingInfections = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT
        a.AreaID,
        a.Name,
        a.InfectionRate,
        a.RiskLevel,
        COUNT(i.PatientID) AS active_cases
      FROM Area a
      JOIN Patient p ON a.AreaID = p.AreaID
      JOIN Infection i ON p.PatientID = i.PatientID
      WHERE i.Status = 'active'
      GROUP BY a.AreaID, a.Name, a.InfectionRate, a.RiskLevel
      ORDER BY active_cases DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAreasWithOngoingInfections");
  }
};

// GET prominent disease per area: disease with highest infection count among patients in the area
exports.getProminentDiseasePerArea = async (req, res) => {
  try {
    const result = await db.query(`
      WITH counts AS (
        SELECT 
          p.AreaID,
          i.DiseaseID,
          COUNT(*) AS cnt,
          ROW_NUMBER() OVER (PARTITION BY p.AreaID ORDER BY COUNT(*) DESC, i.DiseaseID) AS rn
        FROM Patient p
        JOIN Infection i ON i.PatientID = p.PatientID
        GROUP BY p.AreaID, i.DiseaseID
      )
      SELECT 
        a.AreaID,
        a.Name AS area_name,
        d.DiseaseID,
        d.Name AS disease_name,
        c.cnt AS occurrence_count
      FROM counts c
      JOIN Area a ON a.AreaID = c.AreaID
      JOIN Disease d ON d.DiseaseID = c.DiseaseID
      WHERE c.rn = 1
      ORDER BY a.Name
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getProminentDiseasePerArea");
  }
};
