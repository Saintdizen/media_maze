const {AppLayout, render} = require('chuijs');

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')
const {Settings} = require("./views/settings/settings");

class App extends AppLayout {
    constructor() {
        super();
        this.setSearchToAppMenu();
        this.setAutoCloseRouteMenu();
        this.setRoute(new YandexMusicPage());
        this.setRoute(new Settings());
    }
}

render(() => new App()).then(() => console.log("Загружено!"));