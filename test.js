const axios = require('axios');
const shell = require('shelljs');
const GitCommand = require('./src/GitCommand');

GitCommand.checkLog().then(res => {
    console.log(res);
});
/*axios.default.post('http://localhost:3000/api/settings', {
    repoName: 'vamedyakov/shri-task-3',
    buildCommand: 'npm i',
    mainBranch: 'master',
    period: 1
})
    .then(({ data }) => console.log(data));*/