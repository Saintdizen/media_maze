const {AppLayout, render} = require('chuijs');

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')

class App extends AppLayout {
    constructor() {
        super();
        this.setAutoCloseRouteMenu();
        this.setLeftPositionWindowControls();
        this.setSearchToAppMenu();
        this.setRoute(new YandexMusicPage());
    }
}

render(() => new App()).then(() => console.log("Загружено!!"));