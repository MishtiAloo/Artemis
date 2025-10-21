const express = require('express');
const router = express.Router();
const { getAllVaccines, getVaccineById, createVaccine, updateVaccine, deleteVaccine } = require('../controllers/vaccine.controller');

router.get('/', getAllVaccines);
router.get('/:id', getVaccineById);
router.post('/', createVaccine);
router.put('/:id', updateVaccine);
router.delete('/:id', deleteVaccine);

module.exports = router;
