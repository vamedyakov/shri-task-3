const ShriApiClient = require('../src/ShriApiClient');
const QueueBuild = require('../src/queueBuild');
const QueueAgent = require('../src/queueAgent');
const tcp = require('tcp-ping');
const axios = require('axios');

class Controller {
  agents = QueueAgent;
  builds = QueueBuild;
  config = {};
  intevalBuild = 5000;
  intevalWork = 5000;
  intevalPing = 5000;

  registerAgent = (req, res) => {
    const { body } = req;
    const { port } = body;
    if (req.hostname === undefined || port === undefined) {
      return res.status(400).send('bad request');
    }

    if (this.agents.add({ ...body, host: req.hostname })) {
      return res.status(200).send('ok');
    }

    return res.status(500).send('error');
  };

  sendResultBuild = async (req, res) => {
    const { body } = req;

    try {
      await ShriApiClient.postBuildFinish(body)
    } catch (error) {
      console.log(error);
    }

    this.agents.finish(body.buildId);

    res.status(200).send('ok');
  };

  pingAgents = async () => {
    this.intervalPing = setInterval(async () => {
      this.agents.forEach(async (agent, i) => {
        const { host, port } = agent;

        tcp.probe(host, port, async (err, alive) => {
          if (err) {
            return console.log(err);
          }
          if (alive) {
            return;
          }
          console.log(`Пропал коннект между сервером, и агентом. На ${host}:${port} << Агент будет удален из списка`);
          if (agent.buildId.length > 0) {
            try {
              await ShriApiClient.postBuildCancel(agent.buildId)
            } catch (error) {
              console.log(error);
            }
          }

          this.agents.delete(i);
        });
      });

    }, this.intevalPing)
  }

  getBuilds = async () => {
    try {
      const response = await ShriApiClient.getBuildList();
      this.builds.enqueue(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  getConfig = async () => {
    try {
      const response = await ShriApiClient.getConf();
      this.config = { ...this.config, ...response.data.data }
    } catch (error) {
      console.log(error);
    }
  }

  checkBuilds = async () => {
    await this.getBuilds();
    setInterval(() => {
      if (!this.builds.front()) {
        this.getConfig();
        console.log('Запрос за новыми билдами', this.intevalBuild);
        this.getBuilds();
      }
    }, this.intevalBuild);
  }

  initEvent = async () => {
    await this.getConfig();
    await this.checkBuilds();
    this.pingAgents();
  }

  start = async () => {
    await this.initEvent();

    setInterval(async () => {
      if (this.builds.front() && this.agents.front()) {
        const { host, port } = this.agents.front();
        const { id, commitHash, branchName } = this.builds.front();
        const { repoName, buildCommand } = this.config;

        if(repoName !== undefined && buildCommand !== undefined){
          let response;
          try {
            console.log(`Послал POST агенту ${host}:${port}`);
            console.log({
              id,
              commitHash,
              repoName,
              buildCommand,
              branchName
            });
            response = await axios.post(`http://${host}:${port}/build`, {
              id,
              commitHash,
              repoName,
              buildCommand,
              branchName
            });
          } catch (error) {
            console.log(error);
            return;
          }
  
          console.log(response.status, '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  
          if (response.status === 202) {
            this.agents.runBuild(id);
            this.builds.dequeue();
            await ShriApiClient.postBuildStart(id, new Date());
          }
        }
      }
    }, this.intevalWork);
  }
}
const instance = new Controller();

module.exports = instance;