export class RouterService {
    urlParams;

    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
    }

    getIsDEBUG() {
        return this.urlParams.has('DEBUG');
    }
}