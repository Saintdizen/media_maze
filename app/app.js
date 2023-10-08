const {AppLayout, render} = require('chuijs');

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')
const {KinopoiskPage} = require("./views/kinopoisk_hd/kinopoisk_hd");

class App extends AppLayout {
    constructor() {
        super();
        this.setSearchToAppMenu();
        this.setAutoCloseRouteMenu();
        this.setRoute(new YandexMusicPage());
        this.setRoute(new KinopoiskPage());
    }
}

render(() => new App()).then(() => console.log("Загружено!"));