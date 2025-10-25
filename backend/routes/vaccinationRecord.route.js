const express = require("express");
const router = express.Router();
const {
  getAllVaccinationRecords,
  createVaccinationRecord,
  deleteVaccinationRecord,
} = require("../controllers/vaccinationRecord.controller");

router.get("/", getAllVaccinationRecords);
router.post("/", createVaccinationRecord);
router.delete("/:patientid/:batchid", deleteVaccinationRecord);

module.exports = router;
