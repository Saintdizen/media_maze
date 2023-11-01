const {Page, fs, App, path, Audio, Styles, shell} = require('chuijs');

class OfflinePlayer extends Page {
    #download_path = undefined;
    #playlist = []

    constructor() {
        super();
        this.setTitle('OfflinePlayer');
        this.setFullHeight();
        this.setMain(false);
        let audio = new Audio({
            autoplay: false,
            width: Styles.SIZE.WEBKIT_FILL
        })
        this.#download_path = path.join(App.userDataPath(), "downloads");
        this.generatePlaylist();
        setTimeout(() => audio.setPlayList(this.#playlist), 100)
        audio.addClickListenerOne(async () => {
            await shell.openPath(path.join(App.userDataPath(), "downloads"))
        })
        audio.addClickListenerTwo(() => {
            this.generatePlaylist();
            setTimeout(() => audio.setPlayList(this.#playlist), 100);
        })
        this.add(audio)
    }
    generatePlaylist() {
        this.#playlist = []
        fs.readdir(this.#download_path, (err, files) => {
            files.forEach(file => {
                let artist = file.split(" - ")[0]
                let title = file.split(" - ")[1].replace(".mp3", "")
                this.#playlist.push({
                    title: title, artist: artist, album: "", mimetype: Audio.MIMETYPES.MP3,
                    path: String(path.join(this.#download_path, file))
                })
            });
        });
    }
}

exports.OfflinePlayer = OfflinePlayer