const {AppLayout, render} = require('chuijs');

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')

class App extends AppLayout {
    constructor() {
        super();
        this.disableAppMenu();
        this.setAutoCloseRouteMenu(true);
        this.setLeftPositionWindowControls(true);
        this.setRoute(new YandexMusicPage());
    }
}

render(() => new App()).then(() => console.log("Загружено!"));