let store = null;

class Store {
    constructor() {
        this.pushCount = 0;
        this.userCount = 0;
    }

    countPush() {
        this.pushCount += 1;
    }

    countUser() {
        this.userCount += 1;
    }

    data() {
        return {
            pushCount: this.pushCount,
            userCount: this.userCount
        }
    }
}

module.exports = getStore = () => {
    if (!store) {
        store = new Store();
    }

    return store;
}
