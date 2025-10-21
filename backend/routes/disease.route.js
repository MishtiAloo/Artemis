const express = require('express');
const router = express.Router();
const { getAllDiseases, getDiseaseById, createDisease, updateDisease, deleteDisease } = require('../controllers/disease.controller');

router.get('/', getAllDiseases);
router.get('/:id', getDiseaseById);
router.post('/', createDisease);
router.put('/:id', updateDisease);
router.delete('/:id', deleteDisease);

module.exports = router;
