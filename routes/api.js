const express = require('express');
const router = express.Router();
const ShriApiClient = require('../src/ShriApiClient');
const GitCommand = require('../src/GitCommand');

const client = new ShriApiClient();

router.get('/', function (req, res) {
    res.send('API');
});

router.get('/settings', (req, res) => {
    client.getConf()
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send({
                id: response.data.data.id,
                repoName: response.data.data.repoName,
                buildCommand: response.data.data.buildCommand,
                mainBranch: response.data.data.mainBranch,
                period: response.data.data.period
            });
        });
});

router.post('/settings', express.json(), async (req, res) => {
    let resCommand = await GitCommand.clone(req.body.repoName);
    
    if (resCommand.status !== 200) {
        return res.status(resCommand.status).send(resCommand.statusText);
    }

    let response = await client.postConf(
        req.body.repoName,
        req.body.buildCommand,
        req.body.mainBranch,
        req.body.period
    );
    
    if (response.status !== 200) {
        return res.status(response.status).send(response.statusText);
    }

    res.send(response);
});

router.get('/builds', (req, res) => {
    client.getBuildList()
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response);
        });
});

router.post('/builds/:commitHash', express.json(), (req, res) => {
    client.postBuildRequest(
        req.body.commitMessage,
        req.params.commitHash,
        req.body.branchName,
        req.body.authorName
    )
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response);
        });
});

router.get('/builds/:commitHash', (req, res) => {
    client.getBuildDetails(req.params.commitHash)
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response);
        });
});

router.get('/builds/:commitHash/logs', (req, res) => {
    client.getBuildLog(req.params.commitHash)
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response);
        });
});

module.exports = router;