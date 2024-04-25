const {Page, YaAudio, Styles, path, App, ipcRenderer} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");

class Player extends Page {
    #pdb = new PlaylistDB(App.userDataPath())
    #audio = new YaAudio({
        autoplay: false,
        playlist: true,
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        //pin: Audio.PIN.BOTTOM
    })
    #dialog = undefined
    constructor(dialog) {
        super();
        this.#dialog = dialog
        this.setTitle('Проигрыватель');
        this.setFullHeight();
        this.setMain(true);

        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio, this.#dialog)
        this.addRouteEvent(this, (e) => {
            console.log(e)
            this.#audio.restoreFX();
            this.#generatePlayList()
        })

        ipcRenderer.on("GENPLAYLIST", () => {
            console.log("Генерация плейлиста")
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
                        playlist.push({
                            track_id: track.track_id,
                            title: track.title,
                            artist: track.artist,
                            album: track.album,
                            mimetype: track.mimetype
                        })
                    }
                })
            }
        })
        setTimeout(() => {
            this.#audio.setPlayList(playlist)
        }, 500);
    }
}

exports.Player = Player