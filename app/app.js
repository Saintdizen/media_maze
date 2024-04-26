const {AppLayout, render, Log, Icons, Route, YaApi, App, Notification, Dialog, ProgressBar, Styles, ipcRenderer} = require('chuijs');
const {PlaylistDB, UserDB} = require("./sqlite/sqlite");
const {Player} = require("./views/player/player");

class Apps extends AppLayout {
    #api = new YaApi()
    #udb = new UserDB(App.userDataPath())
    #pdb = new PlaylistDB(App.userDataPath())
    #progressTracks = new ProgressBar()
    constructor() {
        super();
        let dialog = new Dialog({
            width: "500px",
            height: Styles.SIZE.MAX_CONTENT,
            closeOutSideClick: false
        })

        // Настройка диалога
        this.#progressTracks.setWidth(Styles.SIZE.WEBKIT_FILL)
        dialog.addToBody(this.#progressTracks)

        this.#progressTracks.setProgressCountText("Чтение плейлистов:")
        this.#progressTracks.setProgressText("")

        // Настройка диалога
        this.disableAppMenu()
        this.addToHeaderLeftBeforeTitle([
            AppLayout.TABS({
                    default: 0,
                    tabs: [
                        AppLayout.BUTTON({
                                icon: Icons.AUDIO_VIDEO.LIBRARY_MUSIC,
                                clickEvent: () => {
                                    new Route().go(new Player(dialog))
                                }
                            }
                        )
                    ]
                }
            )
        ])

        let auth = AppLayout.BUTTON({
            title: "Авторизация",
            //icon: undefined,
            reverse: true,
            clickEvent: async () => {
                dialog.open()
                await this.#udb.createUserTable()
                let udata = await this.#api.auth()
                await this.#udb.addUserData(udata.access_token, udata.user_id)
                this.removeToHeaderRight([auth])
                //
                let ub = await this.generateUserButton(udata.access_token, udata.user_id)
                this.addToHeaderRight([ub])

                ipcRenderer.on("SEND_PLAYLIST_DATA", (event, args) => {
                    //console.log(args)
                    this.#progressTracks.setProgressCountText(`Чтение плейлиста: ${args.playlistName}`)
                    this.#progressTracks.setMax(args.max)
                })

                ipcRenderer.on("SEND_TRACK_DATA", (event, args) => {
                    //console.log(args)
                    this.#progressTracks.setValue(args.index)
                    this.#progressTracks.setProgressText(args.trackName)
                })

                await this.#udb.selectUserData().then(data => {
                    this.#api.getTracks(data.access_token, data.user_id).then(async playl => {
                        for (let playlist of playl) {
                            this.#progressTracks.setProgressCountText(`Формирование плейлиста: ${playlist.playlist_name}`)
                            this.#progressTracks.setMax(playlist.tracks.length)

                            for (let track of playlist.tracks) {
                                let pname = playlist.playlist_name.replace("pl_", "")
                                await this.#pdb.createPlaylistTable(pname)
                                await this.#pdb.addTrack(
                                    pname,
                                    track.track_id,
                                    track.title,
                                    track.artist,
                                    track.album,
                                    track.mimetype
                                )

                                this.#progressTracks.setValue(playlist.tracks.indexOf(track))
                                this.#progressTracks.setProgressText(`${track.artist} - ${track.title}`)
                            }
                            if (playl.indexOf(playlist) + 1 === playl.length) {
                                let wc = App.getWebContents().getAllWebContents()
                                for (let test of wc) test.send("GENPLAYLIST")
                            }
                        }
                    })
                })
            }
        })

        this.#udb.selectUserData().then(async data => {
            global.access_token = data.access_token
            global.user_id = data.user_id
            let ub = await this.generateUserButton(data.access_token, data.user_id)
            this.addToHeaderRight([ub])
        }).catch(() => {
            this.addToHeaderRight([auth])
        })
    }

    async generateUserButton(access_token, user_id) {
        let datas = await this.#api.getUserData(access_token, user_id)
        let displayName = datas.account.displayName
        let defaultEmail = datas.defaultEmail
        return AppLayout.USER_PROFILE({
            username: `${displayName} [${defaultEmail}]`,
            image: {
                noImage: true
            },
            items: [
                AppLayout.USER_PROFILE_ITEM({
                    title: "Обновление токена",
                    clickEvent: () => {
                        new Notification({
                            title: "Токен", text: "Токен обновлен (ЭТО ПРОСТО СООБЩЕНИЕ)", showTime: 1000
                        }).show()
                    }
                })
            ]
        })
    }
}




render(() => new Apps()).finally(render => {
    Log.info(render)
})