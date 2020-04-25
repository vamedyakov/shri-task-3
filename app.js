const path = require('path');
const express = require('express');
const apiRoute = require('./routes/api');
const ShriApiClient = require('./src/ShriApiClient');
const GitCommand = require('./src/GitCommand');
const app = express();

process.conf = {
	repoName: '',
	buildCommand: '',
	mainBranch: '',
	period: 1,
	lastCommit: ''
};

ShriApiClient.getConf()
  .then((response) => {
    if (response.status === 200 && response.data.data) {

      process.conf = {
        repoName: response.data.data.repoName,
        buildCommand: response.data.data.buildCommand,
        mainBranch: response.data.data.mainBranch,
        period: response.data.data.period,
        lastCommit: ''
      };
	  GitCommand.getFirstCommit()
		.then((res) => {
			process.conf.lastCommit = res.commitHash;

			if (process.conf.period > 0) {
				process.gitEvent = setInterval(GitCommand.gitEvent, process.conf.period * 60000);
			}
		});
    }
  });

app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.resolve(__dirname, 'static')));

app.use('/api', apiRoute);

app.use((req, res) => {
	res.status(404);
  
	if (req.accepts("html")) {
	  res.send("<h1>404 Not found</h1>");
	  return;
	}
	if (req.accepts("application/json")) {
	  res.json({ error: "Not found" });
	  return;
	}
	res.type("txt").send("Not found");
  }
  );

app.listen(3000);
