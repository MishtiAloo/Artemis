const express = require('express');
const router = express.Router();
const { getAllVaccineBatches, getVaccineBatchById, createVaccineBatch, updateVaccineBatch, deleteVaccineBatch } = require('../controllers/vaccineBatch.controller');

router.get('/', getAllVaccineBatches);
router.get('/:id', getVaccineBatchById);
router.post('/', createVaccineBatch);
router.put('/:id', updateVaccineBatch);
router.delete('/:id', deleteVaccineBatch);

module.exports = router;
