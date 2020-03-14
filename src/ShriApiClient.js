const axios = require('axios');
const https = require('https');
require('dotenv').config();

class ShriApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://hw.shri.yandex/api',
            timeout: 5000,
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

    getBuildList(offset = 0, limit = 25) {
        return this.client.get(`/build/list?offset=${offset}&limit=${limit}`, { offset, limit })
    }

    getBuildLog(buildId) {
        return this.client.get(`/build/log?buildId=${buildId}`)
    }

    postBuildRequest(commitMessage, commitHash, branchName, authorName) {
        return this.client.post(`/build/request`, { commitMessage, commitHash, branchName, authorName })
    }

    postBuildStart(buildId, dateTime) {
        return this.client.post(`/build/start`, { buildId, dateTime })
    }

    postBuildFinish(buildId, duration, success, buildLog) {
        return this.client.post(`/build/finish`, { buildId, duration, success, buildLog })
    }

    postBuildCancel(buildId) {
        return this.client.post(`/build/cancel`, { buildId })
    }

    getConf() {
        return this.client.get(`/conf`)
    }

    postConf(repoName, buildCommand, mainBranch, period) {
        return this.client.post(`/conf`, { repoName, buildCommand, mainBranch, period })
    }

    deleteConf() {
        return this.client.delete(`/conf`)
    }
}

module.exports = ShriApiClient