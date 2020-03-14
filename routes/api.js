const express = require('express');
const router = express.Router();
const ShriApiClient = require('../src/ShriApiClient');

const client = new ShriApiClient()

router.get('/', function (req, res) {
    res.send('API');
});

router.get('/settings', (req, res) => {
    client.getConf()
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            res.send(error.response.data)
        });
});

router.post('/settings', (req, res) => {
    // TODO: Загрузка репозитория

    client.postConf(
        req.body.repoName,
        req.body.buildCommand,
        req.body.mainBranch,
        req.body.period
    )
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            res.send(error.response.data)
        });
});

router.get('/builds', (req, res) => {
    client.getBuildList()
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            res.send(error.response.data)
        });
});

router.post('/builds/:commitHash', (req, res) => {
    client.postBuildRequest(
        req.body.commitMessage,
        req.params.commitHash,
        req.body.branchName,
        req.body.authorName
    )
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            res.send(error.response.data)
        });
});

router.get('/builds/:commitHash', (req, res) => {
    res.send(req.params);
});

router.get('/builds/:commitHash/logs', (req, res) => {
    client.getBuildLog(req.params.commitHash)
        .then(function (response) {
            res.send(response.data)
        })
        .catch(function (error) {
            res.send(error.response.data)
        });
});

module.exports = router;