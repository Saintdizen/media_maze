const {Page, WebView, Notification, ipcRenderer, store} = require('chuijs');
const {SettingsMarks} = require("../settings/settings_marks");

class YandexMusicPage extends Page {
    constructor() {
        super();
        this.setTitle('Яндекс Музыка');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(true)
        let web = new WebView("https://music.yandex.ru/");
        web.insertCustomRes({
            cssPath: __dirname + "/style.css",
            jsPath: __dirname + "/preload.js"
        });
        ipcRenderer.on("PLAY_PAUSE", async () => await web.executeJavaScript("if (Mu.blocks.di.repo.player.getState() === 'idle') { Mu.blocks.di.repo.player.play(); } else { Mu.blocks.di.repo.player.audio().togglePause(); }"))
        ipcRenderer.on("NEXT_TRACK", async () => await web.executeJavaScript("Mu.blocks.di.repo.player.source().next()"))
        ipcRenderer.on("PREV_TRACK", async () => await web.executeJavaScript("Mu.blocks.di.repo.player.source().prev()"))

        web.addFinishLoadEvent(() => {
            new Notification({ title: this.getTitle(), text: "Загружено", style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
            setTimeout( async () => {
                if (store.get(SettingsMarks.PLAYBACK.autoplay)) await web.executeJavaScript("if (Mu.blocks.di.repo.player.getState() === 'idle') { Mu.blocks.di.repo.player.play(); } else { Mu.blocks.di.repo.player.audio().togglePause(); }")
            }, 1500)
        });

        this.add(web);
    }
}

exports.YandexMusicPage = YandexMusicPage