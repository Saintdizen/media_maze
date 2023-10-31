const {Page, fs, App, path, Button, H, ContentBlock, Styles, Audio} = require('chuijs');

class OfflinePlayer extends Page {
    #download_path = undefined;
    #main = new ContentBlock({
        direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.START, justify: Styles.JUSTIFY.CENTER
    })
    #playlist = []
    constructor() {
        super();
        this.setTitle('OfflinePlayer');
        this.setFullHeight();
        this.disablePadding();
        this.setMain(true);
        this.#download_path = path.join(App.userDataPath(), "downloads");

        let audio = new Audio({autoplay: false})
        let button_text_icon = new Button({
            title: "Сканировать",
            clickEvent: () => {
                this.#main.clear()
                fs.readdir(this.#download_path, (err, files) => {
                    files.forEach(file => {
                        this.#playlist.push({
                            title: file, artist: file, album: file, mimetype: Audio.MIMETYPES.MP3,
                            path: path.join(this.#download_path, file)
                        })
                        //this.#main.add(new H(1, file))
                    });
                });
                audio.setPlayList(this.#playlist)
            }
        });
        this.add(audio, button_text_icon, this.#main)
    }
}

exports.OfflinePlayer = OfflinePlayer