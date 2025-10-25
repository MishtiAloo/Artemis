const db = require("../db");

// Helper to handle errors consistently (match analytics controller)
const handleError = (res, error, label = "") => {
  console.error(`❌ ${label} Error:`, error.message);
  res.status(500).json({ error: error.message });
};

// GET all contacts with JOIN
exports.getAllContacts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.SourcePatientID AS patientid,
        c.TargetPatientID AS contactpersonid,
        c.Date,
        c.AreaID,
        c.ContactType AS contacttype,
        p1.Name AS patient_name,
        p2.Name AS contact_person_name,
        a.Name AS area_name
      FROM Contacts c
      LEFT JOIN Patient p1 ON c.SourcePatientID = p1.PatientID
      LEFT JOIN Patient p2 ON c.TargetPatientID = p2.PatientID
      LEFT JOIN Area a ON c.AreaID = a.AreaID
      ORDER BY c.Date DESC
    `);
    res.json(result.rows);
  } catch (err) {
    handleError(res, err, "getAllContacts");
  }
};

// CREATE contact
exports.createContact = async (req, res) => {
  try {
    const { patientid, contactpersonid, date, areaid, contacttype } = req.body;

    // Normalize contact type to match ENUM values in DB
    const normalize = (val) => {
      if (!val) return null;
      const s = String(val).toLowerCase();
      if (s.includes("direct")) return "direct";
      if (s.includes("indirect")) return "casual"; // closest match
      if (s.includes("household") || s.includes("family")) return "family";
      if (s.includes("healthcare") || s.includes("work")) return "workplace";
      if (s.includes("casual")) return "casual";
      if (s.includes("sexual")) return "sexual";
      return s; // assume it's already a valid enum value
    };

    const contactTypeEnum = normalize(contacttype);

    const result = await db.query(
      "INSERT INTO Contacts (SourcePatientID, TargetPatientID, Date, AreaID, ContactType) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [patientid, contactpersonid, date, areaid, contactTypeEnum]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(res, err, "createContact");
  }
};

// DELETE contact
exports.deleteContact = async (req, res) => {
  try {
    const { patientid, contactpersonid } = req.params;
    const result = await db.query(
      "DELETE FROM Contacts WHERE SourcePatientID=$1 AND TargetPatientID=$2 RETURNING *",
      [patientid, contactpersonid]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err) {
    handleError(res, err, "deleteContact");
  }
};
