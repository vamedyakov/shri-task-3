import path from 'path';
import ShriApiClient from './ShriApiClient';
import fs from 'fs';
import Store from "../utils/Store";
import nodeGit from "nodegit";
import rimraf from "rimraf";
import {QueueBuildInput} from '../../typings/api/models';

const removeRep = async (folder: string): Promise<string> => {
    return new Promise(async (resolve, _) => {
        const path = (folder) ? `./repositories/${folder}` : './repositories/*';
        rimraf(path, function () {
            resolve('ok');
        });
    });
}

const gitEvent = async () => {
    const commits = await checkLog();

    if (commits.length > 0) {
        commits.forEach((commit) => {
            ShriApiClient.postBuildRequest(commit)
                .then((response) => {
                    console.log(response);
                });
        });
        const firstCommit = await getFirstCommit();
        Store.dataStore.lastCommit = firstCommit.commitHash;
    }
}

const setWatcher = () => {
    if (Store.dataStore.period > 0) {
        if(Store.dataStore.intervalWatchGit){
            clearInterval(Store.dataStore.intervalWatchGit);
        }

        Store.dataStore.intervalWatchGit = setInterval(gitEvent, Store.dataStore.period * 60 * 1000);
    }
}

const getPath = (): string => {
    const repProj = Store.dataStore.repoName.split('/');

    return path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);
}

const initNodeGit = async (): Promise<nodeGit.Commit> => {
    const pathRep = getPath();

    if (!fs.existsSync(pathRep)) {
        clone(Store.dataStore.repoName);
    }

    const repo = await nodeGit.Repository.open(path.resolve(pathRep, ".git"));
    await repo.fetchAll();
    await repo.mergeBranches(Store.dataStore.mainBranch, `origin/${Store.dataStore.mainBranch}`);

    return await repo.getBranchCommit(Store.dataStore.mainBranch);
}

const checkLog = (): Promise<Array<QueueBuildInput>> => {
    let newCommit: Array<QueueBuildInput> = [];

    return new Promise(async (resolve, _) => {
        let lastCommitHash = Store.dataStore.lastCommit;
        const firstCommit = await initNodeGit();

        if (lastCommitHash) {
            let history = firstCommit.history();
            history.start();

            history.on("commit", function (commit) {
                if (commit.sha() === lastCommitHash) {
                    history.removeAllListeners('commit');
                    resolve(newCommit);
                } else {
                    let data = {
                        commitMessage: commit.message(),
                        commitHash: commit.sha(),
                        branchName: Store.dataStore.mainBranch,
                        authorName: commit.author().name()
                    } as QueueBuildInput;

                    newCommit.push(data);
                }
            });

            history.on("end", () => resolve(newCommit));
        } else {
            resolve(newCommit);
        }
    });
}

const getCommit = (commitHash: string): Promise<QueueBuildInput | null> => {
    return new Promise(async (res, rej) => {
        const firstCommit = await initNodeGit();

        if (commitHash) {
            let history = firstCommit.history();
            history.start();
            history.on("commit", function (commit) {
                if (commit.sha() === commitHash) {
                    history.removeAllListeners('commit');
                    let data = {
                        commitMessage: commit.message(),
                        commitHash: commit.sha(),
                        branchName: Store.dataStore.mainBranch,
                        authorName: commit.author().name()
                    } as QueueBuildInput;

                    res(data);
                }
            });

            history.on("end", () => res(null));
        } else {
            rej('commitHash empty')
        }
    });
}

const getFirstCommit = async (): Promise<QueueBuildInput> => {
    const firstCommit = await initNodeGit();

    return {
        commitMessage: firstCommit.message(),
        commitHash: firstCommit.sha(),
        branchName: Store.dataStore.mainBranch,
        authorName: firstCommit.author().name()
    } as QueueBuildInput;
}

const clone = async (name: string): Promise<boolean> => {
    let res;
    const repProj = name.split('/');

    if (repProj.length > 1) {
        if (Store.dataStore.repoName !== name) {
            await removeRep(repProj[repProj.length - 1]);
        }

        const pathRep = path.resolve(__dirname, '../repositories/' + repProj[repProj.length - 1]);

        if (!fs.existsSync(path.resolve(__dirname, '../repositories/'))) {
            fs.mkdirSync(path.resolve(__dirname, '../repositories/'));
        }

        try {
            res = await nodeGit.Clone.clone(`https://github.com/${name}`, pathRep);
        } catch (err) {
            res = err;
        }

        if (res instanceof nodeGit.Repository) {
            return true;
        }
    }

    return false;
};


export default {gitEvent, checkLog, getFirstCommit, clone, getCommit, removeRep, setWatcher}