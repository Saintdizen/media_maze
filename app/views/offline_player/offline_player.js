const {Page, fs, App, path, Audio, Styles} = require('chuijs');

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

        setTimeout(() => {
            audio.setPlayList(this.#playlist)
        }, 100)


        this.add(audio)
    }
}

exports.OfflinePlayer = OfflinePlayer