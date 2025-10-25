const express = require("express");
const router = express.Router();
const {
  getAllHospitals,
  getHospitalById,
  searchHospitals,
  getHospitalsNearCapacity,
  getHospitalVaccineStock,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospital.controller");

router.get("/", getAllHospitals);
router.get("/search", searchHospitals);
router.get("/near-capacity", getHospitalsNearCapacity);
router.get("/vaccine-stock", getHospitalVaccineStock);
router.get("/:id", getHospitalById);
router.post("/", createHospital);
router.put("/:id", updateHospital);
router.delete("/:id", deleteHospital);

module.exports = router;
