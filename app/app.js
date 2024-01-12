const {AppLayout, render, Log, Icons, Styles, Route} = require('chuijs');
const {Settings} = require("./settings/settings");

const {YandexMusicPage} = require('./views/yandex_music/yandex_music')
const {OfflinePlayer} = require("./views/offline_player/offline_player");

class App extends AppLayout {
    constructor() {
        super();
        //this.setSearchToAppMenu();
        this.setAutoCloseRouteMenu();
        this.disableAppMenu()

        let ya_page = new YandexMusicPage()
        let off_page = new OfflinePlayer()
        this.setRoute(ya_page);

        this.addToHeader([
            AppLayout.DIALOG({
                //title: "Настройки",
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
            AppLayout.BUTTON({
                    title: "Оффлайн проигрыватель",
                    icon: Icons.FILE.DOWNLOAD_FOR_OFFLINE,
                    reverse: true,
                    clickEvent: () => new Route().go(off_page)
                }
            ),
            AppLayout.BUTTON({
                    title: "Музыка",
                    icon: Icons.AUDIO_VIDEO.LIBRARY_MUSIC,
                    reverse: true,
                    clickEvent: () => new Route().go(ya_page)
                }
            ),
        ])
    }
}

render(() => new App()).then(() => Log.info("Загружено!"));