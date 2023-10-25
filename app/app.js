const {AppLayout, render, Log, Icons, Styles, Notification, Button} = require('chuijs');

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')
const {Settings} = require("./views/settings/settings");

class App extends AppLayout {
    constructor() {
        super();
        this.setSearchToAppMenu();
        this.setAutoCloseRouteMenu();
        this.disableAppMenu()
        this.setRoute(new YandexMusicPage());

        this.addToHeader([
            AppLayout.DIALOG({
                title: "Настройки",
                icon: Icons.ACTIONS.SETTINGS,
                reverse: false,
                dialogOptions: {
                    title: "Настройки",
                    closeOutSideClick: false,
                    style: {
                        width: "80%",
                        height: Styles.SIZE.MAX_CONTENT,
                        direction: Styles.DIRECTION.COLUMN,
                        wrap: Styles.WRAP.NOWRAP,
                        align: Styles.ALIGN.CENTER,
                        justify: Styles.JUSTIFY.CENTER,
                    },
                    components: [ new Settings().setPlaybackBlock() ]
                }
            }),
        ])
    }
}

render(() => new App()).then(() => Log.info("Загружено!"));