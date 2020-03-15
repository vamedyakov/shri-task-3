const path = require('path');
const express = require('express');
const apiRoute = require('./routes/api');
const ShriApiClient = require('./src/ShriApiClient');
const app = express();

ShriApiClient.getConf()
  .then((response) => {
    if (response.status === 200) {

      process.conf = {
        repoName: response.data.data.repoName,
        buildCommand: response.data.data.buildCommand,
        mainBranch: response.data.data.mainBranch,
        period: response.data.data.period
      };
    }
  });


app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', apiRoute);

app.listen(3000);
