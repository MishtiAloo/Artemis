const db = require("../db");

// GET all vaccination records
exports.getAllVaccinationRecords = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM VaccinationRecord");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET vaccination record by ID
exports.getVaccinationRecordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM VaccinationRecord WHERE RecordID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccination record not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE vaccination record
exports.createVaccinationRecord = async (req, res) => {
  try {
    const { PatientID, BatchID, DoseNo, Date, NextDueDate } = req.body;
    const result = await db.query(
      "INSERT INTO VaccinationRecord (PatientID, BatchID, DoseNo, Date, NextDueDate) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [PatientID, BatchID, DoseNo, Date, NextDueDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE vaccination record
exports.updateVaccinationRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { PatientID, BatchID, DoseNo, Date, NextDueDate } = req.body;
    const result = await db.query(
      "UPDATE VaccinationRecord SET PatientID=$1, BatchID=$2, DoseNo=$3, Date=$4, NextDueDate=$5 WHERE RecordID=$6 RETURNING *",
      [PatientID, BatchID, DoseNo, Date, NextDueDate, id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccination record not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE vaccination record
exports.deleteVaccinationRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM VaccinationRecord WHERE RecordID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccination record not found");
    res.json({ message: "Vaccination record deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
