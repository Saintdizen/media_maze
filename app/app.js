const {AppLayout, render, Log, Icons, Styles, Route, YaApi, App} = require('chuijs');
const {Settings} = require("./settings/settings");
const {PlaylistDB, UserDB} = require("./sqlite/sqlite");
const {Player} = require("./views/player/player");

class Apps extends AppLayout {
    #api = new YaApi()
    #udb = new UserDB(App.userDataPath())
    #pdb = new PlaylistDB(App.userDataPath())

    constructor() {
        super();
        this.#udb.selectUserData().then(data => {
            global.access_token = data.access_token
            global.user_id = data.user_id
        })
        //this.setSearchToAppMenu();
        this.setAutoCloseRouteMenu();
        this.disableAppMenu()
        this.addToHeaderLeftBeforeTitle([
            AppLayout.TABS({
                    default: 0,
                    tabs: [
                        AppLayout.BUTTON({
                                icon: Icons.AUDIO_VIDEO.LIBRARY_MUSIC,
                                clickEvent: () => {
                                    new Route().go(new Player())
                                }
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
                clickEvent: async () => {
                    await this.#udb.createUserTable()
                    let udata = await this.#api.auth()
                    await this.#udb.addUserData(udata.access_token, udata.user_id)
                    await this.#udb.selectUserData().then(data => {
                        this.#api.getTracks(data.access_token, data.user_id).then(async playl => {
                            for (let playlist of playl) {
                                for (let track of playlist.tracks) {
                                    let pname = playlist.playlist_name.replace("pl_", "")
                                    await this.#pdb.createPlaylistTable(pname)
                                    this.#pdb.addTrack(
                                        pname,
                                        track.track_id,
                                        track.title,
                                        track.artist,
                                        track.album,
                                        track.mimetype
                                    )
                                }
                            }
                        })
                    })
                }
            })
        ])
    }
}

render(() => new Apps()).then(() => Log.info("Загружено!"));