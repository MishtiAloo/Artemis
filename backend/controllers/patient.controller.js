const db = require("../db");

// GET all patients
exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Patient");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM Patient WHERE PatientID = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Patient not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE patient
exports.createPatient = async (req, res) => {
  try {
    const { Name, AreaID, ContactNo } = req.body;
    const result = await db.query(
      "INSERT INTO Patient (Name, AreaID, ContactNo) VALUES ($1, $2, $3) RETURNING *",
      [Name, AreaID, ContactNo]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, AreaID, ContactNo } = req.body;
    const result = await db.query(
      "UPDATE Patient SET Name=$1, AreaID=$2, ContactNo=$3 WHERE PatientID=$4 RETURNING *",
      [Name, AreaID, ContactNo, id]
    );
    if (result.rows.length === 0) return res.status(404).send("Patient not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE patient
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM Patient WHERE PatientID=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).send("Patient not found");
    res.json({ message: "Patient deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
