const MockAdapter = require('axios-mock-adapter');
const ShriApiClient = require('../src/ShriApiClient');
const controller = require('../src/controller');
const { stub } = require('sinon');
const { expect } = require('chai');

const mock = new MockAdapter(ShriApiClient.client);

const getStub = () => {
    const res = {};
    res.status = stub().returns(res);
    res.send = stub().returns(res);

    return res;
}

describe('Проверка методов работы с api', () => {
    it('Получение настроек из хранилища getSettings', async () => {
        const data = {
            "data": {
                "id": "32285f64-3317-4762-b3fc-2c9sdf366afa6",
                "repoName": "vamedyakov",
                "buildCommand": "npm run",
                "mainBranch": "master",
                "period": 1
            }
        }
        mock.onGet('https://hw.shri.yandex/api/conf').reply(200, data);

        const res = getStub();

        await controller.getSettings({}, res);

        const result = res.send.firstCall.args[0];
        const status = res.status.firstCall.args[0];

        expect(result.repoName).to.eql(data.data.repoName);
        expect(status).to.equal(200);
    });

    it('Получение списка билдов getBuilds', async () => {
        const data = {
            "data": [{
                "id": "32285f64-3317-4762-b3fc-2c9sdf366afa6",
                "commitHash": "test",
            }]
        }
        mock.onGet('https://hw.shri.yandex/api/build/list').reply(200, data);

        const res = getStub();

        await controller.getBuilds({ query: {} }, res);

        const result = res.send.firstCall.args[0];
        const status = res.status.firstCall.args[0];

        expect(result).to.eql(data.data);
        expect(status).to.equal(200);
    });

    it('Получение билда по ид getBuildId', async () => {
        const data = {
            "data": {
                "id": "32285f64-3317-4762-b3fc-2c9sdf366afa6",
                "commitHash": "test",
            }
        }
        mock.onGet('https://hw.shri.yandex/api/build/details', {
            params: {
                buildId: '32285f64-3317-4762-b3fc-2c9sdf366afa6'
            }
        }).reply(200, data);

        const res = getStub();

        await controller.getBuildId({
            params: {
                buildId: '32285f64-3317-4762-b3fc-2c9sdf366afa6'
            }
        }, res);

        const result = res.send.firstCall.args[0];
        const status = res.status.firstCall.args[0];

        expect(result).to.eql(data.data);
        expect(status).to.equal(200);
    });
});