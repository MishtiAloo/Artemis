const express = require("express");
const router = express.Router();
const {
  getAllVaccines,
  getVaccineById,
  createVaccine,
  updateVaccine,
  deleteVaccine,
  searchVaccines,
  getPoorlyPerformingVaccines,
} = require("../controllers/vaccine.controller");

router.get("/", getAllVaccines);
// search must come before id-based route to avoid 'search' being treated as an id
router.get("/search", searchVaccines);
router.get("/poor-performance", getPoorlyPerformingVaccines);
router.get("/:id", getVaccineById);
router.post("/", createVaccine);
router.put("/:id", updateVaccine);
router.delete("/:id", deleteVaccine);

module.exports = router;
