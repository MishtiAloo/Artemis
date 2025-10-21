const db = require("../db");

// GET all infections
exports.getAllInfections = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Infection");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET infection by ID
exports.getInfectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM Infection WHERE InfectionID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Infection not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE infection
exports.createInfection = async (req, res) => {
  try {
    const {
      PatientID,
      DiseaseID,
      DiagnosisDate,
      RecoveryDate,
      HospitalID,
      Status,
    } = req.body;
    const result = await db.query(
      "INSERT INTO Infection (PatientID, DiseaseID, DiagnosisDate, RecoveryDate, HospitalID, Status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [PatientID, DiseaseID, DiagnosisDate, RecoveryDate, HospitalID, Status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE infection
exports.updateInfection = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      PatientID,
      DiseaseID,
      DiagnosisDate,
      RecoveryDate,
      HospitalID,
      Status,
    } = req.body;
    const result = await db.query(
      "UPDATE Infection SET PatientID=$1, DiseaseID=$2, DiagnosisDate=$3, RecoveryDate=$4, HospitalID=$5, Status=$6 WHERE InfectionID=$7 RETURNING *",
      [
        PatientID,
        DiseaseID,
        DiagnosisDate,
        RecoveryDate,
        HospitalID,
        Status,
        id,
      ]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Infection not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE infection
exports.deleteInfection = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Infection WHERE InfectionID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Infection not found");
    res.json({ message: "Infection deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
