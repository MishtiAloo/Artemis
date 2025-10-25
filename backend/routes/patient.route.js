const express = require("express");
const router = express.Router();
const {
  getAllPatients,
  getPatientById,
  searchPatients,
  getPatientsInHighInfectionAreas,
  getPatientsByDiseases,
  getOverdueVaccinations,
  createPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patient.controller");

router.get("/", getAllPatients);
router.get("/search", searchPatients);
router.get("/high-infection-areas", getPatientsInHighInfectionAreas);
router.get("/by-diseases", getPatientsByDiseases);
router.get("/overdue-vaccinations", getOverdueVaccinations);
router.get("/:id", getPatientById);
router.post("/", createPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

module.exports = router;
