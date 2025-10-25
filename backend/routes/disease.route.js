const express = require("express");
const router = express.Router();
const {
  getAllDiseases,
  getDiseasesWithoutVaccines,
  getDiseaseById,
  createDisease,
  updateDisease,
  deleteDisease,
} = require("../controllers/disease.controller");

router.get("/", getAllDiseases);
// place specific route before param route to avoid conflict
router.get("/without-vaccines", getDiseasesWithoutVaccines);
router.get("/:id", getDiseaseById);
router.post("/", createDisease);
router.put("/:id", updateDisease);
router.delete("/:id", deleteDisease);

module.exports = router;
