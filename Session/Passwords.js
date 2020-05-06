module.exports = class Passwords {
    constructor() {
        this.passMap = new Map();
        setInterval(() => {
            this.checkPasswords();
        }, 60 * 1000);
    }

    createUniquePassword() {
        const pass = String(Math.floor( Math.random() * 10000)).padStart(4, '0');
        if (this.passMap.has(pass)) {
            return this.createUniquePassword();
        }
        return pass;
    }

    checkPasswords() {
        const expirationMs = 5 * 60 * 1000; // 15分
        const currentTimeMs = new Date().getTime();
        this.passMap.forEach(([createdTimeMs], key, map) => {
            if (currentTimeMs - createdTimeMs > expirationMs) {
                this.passMap.delete(key);
            }
        });
    }

    createPassword(sessionId) {
        const password = this.createUniquePassword();
        this.passMap.set(password, [new Date().getTime(), sessionId]);
        return password;
    }

    getSessionId(password) {
        const session = this.passMap.get(password)
        if (!session) return null;
        return session[1];
    }
}
