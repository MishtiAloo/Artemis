const express = require('express');
const router = express.Router();
const { getAllAreas, getAreaById, createArea, updateArea, deleteArea } = require('../controllers/area.controller');

router.get('/', getAllAreas);
router.get('/:id', getAreaById);
router.post('/', createArea);
router.put('/:id', updateArea);
router.delete('/:id', deleteArea);

module.exports = router;
