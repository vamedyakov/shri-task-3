const config = require('../agent-conf.json');
const path = require('path');
const tcp = require('tcp-ping');
const axios = require('axios');
const { spawn } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const { exec } = require("child_process");
const rimraf = require('rimraf');


mkDirAsync = promisify(fs.mkdir);
fileExistsAsync = promisify(fs.exists);
execAsync = promisify(exec);


class Controller {
  intevalPing = 5000;
  tryInteval = 5000;

  constructor(config, spawn) {
    this.webClient = axios.create({
      baseURL: `http://${config.serverHost}:${config.serverPort}`,
      timeout: 3000,
    });
    this.port = process.argv[2] || config.port;
    this.spawn = spawn;
    this.serverHost = config.serverHost;
    this.serverPort = config.serverPort;
    this.pathRepositories = path.resolve(__dirname, '../repositories/');
  }

  removeRep = async () => {
    return new Promise(async (res, rej) => {
      rimraf(`./repositories/${this.port}`, function () {
        res('ok');
      });
    });
  }

  cloneRepo = async ({ branchName, userName, repoName }) => {
    const cwd = path.resolve(this.pathRepositories, `${this.port}`);

    if (!await fileExistsAsync(this.pathRepositories)) {
      await mkDirAsync(this.pathRepositories);
    }

    if (await fileExistsAsync(cwd)) {
      await this.removeRep(repoName);
      await mkDirAsync(cwd);
    } else {
      await mkDirAsync(cwd);
    }

    const git = this.spawn("git", ["clone", '-b', branchName, `https://github.com/${userName}/${repoName}.git`], { cwd });
    return new Promise(((resolve, reject) => {
      git.on('error', err => reject({
        err: 'ERR_CLONE_REPO',
        errMsg: err.toString(),
      }));
      git.on('close', () => resolve());
    }));
  }

  checkoutRepo = ({ commitHash, repoName }) => {
    const cwd = path.resolve(this.pathRepositories, `${this.port}`, repoName);

    const git = this.spawn('git', ['checkout', '-q', commitHash], { cwd });
    return new Promise(((resolve, reject) => {
      git.on('error', err => reject({
        err: 'ERR_CHECKOUT_REPO',
        errMsg: err.toString(),
      }));
      git.on('close', () => resolve());
    }));
  }

  registry = async (tryCount = 0) => {
    let response;
    try {
      response = await this.webClient.post('/notify-agent', {
        port: Number(this.port)
      });

      this.pingServer();
    } catch (error) {
      if (tryCount < 4) {
        setTimeout(() => {
          console.log('реконект')
          return this.registry(tryCount + 1);
        }, this.tryInteval);
      } else {
        console.log('Не удалось передать данные на процесс сервер, процесс-агент будет убит')
        process.exit();
      }
      return;
    }
  }

  pingServer = () => {
    setInterval(() => {
      tcp.probe(this.serverHost, this.serverPort, async (err, alive) => {
        if (err) {
          return console.log(err);
        }
        if (alive) {
          return;
        }
        console.log(`Пропал коннект между сервером, >>> убиваем процесс-агент`);
        process.exit();
      });
    }, this.intevalPing);
  }

  sendResultBuild = async (result, tryCount = 0) => {
    let response;
    try {
      response = await this.webClient.post('/notify-build-result', {
        ...result
      })
    } catch (error) {
      if (tryCount < 4) {
        setTimeout(() => {
          return this.sendResultBuild(result, tryCount + 1)
        }, this.tryInteval);
      } else {
        console.log('Не удалось передать данные на процесс сервер, процесс-агент будет убит')
        process.exit();
      }
    }
  }

  build = async (body) => {
    const { id, commitHash, repoName, buildCommand, branchName } = body;
    const [userName, repProjName] = repoName.split('/');

    const startBuild = new Date();
    try {
      await this.cloneRepo({ branchName, repoName: repProjName, userName });
      await this.checkoutRepo({ commitHash, repoName: repProjName });
    } catch (error) {
      console.log(error);
    }

    const cwd = path.resolve(this.pathRepositories, `${this.port}`, repProjName);
    console.log(`Выполнение команды: ${buildCommand}`); 
    const run = this.spawn(buildCommand, [], { cwd: cwd, shell: true });
    
    let stdout = '';
    let stderr = '';
    
    run.stdout.on('data', data => stdout += data);
    run.stderr.on('data', data => stderr += data);

    run.on('close', (status) => {
      const finishBuild = new Date();
      console.log(`Закончилось выполнение команды: ${buildCommand}`);
      this.sendResultBuild({
        port: this.port,
        buildId: id,
        duration: Math.ceil(((finishBuild - startBuild) / 1000) / 60),
        success: status === 0,
        buildLog: (stdout + stderr) || 'string'
      });
    });
  }

}

const instance = new Controller(config, spawn);

module.exports = instance;