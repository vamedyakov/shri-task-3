const express = require('express');
const controller = require('../controllers/controller');
const router = express.Router();

router.post('/notify-agent', controller.registerAgent);
router.post('/notify-build-result', controller.sendResultBuild);

module.exports = router;