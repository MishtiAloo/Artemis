const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all vaccine batches with JOIN
exports.getAllVaccineBatches = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        vb.BatchID,
        vb.VaccineID,
        vb.NumberOfVaccines,
        vb.RemainingVaccines,
        vb.HospitalID,
        v.Name AS vaccine_name,
        h.Name AS hospital_name
      FROM VaccineBatch vb
      LEFT JOIN Vaccine v ON vb.VaccineID = v.VaccineID
      LEFT JOIN Hospital h ON vb.HospitalID = h.HospitalID
      ORDER BY vb.BatchID
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllVaccineBatches");
  }
};

// GET vaccine batch by ID
exports.getVaccineBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        vb.*,
        v.Name AS vaccine_name,
        h.Name AS hospital_name
      FROM VaccineBatch vb
      LEFT JOIN Vaccine v ON vb.VaccineID = v.VaccineID
      LEFT JOIN Hospital h ON vb.HospitalID = h.HospitalID
      WHERE vb.BatchID = $1
    `,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccine batch not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "getVaccineBatchById");
  }
};

// CREATE vaccine batch
exports.createVaccineBatch = async (req, res) => {
  try {
    const { vaccineid, numberofvaccines, hospitalid } = req.body;
    const result = await db.query(
      "INSERT INTO VaccineBatch (VaccineID, NumberOfVaccines, HospitalID) VALUES ($1, $2, $3) RETURNING *",
      [vaccineid, numberofvaccines, hospitalid]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createVaccineBatch");
  }
};

// UPDATE vaccine batch
exports.updateVaccineBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { vaccineid, numberofvaccines, hospitalid } = req.body;
    const result = await db.query(
      "UPDATE VaccineBatch SET VaccineID=$1, NumberOfVaccines=$2, HospitalID=$3 WHERE BatchID=$4 RETURNING *",
      [vaccineid, numberofvaccines, hospitalid, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccine batch not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updateVaccineBatch");
  }
};

// DELETE vaccine batch
exports.deleteVaccineBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM VaccineBatch WHERE BatchID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccine batch not found" });
    res.json({ message: "Vaccine batch deleted" });
  } catch (err) {
    handleError(res, err, "deleteVaccineBatch");
  }
};
