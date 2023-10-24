const {Page} = require('chuijs');

class Settings extends Page {
    constructor() {
        super();
        this.setTitle('Настройки');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(false)
    }
}

exports.Settings = Settings