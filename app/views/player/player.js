const {Page, YaAudio, Styles, path, App, ipcRenderer, Icons, Notification, DownloadProgressNotification, YaApi} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");
const {PlayerDialog, PlayerDialogButton} = require("./elements/player_elements");

let dl_notification = undefined

class Player extends Page {
    #pdb = new PlaylistDB(App.userDataPath())
    #audio = new YaAudio({
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        coverPath: `file://${require('path').join(__dirname, 'cover.png')}`
    })
    #dialog = undefined
    //
    #playlist = []
    playlist_list = new PlayerDialog()
    track_list = new PlayerDialog("60%", "90%")
    constructor(dialog) {
        super();
        this.#dialog = dialog
        this.setTitle('Media Maze');
        this.setFullHeight();
        this.setMain(false);
        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio, this.#dialog)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
            //gen_pl()
        })

        ipcRenderer.on("GENPLAYLIST", () => {
            this.#generatePlayList()
            this.#dialog.close()
            //gen_pl()
        })

        this.#audio.addFunctionButton(
            YaAudio.FUNCTION_ACTIVE_BUTTON({
                value: false,
                icon_on: Icons.AUDIO_VIDEO.SHUFFLE_ON,
                icon_off: Icons.AUDIO_VIDEO.SHUFFLE,
                activateEvent: (evt) => {
                    if (evt.target.checked) {
                        this.#audio.setPlayList(shuffle(this.#playlist.slice()))
                        new Notification({
                            title: "Перемешать", text: evt.target.checked, showTime: 1000
                        }).show()
                    } else {
                        this.#audio.setPlayList(this.#playlist)
                        new Notification({
                            title: "Перемешать", text: evt.target.checked, showTime: 1000
                        }).show()
                    }
                },
            }),
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_ADD,
                clickEvent: () => this.playlist_list.open()
            }),
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_PLAY,
                clickEvent: () => this.track_list.open()
            })
        )

        this.#generatePlayList()
        this.add(this.playlist_list, this.track_list)
    }

    #generatePlayList() {
        this.playlist_list.clear()
        this.track_list.clear()
        this.#pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                let button = new PlayerDialogButton(table, async (evt) => {
                    if (evt.target.id === "test_download") {
                        this.#pdb.getPlaylist(table.pl_kind).then(async dpl => {
                            let links = []
                            for (let dtr of dpl) {
                                if (dtr.path === "") {
                                    links.push({
                                        table: table.pl_kind,
                                        pl_title: table.pl_title,
                                        track_id: dtr.track_id,
                                        savePath: require("path").join(App.userDataPath(), 'downloads', table.pl_kind),
                                        filename: `${dtr.artist.replaceAll(" ", "_")}_-_${dtr.title.replaceAll(" ", "_")}.mp3`,
                                        filename_old: `${dtr.artist} - ${dtr.title}.mp3`
                                    })
                                }
                            }
                            ipcRenderer.send("download_"+table.pl_kind, {data: links});

                            ipcRenderer.once("DOWNLOAD_START_"+table.pl_kind, () => {
                                dl_notification = new DownloadProgressNotification({title: "Загрузка ..."})
                                dl_notification.show()
                                ipcRenderer.on("DOWNLOAD_TRACK_START_"+table.pl_kind, (event, args) => dl_notification.update(
                                    args.title, args.track, args.number, args.max))
                                ipcRenderer.on("DOWNLOAD_DONE_"+table.pl_kind, () => {
                                    dl_notification.done()
                                    this.regeneratePlaylist()
                                    dl_notification = undefined
                                })
                            })
                        })
                    } else {
                        this.#playlist = []
                        this.#pdb.getPlaylist(table.pl_kind).then(pl => {
                            for (let track of pl) {
                                this.#playlist.push({
                                    track_id: track.track_id,
                                    title: track.title,
                                    artist: track.artist,
                                    album: `https://${track.album.replace("%%", "800x800")}`,
                                    mimetype: track.mimetype,
                                    path: track.path
                                })
                            }
                        })
                        this.playlist_list.close()
                        setTimeout(() => {
                            this.#audio.setPlayList(this.#playlist)
                            this.track_list.addToMainBlock(this.#audio.getPlaylist().getPlaylist())
                            this.track_list.setTitle(table.pl_title)
                            this.track_list.open()
                        }, 250);
                    }
                })
                this.playlist_list.addToMainBlock(button.set())
            }
        })
    }
}

exports.Player = Player

const shuffle = (array) => {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}