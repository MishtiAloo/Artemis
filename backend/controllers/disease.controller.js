const db = require("../db");

// GET all diseases
exports.getAllDiseases = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Disease");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET disease by ID
exports.getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM Disease WHERE DiseaseID = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Disease not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE disease
exports.createDisease = async (req, res) => {
  try {
    const { Name, Variant, TransmissionMode, Severity } = req.body;
    const result = await db.query(
      "INSERT INTO Disease (Name, Variant, TransmissionMode, Severity) VALUES ($1, $2, $3, $4) RETURNING *",
      [Name, Variant, TransmissionMode, Severity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE disease
exports.updateDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Variant, TransmissionMode, Severity } = req.body;
    const result = await db.query(
      "UPDATE Disease SET Name=$1, Variant=$2, TransmissionMode=$3, Severity=$4 WHERE DiseaseID=$5 RETURNING *",
      [Name, Variant, TransmissionMode, Severity, id]
    );
    if (result.rows.length === 0) return res.status(404).send("Disease not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE disease
exports.deleteDisease = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM Disease WHERE DiseaseID=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).send("Disease not found");
    res.json({ message: "Disease deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
