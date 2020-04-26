const path = require('path');
const nodegit = require("nodegit");
const ShriApiClient = require('./ShriApiClient');
const fs = require('fs'); 
const rimraf = require('rimraf');

const removeRep = async (folder) => {
    return new Promise(async (res, rej) => {
        const path = (folder) ? `./repositories/${folder}`: './repositories/*';
        rimraf(path, function () { 
            res('ok');
         });
    });
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

const getPath = () => {
	const repProj = process.conf.repoName.split('/');
	
	return path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);
}

const checkLog = () => {
    return new Promise(async (res, rej) => {
        console.log(process.conf);
        const newCommit = [];
        let lastCommitHash = process.conf.lastCommit;
		const pathRep = getPath();
		
		if(!fs.existsSync(pathRep)){
			clone(process.conf.repoName);
		}

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
        }else{
            res(newCommit);
        }
    });
}

const getCommit = (commitHash) => {
    return new Promise(async (res, rej) => {
		const pathRep = getPath();
		
		if(!fs.existsSync(pathRep)){
			clone(process.conf.repoName);
		}

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
        }else{
            rej('commitHash empty')
        }
    });
}

const getFirstCommit = async () => {
    const pathRep = getPath();
		
	if(!fs.existsSync(pathRep)){
		res = await clone(process.conf.repoName);
	}
	
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
            const rm = await removeRep(repProj[repProj.length - 1]);
        }

        const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);
		
		if(!fs.existsSync(path.resolve(__dirname, '../repositories/'))){
			fs.mkdirSync(path.resolve(__dirname, '../repositories/'));
		}
		
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


module.exports = { gitEvent, checkLog, getFirstCommit, clone, getCommit, removeRep }