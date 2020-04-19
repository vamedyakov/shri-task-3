const express = require('express');
const router = express.Router();

const controller = require('../src/controller');

router.get('/', function (req, res) {
    res.send('API');
});

router.get('/settings', controller.getSettings);

router.get('/settingsDel', controller.delSettings);

router.post('/settings', express.json(), controller.postSettings);

router.get('/builds', controller.getBuilds);

router.post('/builds/:commitHash', express.json(), controller.postSettings);

router.get('/builds/:buildId', controller.getBuildId);

router.get('/builds/:buildId/logs', controller.getBuildLog);

module.exports = router;