const express = require('express');
const router = express.Router();
const { getAllPatients, getPatientById, createPatient, updatePatient, deletePatient } = require('../controllers/patient.controller');

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;
