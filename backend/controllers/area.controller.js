const db = require("../db");

// GET all areas
exports.getAllAreas = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Area");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET area by ID
exports.getAreaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM Area WHERE AreaID = $1", [id]);
    if (result.rows.length === 0) return res.status(404).send("Area not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE area
exports.createArea = async (req, res) => {
  try {
    const { Name, Population, InfectionRate, RiskLevel } = req.body;
    const result = await db.query(
      "INSERT INTO Area (Name, Population, InfectionRate, RiskLevel) VALUES ($1, $2, $3, $4) RETURNING *",
      [Name, Population, InfectionRate, RiskLevel]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE area
exports.updateArea = async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Population, InfectionRate, RiskLevel } = req.body;
    const result = await db.query(
      "UPDATE Area SET Name=$1, Population=$2, InfectionRate=$3, RiskLevel=$4 WHERE AreaID=$5 RETURNING *",
      [Name, Population, InfectionRate, RiskLevel, id]
    );
    if (result.rows.length === 0) return res.status(404).send("Area not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE area
exports.deleteArea = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("DELETE FROM Area WHERE AreaID=$1 RETURNING *", [id]);
    if (result.rows.length === 0) return res.status(404).send("Area not found");
    res.json({ message: "Area deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
