const db = require("../db");

// GET all hospitals
exports.getAllHospitals = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Hospital");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM Hospital WHERE HospitalID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Hospital not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE hospital
exports.createHospital = async (req, res) => {
  try {
    const { Name, AreaID, Capacity } = req.body;
    const result = await db.query(
      "INSERT INTO Hospital (Name, AreaID, Capacity) VALUES ($1, $2, $3) RETURNING *",
      [Name, AreaID, Capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE hospital
exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, AreaID, Capacity } = req.body;
    const result = await db.query(
      "UPDATE Hospital SET Name=$1, AreaID=$2, Capacity=$3 WHERE HospitalID=$4 RETURNING *",
      [Name, AreaID, Capacity, id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Hospital not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE hospital
exports.deleteHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Hospital WHERE HospitalID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Hospital not found");
    res.json({ message: "Hospital deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
