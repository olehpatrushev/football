export class ConfigService {
    config = {}

    constructor(isDEBUG) {
        this.config["isDEBUG"] = isDEBUG;
    }

    getIsDEBUG() {
        return this.config["isDEBUG"];
    }
}