const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analytics.controller");

router.get("/stats", analyticsController.getStats);
router.get("/diseases-by-area", analyticsController.getDiseasesByArea);
router.get("/fully-vaccinated", analyticsController.getFullyVaccinated);
router.get(
  "/unvaccinated-infected",
  analyticsController.getUnvaccinatedInfected
);
router.get("/avg-recovery-days", analyticsController.getAvgRecoveryDays);
router.get(
  "/high-risk-no-contact",
  analyticsController.getPatientsHighRiskNoContact
);
router.get(
  "/multiple-diseases",
  analyticsController.getPatientsMultipleDiseases
);

module.exports = router;
