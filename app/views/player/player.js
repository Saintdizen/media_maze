const {Page, Button, Audio, Styles, path, App, fs} = require('chuijs');
const {YaApi} = require("./ya_api");

class Player extends Page {
    #api = new YaApi()
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
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();

        })

        let auth = new Button({
            title: "auth",
            clickEvent: async () => await this.#api.auth()
        })
        let getPlaylists = new Button({
            title: "getPlaylists",
            clickEvent: async () => {
                await this.#api.getAccountStatus()
                await this.#audio.setPlayList(await this.#api.getTracks())
            }
        })

        //
        this.add(auth, getPlaylists)
        this.add(this.#audio)
    }

}

exports.Player = Player