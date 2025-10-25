const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  createContact,
  deleteContact,
} = require("../controllers/contacts.controller");

router.get("/", getAllContacts);
router.post("/", createContact);
router.delete("/:patientid/:contactpersonid", deleteContact);

module.exports = router;
