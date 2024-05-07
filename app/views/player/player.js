const {Page, YaAudio, Styles, path, App, ipcRenderer} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");

class Player extends Page {
    #pdb = new PlaylistDB(App.userDataPath())
    #audio = new YaAudio({
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL
    })
    #dialog = undefined
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
            this.#dialog.close()
        })
    }

    #generatePlayList() {
        let playlist = []
        this.#pdb.selectTables().then(tables => {
            for (let table of tables) {
                this.#pdb.select(table.name).then(pl => {
                    for (let track of pl) {
                        console.log(track)
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