const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  searchContactsByPatientAndDate,
  createContact,
  deleteContact,
} = require("../controllers/contacts.controller");

router.get("/", getAllContacts);
router.get("/search", searchContactsByPatientAndDate);
router.post("/", createContact);
router.delete("/:patientid/:contactpersonid", deleteContact);

module.exports = router;
