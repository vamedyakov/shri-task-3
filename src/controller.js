const ShriApiClient = require('./ShriApiClient');
const GitCommand = require('./GitCommand');

module.exports.getSettings = async (_, res) => {
    let result;
    try {
        result = await ShriApiClient.getConf();
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString());
    }
    if (result) {
        const { data, status, statusText } = result;

        if (status !== 200) {
            return res.status(500).send(statusText);
        }
        if ('data' in data) {
            process.conf = {
                repoName: data.data.repoName,
                buildCommand: data.data.buildCommand,
                mainBranch: data.data.mainBranch,
                period: data.data.period
            };

            result = process.conf;

            return res.status(200).send(result);
        }
        res.status(204).send('no content');
    }
}

module.exports.postSettings = async (req, res) => {
    const { body } = req;

    const resCommand = await GitCommand.clone(body.repoName);

    if (process.conf.repoName !== body.repoName) {
        if (resCommand.status !== 200) {
            return res.status(resCommand.status).send(resCommand.statusText);
        }
    }

    let result;
    try {
        result = await ShriApiClient.postConf(
            req.body.repoName,
            req.body.buildCommand,
            req.body.mainBranch,
            req.body.period
        );
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString());
    }

    if (result) {
        const { status, statusText } = result;

        if (status !== 200) {
            return res.status(500).send(statusText);
        }

        process.conf = {
            repoName: req.body.repoName,
            buildCommand: req.body.buildCommand,
            mainBranch: req.body.mainBranch,
            period: req.body.period,
            lastCommit: process.conf.lastCommit
        };

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

        return res.status(200).send('ok');
    }
}

module.exports.delSettings = async (_, res) => {
    let result;
    try {
        result = await ShriApiClient.deleteConf();
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString());
    }
    if (result) {
        const { data, status, statusText } = result;

        if (status !== 200) {
            return res.status(500).send(statusText);
        }

        return res.status(200).send(data);
    }
}

module.exports.getBuilds = async (req, res) => {
    const { query } = req;
    const { offset, limit } = query;
    let result;
    try {
        result = await ShriApiClient.getBuildList(Number(offset), Number(limit));
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString());
    }

    if (result) {
        const { data, status, statusText } = result;

        if (status !== 200) {
            return res.status(500).send(statusText);
        }

        if ('data' in data) {
            return res.status(200).send(data.data);
        }

        res.status(204).send('no content');
    }
}

module.exports.getBuildLog = async (req, res) => {
    const { params } = req;
    const { buildId } = params;
    let result;
    try {
        result = await ShriApiClient.getBuildLog(buildId);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString());
    }

    if (result) {
        const { data, status, statusText } = result;

        if (status !== 200) {
            return res.status(500).send(statusText);
        }

        if ('data' in data) {
            return res.status(200).send(data.data);
        }

        res.status(204).send('no content');
    }
}

module.exports.postAddInstQueue = async (req, res) => {
	const { params } = req;
	const { commitHash } = params;
  
	if (commitHash === undefined) {
		return res.status(400).send('Commit hash in params not valid')
	}
    const commitData = await GitCommand.getCommit(commitHash);
    
	if(commitData){
        let result;
        try {
            result = await ShriApiClient.postBuildRequest(...Object.values(commitData));
        } catch (err) {
            console.log(err);
            res.status(500).send(err.toString());
        }
    
        if (result) {
            const { data, status, statusText } = result;
    
            if (status !== 200) {
                return res.status(500).send(statusText);
            }
    
            if ('data' in data) {
                return res.status(200).send(data.data);
            }
    
            res.status(204).send('no content');
        }
    }else{
		return res.status(500).send('Commit hash not found')
	}
}

module.exports.getBuildId = async (req, res) => {
    const { params } = req;
    const { buildId } = params;
    let result;
    try {
        result = await ShriApiClient.getBuildDetails(buildId);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.toString());
    }

    if (result) {
        const { data, status, statusText } = result;

        if (status !== 200) {
            return res.status(500).send(statusText);
        }

        if ('data' in data) {
            return res.status(200).send(data.data);
        }

        res.status(204).send('no content');
    }
}