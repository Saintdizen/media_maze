const {AppLayout, render, Log, Icons, Styles, Route} = require('chuijs');
const {Settings} = require("./settings/settings");

const {YaApi} = require("./views/player/ya_api");
const {Player} = require("./views/player/player");

class App extends AppLayout {
    #api = new YaApi()
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
                                clickEvent: () => new Route().go(new Player())
                            }
                        )
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
            AppLayout.BUTTON({
                title: "Авторизация",
                //icon: undefined,
                reverse: true,
                clickEvent: async () => await this.#api.auth()
            }),
            AppLayout.BUTTON({
                title: "TEST",
                //icon: undefined,
                reverse: true,
                clickEvent: async () => await this.#api.getTracks()
            })
        ])
    }
}

render(() => new App()).then(() => Log.info("Загружено!"));