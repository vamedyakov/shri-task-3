class QueueBuild {
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

    add(element){
        if(element.status === 'Waiting' ){    
            if (this.dataStore.every(build => build.id !== element.id)) {
                this.dataStore.push(element);
                
                return true;
            }
        }

        return false
    }

    enqueue(data) {
        this.dataStore = [];

        if(data instanceof Array){
            this.dataStore = data.filter(({ status }) => status === 'Waiting');
        }
    }

    getAll() {
        return this.dataStore;
    }

    dequeue() {
        return this.dataStore.shift();
    }

    front() {
        return this.dataStore[0];
    }

    back() {
        return this.dataStore[this.size() - 1];
    }
}

instance = new QueueBuild();

module.exports = instance;