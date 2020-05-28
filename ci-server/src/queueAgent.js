class QueueAgent {
    constructor() {
        this.dataStore = [];
    }

    size() {
        return this.dataStore.length;
    }

    empty() {
        return !this.size();
    }

    clear() {
        this.dataStore = [];
    }

    getAll() {
        return this.dataStore;
    }

    runBuild(id) {
        const data = this.front();
        data.buildId = id;
        data.run = true;
    }

    finish(id) {
        if(id.length > 0){
            const index = this.dataStore.findIndex((elem) => elem.buildId === id);

            if(index !== -1){
                this.dataStore[index].buildId = '';
                this.dataStore[index].run = false;
            }
        }
    }

    add(data) {
        if (this.dataStore.every(agent => agent.port !== data.port && agent.hostname !== data.hostname)) {
            data.buildId = '';
            data.run = false;
            this.dataStore.push(data);

            return true;
        }

        return false;
    }

    dequeue() {
        return this.dataStore.shift();
    }

    front() {
        return this.dataStore.find((elem) => elem.run === false);
    }

    delete(i) {
        this.dataStore.splice(i, 1);
    }

    forEach(cb, context) {
        if (!context) {
            this.dataStore.forEach(cb);
        } else {
            this.dataStore.forEach(cb.bind(context))
        }
    }
}

instance = new QueueAgent();

module.exports = instance;