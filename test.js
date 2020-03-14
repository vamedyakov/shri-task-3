const axios = require('axios');
const shell = require('shelljs');
const GitCommand = require('./src/GitCommand');

GitCommand.log().then(res => {
    console.log(res);
});
/*axios.default.post('http://localhost:3000/api/settings', {
    repoName: 'vamedyakov/shri-task-3',
    buildCommand: 'string 2',
    mainBranch: 'string 2',
    period: 0
})
    .then(({ data }) => console.log(data));*/