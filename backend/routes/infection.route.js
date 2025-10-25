const express = require("express");
const router = express.Router();
const {
  getAllInfections,
  createInfection,
  updateInfection,
  deleteInfection,
} = require("../controllers/infection.controller");

router.get("/", getAllInfections);
router.post("/", createInfection);
router.put("/:patientid/:diseaseid", updateInfection);
router.delete("/:patientid/:diseaseid", deleteInfection);

module.exports = router;
