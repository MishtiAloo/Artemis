const express = require("express");
const router = express.Router();
const {
  getAllInfections,
  getInfectionById,
  createInfection,
  updateInfection,
  deleteInfection,
} = require("../controllers/infection.controller");

router.get("/", getAllInfections);
router.get("/:id", getInfectionById);
router.post("/", createInfection);
router.put("/:id", updateInfection);
router.delete("/:id", deleteInfection);

module.exports = router;
