const path = require('path');
const nodegit = require("nodegit");
const ShriApiClient = require('./ShriApiClient');

const gitEvent = async () => {
    const commits = await checkLog();

    if (commits.length > 0) {
        commits.forEach((commit) => {
            ShriApiClient.postBuildRequest(...Object.values(commit))
                .then((response) => {
                    console.log(response);
                });
        });
    }
}

const checkLog = () => {
    return new Promise(async (res, rej) => {
        const newCommit = [];
        let lastCommitHash;
        const repProj = process.conf.repoName.split('/');
        const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);

        const repo = await nodegit.Repository.open(path.resolve(pathRep, ".git"));
        await repo.fetchAll();
        await repo.mergeBranches(process.conf.mainBranch, `origin/${process.conf.mainBranch}`);
        const firstCommit = await repo.getBranchCommit(process.conf.mainBranch);

        let response = await ShriApiClient.getBuildList(0, 1);
        if (response.status === 200) {
            if (response.data.data.length > 0) {
                lastCommitHash = response.data.data[0].commitHash
            }
        }

        if (lastCommitHash) {
            let history = firstCommit.history(nodegit.Revwalk.SORT.TIME);
            history.start();

            history.on("commit", function (commit) {
                if (commit.sha() === lastCommitHash) {
                    res(newCommit);
                    history.removeAllListeners('commit');
                } else {
                    newCommit.push({
                        commitMessage: commit.message(),
                        commitHash: commit.sha(),
                        branchName: process.conf.mainBranch,
                        authorName: commit.author().name()
                    });
                }
            });
        }
    });
}

const getFirstCommit = async () => {
    const repProj = process.conf.repoName.split('/');
    const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);

    const repo = await nodegit.Repository.open(path.resolve(pathRep, ".git"));
    const firstCommit = await repo.getBranchCommit(process.conf.mainBranch);

    return {
        commitMessage: firstCommit.message(),
        commitHash: firstCommit.sha(),
        branchName: process.conf.mainBranch,
        authorName: firstCommit.author().name()
    };
}

const clone = async (name) => {
    let result = {
        data: '',
        status: 500,
        statusText: 'Bad request'
    }
    let res;
    const repProj = name.split('/');

    if (repProj.length > 1) {
        const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);

        try {
            res = await nodegit.Clone(`https://github.com/${name}`, pathRep);
        } catch (err) {
            res = err;
        }

        if (res instanceof nodegit.Repository) {
            result.status = 200;
            result.statusText = 'ok';
        } else {
            result.statusText = res.toString();
        }
    }

    return result;

};


module.exports = { gitEvent, checkLog, getFirstCommit, clone}