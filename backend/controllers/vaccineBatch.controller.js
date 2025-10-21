const db = require("../db");

// GET all vaccine batches
exports.getAllVaccineBatches = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM VaccineBatch");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET vaccine batch by ID
exports.getVaccineBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM VaccineBatch WHERE BatchID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccine batch not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE vaccine batch
exports.createVaccineBatch = async (req, res) => {
  try {
    const { VaccineID, NumberOfVaccines, HospitalID } = req.body;
    const result = await db.query(
      "INSERT INTO VaccineBatch (VaccineID, NumberOfVaccines, HospitalID) VALUES ($1, $2, $3) RETURNING *",
      [VaccineID, NumberOfVaccines, HospitalID]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE vaccine batch
exports.updateVaccineBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { VaccineID, NumberOfVaccines, HospitalID } = req.body;
    const result = await db.query(
      "UPDATE VaccineBatch SET VaccineID=$1, NumberOfVaccines=$2, HospitalID=$3 WHERE BatchID=$4 RETURNING *",
      [VaccineID, NumberOfVaccines, HospitalID, id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccine batch not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
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
      return res.status(404).send("Vaccine batch not found");
    res.json({ message: "Vaccine batch deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
