const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/exampleController');

// Define routes
router.get('/', exampleController.getAllExamples);
router.post('/', exampleController.createExample);
router.get('/:id', exampleController.getExampleById);
router.put('/:id', exampleController.updateExample);
router.delete('/:id', exampleController.deleteExample);

module.exports = router;