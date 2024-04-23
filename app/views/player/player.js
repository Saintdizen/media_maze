const {Page, Audio, Styles, path, App} = require('chuijs');
const storage = require("electron-json-storage");
storage.setDataPath(App.userDataPath() + "/playlists");

class Player extends Page {
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
        let playlist_new = []
        storage.get('0_playlists', (error, data) => {
            if (error) throw error;
            for (let d of data.items) {
                storage.get(String(d), (error, data) => {
                    if (error) throw error;
                    for (let track of data.tracks) {
                        playlist_new.push(track)
                    }
                });
            }
        });
        setTimeout(() => this.#audio.setPlayList(playlist_new), 100);
    }

}

exports.Player = Player