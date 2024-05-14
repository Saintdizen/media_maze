const {Page, YaAudio, Styles, path, App, ipcRenderer, Dialog, Icons, Button, Notification} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");

class Player extends Page {
    #pdb = new PlaylistDB(App.userDataPath())
    #audio = new YaAudio({
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        coverPath: `file://${require('path').join(__dirname, 'cover.png')}`
    })
    #dialog = undefined
    //
    #played_list = new Dialog({ closeOutSideClick: true, width: "91%", height: "85%", transparentBack: true })
    #playlist_list = new Dialog({ closeOutSideClick: true, width: "91%", height: "85%", transparentBack: true })
    #playlist = []
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
            this.#generatePlayList();
        })

        ipcRenderer.on("GENPLAYLIST", () => {
            this.#generatePlayList()
            this.#genPlList()
            this.#dialog.close()
        })

        // let ce = new CustomElement({
        //     id: "123"
        // })
        //
        // this.add(ce)

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
            })
        )

        this.#genPlList()

        this.add(this.#playlist_list)
        this.#audio.addFunctionButton(
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_ADD,
                clickEvent: () => this.#playlist_list.open()
            })
        )

        this.#played_list.addToBody(this.#audio.getPlaylist())
        this.add(this.#played_list)
        this.#audio.addFunctionButton(
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_PLAY,
                clickEvent: () => this.#played_list.open()
            })
        )
    }

    #genPlList() {
        this.#pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                let button = new Button({
                    reverse: false,
                    title: table.name,
                    icon: undefined,
                    clickEvent: () => {
                        this.#playlist = []
                        this.#pdb.getPlaylist(table.name).then(pl => {
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
                        this.#playlist_list.close()
                        setTimeout(() => {
                            this.#audio.setPlayList(this.#playlist)
                            this.#played_list.open()
                        }, 250);
                    }
                })
                this.#playlist_list.addToBody(button)
            }
        })
    }

    #generatePlayList() {
        this.#playlist = []
        this.#pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                this.#pdb.getPlaylist(table.name).then(pl => {
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
            }
        })
        setTimeout(() => this.#audio.setPlayList(this.#playlist), 500);
    }
}

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

exports.Player = Player

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