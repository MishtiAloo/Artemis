const db = require("../db");

// GET all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM Contacts");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT * FROM Contacts WHERE ContactID = $1",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Contact not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// CREATE contact
exports.createContact = async (req, res) => {
  try {
    const { SourcePatientID, TargetPatientID, Date, AreaID, ContactType } =
      req.body;
    const result = await db.query(
      "INSERT INTO Contacts (SourcePatientID, TargetPatientID, Date, AreaID, ContactType) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [SourcePatientID, TargetPatientID, Date, AreaID, ContactType]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// UPDATE contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { SourcePatientID, TargetPatientID, Date, AreaID, ContactType } =
      req.body;
    const result = await db.query(
      "UPDATE Contacts SET SourcePatientID=$1, TargetPatientID=$2, Date=$3, AreaID=$4, ContactType=$5 WHERE ContactID=$6 RETURNING *",
      [SourcePatientID, TargetPatientID, Date, AreaID, ContactType, id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Contact not found");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM Contacts WHERE ContactID=$1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).send("Contact not found");
    res.json({ message: "Contact deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
