const express = require("express");
const router = express.Router();
const {
  getAllAreas,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
  getHighRiskAreas,
  getAreasWithOngoingInfections,
} = require("../controllers/area.controller");

router.get("/", getAllAreas);
router.get("/high-risk", getHighRiskAreas);
router.get("/ongoing-infections", getAreasWithOngoingInfections);
router.get("/:id", getAreaById);
router.post("/", createArea);
router.put("/:id", updateArea);
router.delete("/:id", deleteArea);

module.exports = router;
