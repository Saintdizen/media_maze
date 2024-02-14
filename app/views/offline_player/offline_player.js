const {Page, fs, App, path, Audio, Styles, ipcRenderer} = require('chuijs');

class OfflinePlayer extends Page {
    #audio = new Audio({
        autoplay: false,
        playlist: true,
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        //pin: Audio.PIN.BOTTOM
    })
    constructor() {
        super();
        this.setTitle('Оффлайн проигрыватель');
        this.setFullHeight();
        this.setMain(false);

        //ipcRenderer.on("PLAY_PAUSE", async () => this.#audio.play())
        //ipcRenderer.on("NEXT_TRACK", async () => this.#audio.next())
        //ipcRenderer.on("PREV_TRACK", async () => this.#audio.prev())

        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
            this.generatePlaylist();
        })
    }
    generatePlaylist() {
        let dl_path = path.join(App.userDataPath(), "downloads")
        let playlist = []
        fs.readdir(dl_path, (err, files) => {
            files.forEach(file => {
                console.log(file)
                try {
                    let artist = file.split(" - ")[0]
                    let title = file.split(" - ")[1].replace(".mp3", "")
                    playlist.push({
                        title: title, artist: artist, album: "", mimetype: Audio.MIMETYPES.MP3,
                        path: String(path.join(dl_path, file))
                    })
                } catch (e) {
                    let title = file.replace(".mp3", "")
                    playlist.push({
                        title: title, artist: title, album: title, mimetype: Audio.MIMETYPES.MP3,
                        path: String(path.join(dl_path, file))
                    })
                }
            });
        });
        setTimeout(() => this.#audio.setPlayList(playlist), 100);
    }
}

exports.OfflinePlayer = OfflinePlayer