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
    const resCommand = await GitCommand.clone(req.body.repoName);
	
	if(process.conf.repoName !== req.body.repoName) {
		if (resCommand.status !== 200) {
			return res.status(resCommand.status).send(resCommand.statusText);
		}
	}

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
		period: req.body.period,
		lastCommit: process.conf.lastCommit
	};

	if (response.status !== 200) {
		return res.status(response.status).send(response.statusText);
	}

    if (resCommand.status === 200) {
        const firstCommit = await GitCommand.getFirstCommit();
        ShriApiClient.postBuildRequest(...Object.values(firstCommit))
            .then((response) => {
				process.conf.lastCommit = firstCommit.commitHash;
                console.log(response);
            });

        if (process.conf.period > 0) {
            clearInterval(process.gitEvent);
            process.gitEvent = setInterval(GitCommand.gitEvent, process.conf.period * 60000);
        }
    }

    res.send(response.data);
});

router.get('/builds', (req, res) => {
    ShriApiClient.getBuildList(Number(req.query.offset),Number(req.query.limit))
        .then((response) => {
            if (response.status !== 200) {
                return res.status(response.status).send(response.statusText);
            }

            res.send(response.data.data);
        });
});

router.post('/builds/:commitHash', express.json(), async (req, res) => {
	const { params } = req;
	const { commitHash } = params;
  
	if (commitHash === undefined) {
		return res.status(400).send('Commit hash in params not valid')
	}
	const commitData = await GitCommand.getCommit(commitHash);
	
	if(commitData){
		ShriApiClient.postBuildRequest(...Object.values(commitData))
			.then((response) => {
				if (response.status !== 200) {
					return res.status(response.status).send(response.statusText);
				}

				res.send(response.data.data);
			});
	}else{
		return res.status(400).send('Commit hash not found')
	}
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