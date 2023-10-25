const {Page, WebView, Notification, ipcRenderer} = require('chuijs');

class YandexMusicPage extends Page {
    constructor() {
        super();
        this.setTitle('Яндекс Музыка');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(true)
        let web = new WebView("https://music.yandex.ru/");
        web.addFinishLoadEvent(() => {
            new Notification({
                title: this.getTitle(),
                text: "Загружено",
                style: Notification.STYLE.SUCCESS,
                showTime: 1000
            }).show()
        });
        web.insertCustomRes({
            cssPath: __dirname + "/style.css",
            jsPath: __dirname + "/preload.js"
        });
        /*web.addStopLoadEvent(async () => {
            await web.executeJavaScript("Mu.blocks.di.repo.player.play();")
        })*/
        ipcRenderer.on("PLAY_PAUSE", async () => {
            await web.executeJavaScript("if (Mu.blocks.di.repo.player.getState() === 'idle') { Mu.blocks.di.repo.player.play(); } else { Mu.blocks.di.repo.player.audio().togglePause(); }")
        })
        ipcRenderer.on("NEXT_TRACK", async () => {
            await web.executeJavaScript("Mu.blocks.di.repo.player.source().next()")
        })
        ipcRenderer.on("PREV_TRACK", async () => {
            await web.executeJavaScript("Mu.blocks.di.repo.player.source().prev()")
        })
        this.add(web);
    }
}

exports.YandexMusicPage = YandexMusicPage