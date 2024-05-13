const {Page, YaAudio, Styles, path, App, ipcRenderer, Dialog, Icons, Button} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");

class Player extends Page {
    #pdb = new PlaylistDB(App.userDataPath())
    #audio = new YaAudio({
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL
    })
    #dialog = undefined
    //
    #played_list = new Dialog({ closeOutSideClick: true, width: "91%", height: "85%", transparentBack: true })
    #playlist_list = new Dialog({ closeOutSideClick: true, width: "91%", height: "85%", transparentBack: true })
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

        this.#audio.addFunctionButton(
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.SHUFFLE,
                clickEvent: () => {}
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
                        let playlist = []
                        this.#pdb.getPlaylist(table.name).then(pl => {
                            for (let track of pl) {
                                playlist.push({
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
                            this.#audio.setPlayList(playlist.reverse())
                            this.#played_list.open()
                        }, 250);
                    }
                })
                this.#playlist_list.addToBody(button)
            }
        })
    }

    #generatePlayList() {
        let playlist = []
        this.#pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                this.#pdb.getPlaylist(table.name).then(pl => {
                    for (let track of pl) {
                        playlist.push({
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
        setTimeout(() => this.#audio.setPlayList(playlist), 500);
    }
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