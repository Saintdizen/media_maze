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

        this.addToHeaderLeftBeforeTitle([
            AppLayout.TABS({
                    default: 0,
                    tabs: [
                        AppLayout.BUTTON({
                                icon: Icons.AUDIO_VIDEO.LIBRARY_MUSIC,
                                clickEvent: () => new Route().go(new YandexMusicPage())
                            }
                        ),
                        AppLayout.BUTTON({
                                icon: Icons.FILE.DOWNLOAD_FOR_OFFLINE,
                                clickEvent: () => new Route().go(new OfflinePlayer())
                            }
                        ),
                    ]
                }
            )
        ])

        this.addToHeaderRight([
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
        ])
    }
}

render(() => new App()).then(() => Log.info("Загружено!"));