const express = require("express");
const router = express.Router();
const {
  getAllVaccinationRecords,
  getVaccinationRecordById,
  createVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord,
} = require("../controllers/vaccinationRecord.controller");

router.get("/", getAllVaccinationRecords);
router.get("/:id", getVaccinationRecordById);
router.post("/", createVaccinationRecord);
router.put("/:id", updateVaccinationRecord);
router.delete("/:id", deleteVaccinationRecord);

module.exports = router;
