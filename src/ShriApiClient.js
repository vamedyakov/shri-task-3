const axios = require('axios');
const https = require('https');
const cacheManager = require('cache-manager');
const fsStore = require('cache-manager-fs-hash');
require('dotenv').config();

const diskCache = cacheManager.caching({
    store: fsStore,
    options: {
        path: 'cache',
        ttl: 60 * 60 * 60,
        subdirs: true,
    }
});

class ShriApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://hw.shri.yandex/api',
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.SHRI_AUTH_TOKEN}`,
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
                keepAlive: true,
            }),
        })
    }

    async getBuildList(offset = 0, limit = 25) {
        let res;
        try {
            res = await this.client.get(`/build/list`, { params: { offset, limit } });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async getBuildLog(buildId) {
        return await diskCache.wrap(buildId, async () => {
            let res;
            try {
                res = await this.client.get(`/build/log`, { params: { buildId } });
            } catch (err) {
                res = err.response;
            }

            const { data, status, statusText } = res;

            return { data, status, statusText };
        });
    }

    async getBuildDetails(buildId) {
        let res;
        try {
            res = await this.client.get(`/build/details`, { params: { buildId } });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async postBuildRequest(commitMessage, commitHash, branchName, authorName) {
        let res;
        try {
            res = await this.client.post(`/build/request`, { commitMessage, commitHash, branchName, authorName });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async postBuildStart(buildId, dateTime) {
        let res;
        try {
            res = await this.client.post(`/build/start`, { buildId, dateTime });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async postBuildFinish(buildId, duration, success, buildLog) {
        let res;
        try {
            res = await this.client.post(`/build/finish`, { buildId, duration, success, buildLog });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async postBuildCancel(buildId) {
        let res;
        try {
            res = await this.client.post(`/build/cancel`, { buildId });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async getConf() {
        let res;
        try {
            res = await this.client.get(`/conf`);
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async postConf(repoName, buildCommand, mainBranch, period) {
        let res;
        try {
            res = await this.client.post(`/conf`, { repoName, buildCommand, mainBranch, period });
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }

    async deleteConf() {
        let res;
        try {
            res = await this.client.delete(`/conf`);
        } catch (err) {
            res = err.response;
        }

        const { data, status, statusText } = res;

        return { data, status, statusText };
    }
}


instance = new ShriApiClient();

module.exports = instance;