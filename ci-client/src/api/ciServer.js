import axios from 'axios';

async function getSettings() {
    let res;
    try {
        res = await axios.get(`/api/settings`);
    } catch (err) {
        res = err.response;
    }

    return res;
}

async function getBuilds(offset = 0, limit = 25) {
    let res;
    try {
        res = await axios.get(`/api/builds`, { params: { offset, limit } });
    } catch (err) {
        res = err.response;
    }

    return res;
}

async function getBuildbyID(id) {
    let res;
    try {
        res = await axios.get(`/api/builds/${id}`);
    } catch (err) {
        res = err.response;
    }

    return res;
}

async function getBuildLogbyID(id) {
    let res;
    try {
        res = await axios.get(`/api/builds/${id}/logs`);
    } catch (err) {
        res = err.response;
    }

    return res;
}

async function postSaveSettings(data) {
    let res;
    try {
        res = await axios.post('/api/settings', {
            repoName: data.repository,
            buildCommand: data.command,
            mainBranch: data.branch,
            period: Number(data.syncMinutes)
        });
    } catch (err) {
        res = err.response;
    }

    return res;
}

async function postAddQueue(data) {
    let res;
    try {
        res = await axios.post(`/api/builds/${data.commitHash}`);
    } catch (err) {
        res = err.response;
    }

    return res;
}

export default {
    getSettings,
    getBuilds,
    postAddQueue,
    getBuildbyID,
    getBuildLogbyID,
    postSaveSettings
}