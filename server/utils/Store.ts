import {
    ConfigurationInput
} from '../../typings/api/models';

interface store extends ConfigurationInput {
    lastCommit: string;
    intervalWatchGit?: NodeJS.Timeout;
}

class Store {
    dataStore: store

    constructor() {
        this.dataStore = {
            repoName: '',
            mainBranch: '',
            period: 1,
            buildCommand: '',
            lastCommit: ''
        }
    }

    public set (data: store): store {
        this.dataStore = {...this.dataStore, ...data};

        return this.dataStore;
    }
}

const instance = new Store();

export = instance;