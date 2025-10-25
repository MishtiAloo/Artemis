const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all hospitals with JOIN
exports.getAllHospitals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        h.HospitalID,
        h.Name,
        h.AreaID,
        h.Capacity,
        a.Name AS area_name,
        a.RiskLevel
      FROM Hospital h
      LEFT JOIN Area a ON h.AreaID = a.AreaID
      ORDER BY h.HospitalID
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllHospitals");
  }
};

// GET hospital by ID
exports.getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `
      SELECT 
        h.*,
        a.Name AS area_name
      FROM Hospital h
      LEFT JOIN Area a ON h.AreaID = a.AreaID
      WHERE h.HospitalID = $1
    `,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Hospital not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "getHospitalById");
  }
};

// SEARCH hospitals by optional filters: name, areaid, batchid
exports.searchHospitals = async (req, res) => {
  try {
    const { name, areaid, batchid } = req.query;

    let query = `
      SELECT 
        h.HospitalID,
        h.Name,
        h.AreaID,
        h.Capacity,
        a.Name AS area_name
      FROM Hospital h
      LEFT JOIN Area a ON h.AreaID = a.AreaID
      WHERE 1=1`;
    const params = [];

    if (name && name.trim() !== "") {
      params.push(`%${name}%`);
      query += ` AND h.Name ILIKE $${params.length}`;
    }

    if (areaid) {
      params.push(areaid);
      query += ` AND h.AreaID = $${params.length}`;
    }

    if (batchid) {
      params.push(batchid);
      // Filter hospitals that have the specified vaccine batch
      query += ` AND EXISTS (SELECT 1 FROM VaccineBatch vb WHERE vb.HospitalID = h.HospitalID AND vb.BatchID = $${params.length})`;
    }

    query += ` ORDER BY h.Name`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "searchHospitals");
  }
};

// GET hospitals nearing capacity (capacity > 80% threshold)
exports.getHospitalsNearCapacity = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        h.HospitalID,
        h.Name,
        h.Capacity,
        a.Name AS area_name,
        COALESCE(COUNT(vb.BatchID), 0) AS current_load
      FROM Hospital h
      LEFT JOIN Area a ON h.AreaID = a.AreaID
      LEFT JOIN VaccineBatch vb ON h.HospitalID = vb.HospitalID
      GROUP BY h.HospitalID, h.Name, h.Capacity, a.Name
      HAVING COALESCE(COUNT(vb.BatchID), 0) > (h.Capacity * 0.8)
      ORDER BY current_load DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getHospitalsNearCapacity");
  }
};

// GET hospital vaccine stock summary (GROUP BY + JOIN)
exports.getHospitalVaccineStock = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        h.HospitalID,
        h.Name AS hospital_name,
        v.Name AS vaccine_name,
        COUNT(vb.BatchID) AS batch_count,
        SUM(vb.NumberOfVaccines) AS total_vaccines
      FROM Hospital h
      JOIN VaccineBatch vb ON h.HospitalID = vb.HospitalID
      JOIN Vaccine v ON vb.VaccineID = v.VaccineID
      GROUP BY h.HospitalID, h.Name, v.VaccineID, v.Name
      ORDER BY h.Name, v.Name
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getHospitalVaccineStock");
  }
};

// CREATE hospital
exports.createHospital = async (req, res) => {
  try {
    const { name, areaid, capacity } = req.body;
    const result = await db.query(
      "INSERT INTO Hospital (Name, AreaID, Capacity) VALUES ($1, $2, $3) RETURNING *",
      [name, areaid, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createHospital");
  }
};

// UPDATE hospital
exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, areaid, capacity } = req.body;
    const result = await db.query(
      "UPDATE Hospital SET Name=$1, AreaID=$2, Capacity=$3 WHERE HospitalID=$4 RETURNING *",
      [name, areaid, capacity, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Hospital not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updateHospital");
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
      return res.status(404).json({ error: "Hospital not found" });
    res.json({ message: "Hospital deleted" });
  } catch (err) {
    handleError(res, err, "deleteHospital");
  }
};
