const db = require("../db");

// GET all vaccines
exports.getAllVaccines = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Vaccine");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET vaccine by ID
exports.getVaccineById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM Vaccine WHERE VaccineID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccine not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE vaccine
exports.createVaccine = async (req, res) => {
  try {
    const { TargetedDiseaseID, Name, Manufacturer, DoseCount, EffectiveDays } =
      req.body;
    const result = await db.query(
      "INSERT INTO Vaccine (TargetedDiseaseID, Name, Manufacturer, DoseCount, EffectiveDays) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [TargetedDiseaseID, Name, Manufacturer, DoseCount, EffectiveDays]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE vaccine
exports.updateVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const { TargetedDiseaseID, Name, Manufacturer, DoseCount, EffectiveDays } =
      req.body;
    const result = await db.query(
      "UPDATE Vaccine SET TargetedDiseaseID=$1, Name=$2, Manufacturer=$3, DoseCount=$4, EffectiveDays=$5 WHERE VaccineID=$6 RETURNING *",
      [TargetedDiseaseID, Name, Manufacturer, DoseCount, EffectiveDays, id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccine not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE vaccine
exports.deleteVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Vaccine WHERE VaccineID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Vaccine not found");
    res.json({ message: "Vaccine deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
