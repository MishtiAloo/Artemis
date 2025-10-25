const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all diseases
exports.getAllDiseases = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Disease ORDER BY DiseaseID");
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllDiseases");
  }
};

// GET disease by ID
exports.getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM Disease WHERE DiseaseID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Disease not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "getDiseaseById");
  }
};

// Severity should be an integer 1-10 (frontend will send integers)
const parseSeverity = (val) => {
  if (val === undefined || val === null) return null;
  const n = parseInt(val, 10);
  if (Number.isNaN(n)) return null;
  if (n < 1) return 1;
  if (n > 10) return 10;
  return n;
};

// CREATE disease
exports.createDisease = async (req, res) => {
  try {
    const { variant, name, transmissionmode, severity } = req.body;
    const sev = parseSeverity(severity);
    if (sev === null)
      return res
        .status(400)
        .json({ error: "Invalid severity; must be integer 1-10" });
    const result = await db.query(
      "INSERT INTO Disease (Variant, Name, TransmissionMode, Severity) VALUES ($1, $2, $3, $4) RETURNING *",
      [variant, name, transmissionmode, sev]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createDisease");
  }
};

// UPDATE disease
exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const { variant, name, transmissionmode, severity } = req.body;
    const sev = parseSeverity(severity);
    if (sev === null)
      return res
        .status(400)
        .json({ error: "Invalid severity; must be integer 1-10" });
    const result = await db.query(
      "UPDATE Disease SET Variant=$1, Name=$2, TransmissionMode=$3, Severity=$4 WHERE DiseaseID=$5 RETURNING *",
      [variant, name, transmissionmode, sev, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Disease not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updateDisease");
  }
};

// DELETE disease
exports.deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Disease WHERE DiseaseID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Disease not found" });
    res.json({ message: "Disease deleted" });
  } catch (err) {
    handleError(res, err, "deleteDisease");
  }
};
