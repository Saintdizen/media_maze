const {Page, YaAudio, Styles, path, App, ipcRenderer, Icons, Notification} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");
const {PlayerDialog, PlayerDialogButton} = require("./elements/player_elements");

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
        })

        ipcRenderer.on("GENPLAYLIST", () => {
            this.#generatePlayList()
            this.#dialog.close()
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
        // DOWNLOAD_TRACK_DONE
        ipcRenderer.on("DOWNLOAD_TRACK_DONE", (event, args) => {
            new Notification({ title: "DOWNLOAD_DONE", text: args.filename_old, showTime: 1000 }).show()
        })
        ipcRenderer.on("DOWNLOAD_DONE", () => {
            new Notification({ title: "DOWNLOAD_DONE", text: "DOWNLOAD_DONE", showTime: 1000 }).show()
        })
    }

    #generatePlayList() {
        this.playlist_list.clear()
        this.track_list.clear()
        this.#pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                let button = new PlayerDialogButton(table, async (evt) => {
                    if (evt.target.id === "test_download") {
                        new Notification({ title: table.pl_title, text: table.pl_kind, showTime: 1000 }).show()
                        this.#pdb.getPlaylist(table.pl_kind).then(async dpl => {
                            let links = []
                            for (let dtr of dpl) {
                                console.log(dtr)
                                if (dtr.path === "") {
                                    links.push({
                                        table: table.pl_kind,
                                        track_id: dtr.track_id,
                                        savePath: require("path").join(App.userDataPath(), 'downloads', table.pl_kind),
                                        filename: `${dtr.artist.replaceAll(" ", "_")}_-_${dtr.title.replaceAll(" ", "_")}.mp3`,
                                        filename_old: `${dtr.artist} - ${dtr.title}.mp3`
                                    })
                                }
                            }
                            ipcRenderer.send("download", {data: links});
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
                                    mimetype: track.mimetype
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
    // Пока есть элементы для перемешивания
    while (m) {
        // Взять оставшийся элемент
        i = Math.floor(Math.random() * m--);
        // И поменять его местами с текущим элементом
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}

// generatePlaylist() {
//     let dl_path = path.join(App.userDataPath(), "downloads")
//     let playlist = []
//     fs.readdir(dl_path, (err, files) => {
//         files.forEach(file => {
//             console.log(file)
//             try {
//                 let artist = file.split(" - ")[0]
//                 let title = file.split(" - ")[1].replace(".mp3", "")
//                 playlist.push({
//                     title: title, artist: artist, album: "", mimetype: Audio.MIMETYPES.MP3,
//                     path: String(path.join(dl_path, file))
//                 })
//             } catch (e) {
//                 let title = file.replace(".mp3", "")
//                 playlist.push({
//                     title: title, artist: title, album: title, mimetype: Audio.MIMETYPES.MP3,
//                     path: String(path.join(dl_path, file))
//                 })
//             }
//         });
//     });
//     setTimeout(() => this.#audio.setPlayList(playlist), 100);
// }