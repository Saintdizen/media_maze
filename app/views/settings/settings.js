const {Page, H} = require('chuijs');

class Settings extends Page {
    #h1 = new H(1, "Настройки")
    constructor() {
        super();
        this.setTitle('Media Maze: Настройки');
        this.setFullHeight();
        this.setFullWidth();
        this.setMain(false);
        this.add(this.#h1)
    }
}

exports.Settings = Settings