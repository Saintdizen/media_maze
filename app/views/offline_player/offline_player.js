const {Page} = require('chuijs');

class OfflinePlayer extends Page {
    constructor() {
        super();
        this.setTitle('OfflinePlayer');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(false)
    }
}

exports.OfflinePlayer = OfflinePlayer