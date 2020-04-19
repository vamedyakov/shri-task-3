const GitCommand = require('../src/GitCommand');
const { stub } = require('sinon');
const { expect } = require('chai');

describe('Проверка методов работы с git', () => {

    before(() => {
        process.conf = {
            repoName: '',
            buildCommand: '',
            mainBranch: 'master',
            period: 1,
            lastCommit: ''
        };
    });

    after(() => {
        GitCommand.removeRep('shri-2020-fp');
    });

    it('Git clone', async () => {
        const resCommand = await GitCommand.clone('vamedyakov/shri-2020-fp');
        process.conf.repoName = 'vamedyakov/shri-2020-fp';

        expect(resCommand.status).to.equal(200);
    });

    it('Получение последнего коммита getFirstCommit', async () => {
        const firstCommit = await GitCommand.getFirstCommit();

        process.conf.lastCommit = firstCommit.commitHash;
        expect(firstCommit.commitHash).to.be.not.undefined;
    });

    it('Получение коммита getCommit', async () => {
        const commit = await GitCommand.getCommit(process.conf.lastCommit);
        
        expect(commit.commitHash).to.be.not.undefined;
    });
});