const {Page, YaAudio, Styles, path, App, ipcRenderer, Dialog, Icons, Notification, CustomElement, Icon} = require('chuijs');
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
    #playlist = []
    playlist_list = this.#dialog_gen()
    track_list = this.#dialog_gen()
    constructor(dialog) {
        super();
        this.#dialog = dialog
        this.setTitle('Media Maze');
        this.setFullHeight();
        this.setMain(false);
        this.add(this.playlist_list, this.track_list)

        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio, this.#dialog)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
            this.#generatePlayList();
        })

        ipcRenderer.on("GENPLAYLIST", () => {
            this.#generatePlayList()
            this.#test()
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

        this.#test()
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

    #dialog_gen() {
        let dialog = new Dialog({ closeOutSideClick: false, width: "91%", height: "85%", transparentBack: true })
        let button_close = new CustomElement({
            id: "test_close_button_one",
            pathToCSS: "app/views/player/test.css"
        })
        button_close.set().innerHTML = new Icon(Icons.NAVIGATION.CLOSE, "18px").getHTML()
        button_close.set().addEventListener("click", () => dialog.close())
        dialog.addToHeader(button_close)
        return dialog
    }

    #playlist_button_gen(name, listener = () => {}) {
        let main_block = new CustomElement({
            id: "test_main_block",
            className: "test_main_block",
            pathToCSS: "app/views/player/test.css"
        })
        main_block.set().addEventListener("click", listener)
        //
        let title = new CustomElement({
            id: "test_title",
            className: "test_title",
            pathToCSS: "app/views/player/test.css"
        })
        title.set().innerText = name
        //
        let controls = new CustomElement({
            id: "test_controls_block",
            className: "test_controls_block",
            pathToCSS: "app/views/player/test.css"
        })
        controls.set().addEventListener("click", () => {
            console.log("controls")
        })
        let download = new CustomElement({
            id: "test_download",
            className: "test_controls_button",
            pathToCSS: "app/views/player/test.css"
        })
        download.set().innerHTML = new Icon(Icons.FILE.DOWNLOAD, "18px").getHTML()
        download.set().addEventListener("click", () => {
            console.log("download")
        })
        //
        controls.set().appendChild(download.set())
        //
        main_block.set().appendChild(title.set())
        main_block.set().appendChild(controls.set())
        return main_block
    }

    #test() {
        let test = new CustomElement({
            id: "test_track_list_main_block",
            className: "test_track_list_main_block",
            pathToCSS: "app/views/player/test.css"
        })
        this.track_list.addToBody(test)
        this.#pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                let button = this.#playlist_button_gen(table.name, () => {
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
                    this.playlist_list.close()
                    setTimeout(() => {
                        this.#audio.setPlayList(this.#playlist)
                        test.set().appendChild(this.#audio.getPlaylist().getPlaylist())
                        this.track_list.open()
                    }, 250);
                })
                this.playlist_list.addToBody(button)
            }
        })
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