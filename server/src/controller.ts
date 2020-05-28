import ShriApiClient from "./ShriApiClient";
import Store from "../utils/Store";
import {Response, Request} from 'express-serve-static-core';
import {
    BuildRequestResultModel,
    ConfigurationInput,
    ConfigurationModel,
    BuildModel
} from '../typings/api/models';

import cacheBuildLogs from '../utils/CacheBuildLogs';
import GitCommand from './GitCommand';

export const getSettings = async (_: Request, res: Response<ConfigurationModel | string>) => {
    try {
        const data = await ShriApiClient.getConf();

        if (data.data !== undefined) {
            Store.set({...data.data, lastCommit: Store.dataStore.lastCommit});

            return res.status(200).send(data.data);
        }

        return res.status(204).send('no content');
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export const postSettings = async (req: Request<{}, any, ConfigurationInput>, res: Response<string>) => {
    const {body} = req;
	
	if(!(typeof body.repoName === 'string' && (body.repoName as string).length > 0)){
        return res.status(500).send('Empty Request body');
	}
	
    const resClone = await GitCommand.clone(body.repoName);

    if (Store.dataStore.repoName !== body.repoName) {
        if (!resClone) {
            return res.status(500).send('Ошибка клонирования репозитория');
        }
    }

    try {
        const requestData = {...body};
        await ShriApiClient.postConf(requestData);

        Store.set({...requestData, lastCommit: Store.dataStore.lastCommit});

    } catch (err) {
        return res.status(500).send(err.toString());
    }

    if (resClone) {
        const firstCommit = await GitCommand.getFirstCommit();
        ShriApiClient.postBuildRequest(firstCommit)
            .then(() => {
                Store.dataStore.lastCommit = firstCommit.commitHash;
                GitCommand.setWatcher();
            });
    }

    return res.status(200).send('ok');
}

export const delSettings = async (_: Request, res: Response<string>) => {
    try {
        await ShriApiClient.deleteConf();

        return res.status(200).send('ok');
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export const getBuilds = async (req: Request, res: Response<Array<BuildModel> | string>) => {
    const { query } = req;

    try {
        const { offset, limit } = query;

        const data = await ShriApiClient.getBuildList(
            Number(offset) || 0,
            Number(limit)|| 25
        );

        if (data.data !== undefined) {
            return res.status(200).send(data.data);
        }

        return res.status(204).send('no content');
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export const getBuildLog = async (req: Request, res: Response<string>) => {
    const { params } = req;
    const { buildId } = params;

    if (buildId === undefined) {
        return res.status(400).send('buildId is not defined');
    }

    try {
        const cache = await cacheBuildLogs.get(buildId);

        if(cache){
            return res.status(200).send(cache);
        } else {
            const data = await ShriApiClient.getBuildLog(buildId);

            await cacheBuildLogs.set(buildId, data);

            return res.status(200).send(data);
        }
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export const getBuildId = async (req: Request, res: Response<BuildModel | string>) => {
    const { params } = req;
    const { buildId } = params;


    if (buildId === undefined) {
        return res.status(400).send('build paramas not defined');
    }

    try {
        const data = await ShriApiClient.getBuildDetails(buildId);

        if (data.data !== undefined) {
            return res.status(200).send(data.data);
        }

        return res.status(204).send('no content');
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

export const postAddInstQueue = async (req: Request, res: Response<BuildRequestResultModel | string>) => {
    const { params } = req;
    const { commitHash } = params;

    if (commitHash === undefined) {
        return res.status(400).send('Commit hash in params not valid')
    }
    const commitData = await GitCommand.getCommit(commitHash);

    if(commitData){
        try {
            const data = await ShriApiClient.postBuildRequest(commitData);

            if (data.data !== undefined) {
                return res.status(200).send(data.data);
            }

            return res.status(204).send('no content');
        } catch (err) {
            return res.status(500).send(err.toString());
        }
    }else{
        return res.status(500).send('Commit hash not found')
    }
}