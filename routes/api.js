const express = require('express');
const router = express.Router();
const ShriApiClient = require('../src/ShriApiClient');
const GitCommand = require('../src/GitCommand');

router.get('/', function (req, res) {
    res.send('API');
});

router.get('/settings', (req, res) => {
    ShriApiClient.getConf()
        .then((response) => {
			let result;
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }
			
			result = response.data;

			if(response.data.data){
				process.conf = {
					repoName: response.data.data.repoName,
					buildCommand: response.data.data.buildCommand,
					mainBranch: response.data.data.mainBranch,
					period: response.data.data.period
				};
				
				result = process.conf;
			}

			res.send(result);
        });
});

router.get('/settingsDel', (req, res) => {
    ShriApiClient.deleteConf()
        .then((response) => {
			let result;
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

			res.send(response);
        });
});

router.post('/settings', express.json(), async (req, res) => {
    let response = await ShriApiClient.postConf(
        req.body.repoName,
        req.body.buildCommand,
        req.body.mainBranch,
        req.body.period
    );

    process.conf = {
        repoName: req.body.repoName,
        buildCommand: req.body.buildCommand,
        mainBranch: req.body.mainBranch,
        period: req.body.period
    };

    if (response.status !== 200) {
        return res.status(response.status).send(response.statusText);
    }

    const resCommand = await GitCommand.clone(req.body.repoName);

    if (resCommand.status === 200) {
        const firstCommit = await GitCommand.getFirstCommit();
        ShriApiClient.postBuildRequest(...Object.values(firstCommit))
            .then((response) => {
                console.log(response);
            });

        if (process.conf.period > 0) {
            clearInterval(process.gitEvent);
            process.gitEvent = setInterval(GitCommand.gitEvent, process.conf.period * 60000);
        }
    }

    res.send(response);
});

router.get('/builds', (req, res) => {
    ShriApiClient.getBuildList()
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response.data.data);
        });
});

router.post('/builds/:buildId', express.json(), (req, res) => {
    ShriApiClient.postBuildRequest(
        req.body.commitMessage,
        req.params.buildId,
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

router.get('/builds/:buildId', (req, res) => {
    ShriApiClient.getBuildDetails(req.params.buildId)
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response.data.data);
        });
});

router.get('/builds/:buildId/logs', (req, res) => {
    ShriApiClient.getBuildLog(req.params.buildId)
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response.data);
        });
});

module.exports = router;