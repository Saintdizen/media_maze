const {Page, Audio, Styles, path, App} = require('chuijs');
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
        //ipcRenderer.on("PREV_TRACK", async () => this.#audio.prev())

        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
            this.generatePlayList()
        })
    }

    generatePlayList() {
        this.#pdb.select().then(p => {
            console.log(p)
            setTimeout(() => this.#audio.setPlayList(p), 100);
        })
    }

}

exports.Player = Player