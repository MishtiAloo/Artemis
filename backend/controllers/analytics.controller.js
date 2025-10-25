const db = require("../db");

// Helper to handle errors consistently
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// === Get overall stats for dashboard ===
exports.getStats = async (req, res) => {
  try {
    const totalPatients = await db.query("SELECT COUNT(*) FROM Patient");
    const activeInfections = await db.query(
      "SELECT COUNT(*) FROM Infection WHERE status = 'active'"
    );
    const totalVaccines = await db.query("SELECT COUNT(*) FROM Vaccine");
    const totalHospitals = await db.query("SELECT COUNT(*) FROM Hospital");

    res.json({
      totalPatients: totalPatients.rows[0]?.count ?? 0,
      activeInfections: activeInfections.rows[0]?.count ?? 0,
      totalVaccines: totalVaccines.rows[0]?.count ?? 0,
      totalHospitals: totalHospitals.rows[0]?.count ?? 0,
    });
  } catch (error) {
    handleError(res, error, "getStats");
  }
};

// === Disease prominence by area ===
exports.getDiseasesByArea = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        a.name AS area_name,
        d.name AS disease_name,
        COUNT(*) AS case_count
      FROM Infection i
      JOIN Patient p ON i.patientid = p.patientid
      JOIN Area a ON p.areaid = a.areaid
      JOIN Disease d ON i.diseaseid = d.diseaseid
      GROUP BY a.name, d.name
      ORDER BY case_count DESC
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error, "getDiseasesByArea");
  }
};

// === Fully/Partially vaccinated patients ===
exports.getFullyVaccinated = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.name AS patient_name,
        v.name AS vaccine_name,
        v.dosecount AS required_doses,
        COUNT(vr.doseno) AS completed_doses,
        CASE 
          WHEN COUNT(vr.doseno) >= v.dosecount THEN 'Fully Vaccinated'
          ELSE 'Partially Vaccinated'
        END AS vaccination_status
      FROM Patient p
      JOIN VaccinationRecord vr ON p.patientid = vr.patientid
      JOIN VaccineBatch vb ON vr.batchid = vb.batchid
      JOIN Vaccine v ON vb.vaccineid = v.vaccineid
      GROUP BY p.patientid, p.name, v.vaccineid, v.name, v.dosecount
      ORDER BY p.name
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error, "getFullyVaccinated");
  }
};

// === Patients infected but never vaccinated ===
exports.getUnvaccinatedInfected = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT
        p.patientid,
        p.name AS patient_name,
        d.name AS disease_name,
        i.status
      FROM Patient p
      JOIN Infection i ON p.patientid = i.patientid
      JOIN Disease d ON i.diseaseid = d.diseaseid
      WHERE p.patientid NOT IN (
        SELECT DISTINCT patientid FROM VaccinationRecord
      )
      ORDER BY p.name
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error, "getUnvaccinatedInfected");
  }
};

// === Average recovery days by disease ===
exports.getAvgRecoveryDays = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        d.name AS disease_name,
        AVG(i.recoverydate - i.diagnosisdate) AS avg_recovery_days
      FROM Infection i
      JOIN Disease d ON i.diseaseid = d.diseaseid
      WHERE i.recoverydate IS NOT NULL
      GROUP BY d.diseaseid, d.name
      ORDER BY avg_recovery_days DESC
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error, "getAvgRecoveryDays");
  }
};

// === Patients in high-risk zones but not contacted ===
exports.getPatientsHighRiskNoContact = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.patientid,
        p.name AS patient_name,
        a.name AS area_name,
        a.risklevel
      FROM Patient p
      JOIN Area a ON p.areaid = a.areaid
      WHERE a.risklevel IN ('high', 'dangerous', 'extreme')
      AND p.patientid NOT IN (
        SELECT sourcepatientid FROM Contacts
        UNION
        SELECT targetpatientid FROM Contacts
      )
      ORDER BY a.risklevel DESC, p.name
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error, "getPatientsHighRiskNoContact");
  }
};

// === Patients with multiple diseases ===
exports.getPatientsMultipleDiseases = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.patientid,
        p.name AS patient_name,
        COUNT(DISTINCT i.diseaseid) AS disease_count,
        STRING_AGG(DISTINCT d.name, ', ') AS diseases
      FROM Patient p
      JOIN Infection i ON p.patientid = i.patientid
      JOIN Disease d ON i.diseaseid = d.diseaseid
      GROUP BY p.patientid, p.name
      HAVING COUNT(DISTINCT i.diseaseid) > 1
      ORDER BY disease_count DESC
    `);
    res.json(result.rows);
  } catch (error) {
    handleError(res, error, "getPatientsMultipleDiseases");
  }
};
