const {Page, WebView, Notification} = require('chuijs');

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
        })
        web.insertCustomCSS(__dirname + "/style.css");
        this.add(web);
    }
}

exports.YandexMusicPage = YandexMusicPage