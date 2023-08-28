const {AppLayout, render} = require('chuijs');

const {YandexMusicPage} = require('./views/1_yandex')

class App extends AppLayout {
    constructor() {
        super();
        this.setHideOnClose(true);
        this.setAutoCloseRouteMenu(true);
        this.setRoute(new YandexMusicPage());
    }
}

render(() => new App()).then(() => console.log("Загружено!"));