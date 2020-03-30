const path = require('path');
const nodegit = require("nodegit");
const ShriApiClient = require('./ShriApiClient');
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const removeRep = async () => {
    try {
        await exec(`rm -rf ./repositories/*`)
        return "ok";
    } catch (e) {
        return e;
    }
}

const gitEvent = async () => {
    const commits = await checkLog();

    if (commits.length > 0) {
        commits.forEach((commit) => {
            ShriApiClient.postBuildRequest(...Object.values(commit))
                .then((response) => {
                    console.log(response);
                });
        });
        const firstCommit = await GitCommand.getFirstCommit();
        process.conf.lastCommit = firstCommit.commitHash;
    }
}

const checkLog = () => {
    return new Promise(async (res, rej) => {
        const newCommit = [];
        let lastCommitHash = process.conf.lastCommit;
        const repProj = process.conf.repoName.split('/');
        const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);

        const repo = await nodegit.Repository.open(path.resolve(pathRep, ".git"));
        await repo.fetchAll();
        await repo.mergeBranches(process.conf.mainBranch, `origin/${process.conf.mainBranch}`);
        const firstCommit = await repo.getBranchCommit(process.conf.mainBranch);

        if (lastCommitHash) {
            let history = firstCommit.history(nodegit.Revwalk.SORT.TIME);
            history.start();

            history.on("commit", function (commit) {
                if (commit.sha() === lastCommitHash) {
                    history.removeAllListeners('commit');
                    res(newCommit);
                } else {
                    newCommit.push({
                        commitMessage: commit.message(),
                        commitHash: commit.sha(),
                        branchName: process.conf.mainBranch,
                        authorName: commit.author().name()
                    });
                }
            });

            history.on("end", function (commits) {
                res(newCommit);
            });
        }
    });
}

const getCommit = (commitHash) => {
    return new Promise(async (res, rej) => {
        const repProj = process.conf.repoName.split('/');
        const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);

        const repo = await nodegit.Repository.open(path.resolve(pathRep, ".git"));
        await repo.fetchAll();
        await repo.mergeBranches(process.conf.mainBranch, `origin/${process.conf.mainBranch}`);
        const firstCommit = await repo.getBranchCommit(process.conf.mainBranch);

        if (commitHash) {
            let history = firstCommit.history(nodegit.Revwalk.SORT.TIME);
            history.start();

            history.on("commit", function (commit) {
                if (commit.sha() === commitHash) {
                    history.removeAllListeners('commit');
                    res({
                        commitMessage: commit.message(),
                        commitHash: commit.sha(),
                        branchName: process.conf.mainBranch,
                        authorName: commit.author().name()
                    });
                }
            });

            history.on("end", function (commits) {
                res(null);
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
        status: 400,
        statusText: 'Bad request'
    }
    let res;
    const repProj = name.split('/');

    if (repProj.length > 1) {

        if (process.conf.repoName !== name) {
            const rm = await removeRep();
        }

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


module.exports = { gitEvent, checkLog, getFirstCommit, clone, getCommit }