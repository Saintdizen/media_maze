const {Page, Audio, Styles, path, App, ipcRenderer} = require('chuijs');
const {PlaylistDB} = require("../../sqlite/sqlite");

class Player extends Page {
    #pdb = new PlaylistDB(App.userDataPath())
    #audio = new Audio({
        autoplay: false,
        playlist: true,
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        //pin: Audio.PIN.BOTTOM
    })
    constructor() {
        super();
        this.setTitle('Проигрыватель');
        this.setFullHeight();
        this.setMain(false);

        //ipcRenderer.on("PLAY_PAUSE", async () => this.#audio.play())
        //ipcRenderer.on("NEXT_TRACK", async () => this.#audio.next())

        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
            this.generatePlayList()
        })

        ipcRenderer.on("TEST", () => {
            console.log("test")
            this.generatePlayList()
        })
    }

    generatePlayList() {
        let playlist = []
        this.#pdb.selectTables().then(tables => {
            for (let table of tables) {
                this.#pdb.select(table.name).then(pl => {
                    for (let track of pl) playlist.push(track)
                })
            }
        })
        setTimeout(() => this.#audio.setPlayList(playlist), 500);
    }

}

exports.Player = Player