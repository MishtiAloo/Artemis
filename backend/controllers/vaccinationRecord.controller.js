const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all vaccination records with JOIN
exports.getAllVaccinationRecords = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        vr.PatientID,
        vr.BatchID,
        vr.DoseNo,
        vr.Date,
        vr.NextDueDate,
        p.Name AS patient_name,
        v.Name AS vaccine_name
      FROM VaccinationRecord vr
      LEFT JOIN Patient p ON vr.PatientID = p.PatientID
      LEFT JOIN VaccineBatch vb ON vr.BatchID = vb.BatchID
      LEFT JOIN Vaccine v ON vb.VaccineID = v.VaccineID
      ORDER BY vr.Date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllVaccinationRecords");
  }
};

// CREATE vaccination record
exports.createVaccinationRecord = async (req, res) => {
  try {
    const { patientid, batchid, doseno, date, nextduedate } = req.body;
    const nextDue = nextduedate ? nextduedate : null; // allow null/empty next due date
    const result = await db.query(
      "INSERT INTO VaccinationRecord (PatientID, BatchID, DoseNo, Date, NextDueDate) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patientid, batchid, doseno, date, nextDue]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createVaccinationRecord");
  }
};

// DELETE vaccination record
exports.deleteVaccinationRecord = async (req, res) => {
  try {
    const { patientid, batchid } = req.params;
    const result = await db.query(
      "DELETE FROM VaccinationRecord WHERE PatientID=$1 AND BatchID=$2 RETURNING *",
      [patientid, batchid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccination record not found" });
    res.json({ message: "Vaccination record deleted" });
  } catch (err) {
    handleError(res, err, "deleteVaccinationRecord");
  }
};
