const {Page, WebView, Notification, ipcRenderer, store} = require('chuijs');
const {SettingsMarks} = require("../../settings/settings_marks");

class YandexMusicPage extends Page {
    #web = new WebView("https://music.yandex.ru/", false);
    constructor() {
        super();
        this.setTitle('Яндекс Музыка');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(true)

        this.#js("PLAY_PAUSE", "if (Mu.blocks.di.repo.player.getState() === 'idle') { Mu.blocks.di.repo.player.play(); } else { Mu.blocks.di.repo.player.audio().togglePause(); }")
        this.#js("NEXT_TRACK", "externalAPI.next()")
        this.#js("PREV_TRACK", "externalAPI.prev()")

        if (store.get(SettingsMarks.INTERFACE.new_skin)) {
            this.#web.insertCustomRes({
                cssPath: __dirname + "/style.css"
            });
        }

        if (store.get(SettingsMarks.TRACKS.download)) {
            this.#web.insertCustomRes({
                jsPath: __dirname + "/preload.js"
            });
        }

        this.#web.addFinishLoadEvent(() => {
            new Notification({ title: this.getTitle(), text: "Загружено", style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
            setTimeout( async () => {
                if (store.get(SettingsMarks.PLAYBACK.autoplay)) await this.#web.executeJavaScript("if (Mu.blocks.di.repo.player.getState() === 'idle') { Mu.blocks.di.repo.player.play(); } else { Mu.blocks.di.repo.player.audio().togglePause(); }")
            }, 1500)
        });

        this.add(this.#web);
    }
    #js(channel, js) {
        try { ipcRenderer.on(channel, async () => await this.#web.executeJavaScript(js)) } catch (e) { /*===*/ }
    }
}

exports.YandexMusicPage = YandexMusicPage