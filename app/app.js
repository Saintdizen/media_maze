const {AppLayout, render, Log, Icons, Styles} = require('chuijs');
const {Settings} = require("./settings/settings");

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')
const {OfflinePlayer} = require("./views/offline_player/offline_player");

class App extends AppLayout {
    constructor() {
        super();
        //this.setSearchToAppMenu();
        this.setAutoCloseRouteMenu();
        //this.disableAppMenu()
        this.setRoute(new YandexMusicPage());
        this.setRoute(new OfflinePlayer());

        this.addToHeader([
            AppLayout.DIALOG({
                title: "Настройки",
                icon: Icons.ACTIONS.SETTINGS,
                reverse: false,
                dialogOptions: {
                    title: "Настройки",
                    closeOutSideClick: false,
                    style: {
                        width: Styles.SIZE.MAX_CONTENT,
                        height: Styles.SIZE.MAX_CONTENT,
                        direction: Styles.DIRECTION.COLUMN,
                        wrap: Styles.WRAP.NOWRAP,
                        align: Styles.ALIGN.CENTER,
                        justify: Styles.JUSTIFY.CENTER,
                    },
                    components: [ new Settings() ]
                }
            }),
        ])
    }
}

render(() => new App()).then(() => Log.info("Загружено!"));