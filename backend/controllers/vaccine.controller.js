const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all vaccines with JOIN
exports.getAllVaccines = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.VaccineID,
        v.TargetedDiseaseID,
        v.Name,
        v.Manufacturer,
        v.DoseCount,
        v.EffectiveDays,
        d.Name AS disease_name
      FROM Vaccine v
      LEFT JOIN Disease d ON v.TargetedDiseaseID = d.DiseaseID
      ORDER BY v.VaccineID
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllVaccines");
  }
};

// GET vaccine by ID
exports.getVaccineById = async (req, res) => {
  try {
    const { id } = req.params;
    const vid = parseInt(id, 10);
    if (Number.isNaN(vid))
      return res.status(400).json({ error: "Invalid vaccine id" });
    const result = await db.query(
      `
      SELECT 
        v.*,
        d.Name AS disease_name
      FROM Vaccine v
      LEFT JOIN Disease d ON v.TargetedDiseaseID = d.DiseaseID
      WHERE v.VaccineID = $1
    `,
      [vid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccine not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "getVaccineById");
  }
};

// SEARCH vaccines by name (WHERE LIKE)
exports.searchVaccines = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await db.query(
      `
      SELECT 
        v.VaccineID,
        v.Name,
        v.Manufacturer,
        v.DoseCount,
        d.Name AS disease_name
      FROM Vaccine v
      LEFT JOIN Disease d ON v.TargetedDiseaseID = d.DiseaseID
      WHERE v.Name ILIKE $1
      ORDER BY v.Name
    `,
      [`%${name}%`]
    );
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "searchVaccines");
  }
};

// GET vaccines sorted by poor performance: percentage of vaccinated people who still died from targeted disease
exports.getPoorlyPerformingVaccines = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        v.VaccineID,
        v.Name AS vaccine_name,
        d.Name AS disease_name,
        COUNT(DISTINCT vr.PatientID) AS vaccinated_people,
        COUNT(DISTINCT CASE WHEN i.Status = 'dead' AND i.DiseaseID = v.TargetedDiseaseID THEN i.PatientID END) AS deceased_people,
        CASE WHEN COUNT(DISTINCT vr.PatientID) = 0 THEN 0
             ELSE ROUND(100.0 * COUNT(DISTINCT CASE WHEN i.Status = 'dead' AND i.DiseaseID = v.TargetedDiseaseID THEN i.PatientID END)::numeric
                        / COUNT(DISTINCT vr.PatientID)::numeric, 2)
        END AS death_percentage
      FROM Vaccine v
      LEFT JOIN Disease d ON v.TargetedDiseaseID = d.DiseaseID
      LEFT JOIN VaccineBatch vb ON vb.VaccineID = v.VaccineID
      LEFT JOIN VaccinationRecord vr ON vr.BatchID = vb.BatchID
      LEFT JOIN Infection i ON i.PatientID = vr.PatientID AND i.DiseaseID = v.TargetedDiseaseID
      GROUP BY v.VaccineID, v.Name, d.Name
      ORDER BY death_percentage DESC, vaccinated_people DESC, v.Name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getPoorlyPerformingVaccines");
  }
};

// CREATE vaccine
exports.createVaccine = async (req, res) => {
  try {
    const { targeteddiseaseid, name, manufacturer, dosecount, effectivedays } =
      req.body;
    const tdid = targeteddiseaseid ? parseInt(targeteddiseaseid, 10) : null;
    const doses = parseInt(dosecount, 10) || 1;
    const eff = parseInt(effectivedays, 10) || 365;
    const result = await db.query(
      "INSERT INTO Vaccine (TargetedDiseaseID, Name, Manufacturer, DoseCount, EffectiveDays) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [tdid, name, manufacturer, doses, eff]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createVaccine");
  }
};

// UPDATE vaccine
exports.updateVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const vid = parseInt(id, 10);
    if (Number.isNaN(vid))
      return res.status(400).json({ error: "Invalid vaccine id" });
    const { targeteddiseaseid, name, manufacturer, dosecount, effectivedays } =
      req.body;
    const tdid = targeteddiseaseid ? parseInt(targeteddiseaseid, 10) : null;
    const doses = parseInt(dosecount, 10) || 1;
    const eff = parseInt(effectivedays, 10) || 365;
    const result = await db.query(
      "UPDATE Vaccine SET TargetedDiseaseID=$1, Name=$2, Manufacturer=$3, DoseCount=$4, EffectiveDays=$5 WHERE VaccineID=$6 RETURNING *",
      [tdid, name, manufacturer, doses, eff, vid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccine not found" });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "updateVaccine");
  }
};

// DELETE vaccine
exports.deleteVaccine = async (req, res) => {
  try {
    const { id } = req.params;
    const vid = parseInt(id, 10);
    if (Number.isNaN(vid))
      return res.status(400).json({ error: "Invalid vaccine id" });
    const result = await db.query(
      "DELETE FROM Vaccine WHERE VaccineID=$1 RETURNING *",
      [vid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Vaccine not found" });
    res.json({ message: "Vaccine deleted" });
  } catch (err) {
    handleError(res, err, "deleteVaccine");
  }
};
