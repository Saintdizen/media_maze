const {AppLayout, render} = require('chuijs');

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')

class App extends AppLayout {
    constructor() {
        super();
        this.setHideOnClose(true);
        this.setAutoCloseRouteMenu(true);
        this.setRoute(new YandexMusicPage());
    }
}

render(() => new App()).then(() => console.log("Загружено!"));