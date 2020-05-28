import express from 'express';
import {
    getSettings,
    postSettings,
    delSettings,
    getBuilds,
    getBuildId,
    postAddInstQueue,
    getBuildLog
} from "../src/controller";

const router = express.Router();
router.get('/', function (req, res) {
    res.send('API');
});

router.get('/settings', getSettings);
router.get('/settingsDel', delSettings);
router.get('/builds', getBuilds);
router.get('/builds/:buildId', getBuildId);
router.get('/builds/:buildId/logs', getBuildLog);

router.post('/settings', postSettings);
router.post('/builds/:commitHash', postAddInstQueue);

export default router;