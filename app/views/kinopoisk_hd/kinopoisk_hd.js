const {Page, WebView, Notification} = require('chuijs');

class KinopoiskPage extends Page {
    constructor() {
        super();
        this.setTitle('Кинопоиск HD (beta)');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(false)
        let web = new WebView("https://hd.kinopoisk.ru/");
        web.addFinishLoadEvent(() => {
            new Notification({
                title: this.getTitle(),
                text: "Загружено",
                style: Notification.STYLE.SUCCESS,
                showTime: 1000
            }).show()
        })
        web.insertCustomRes({
            cssPath: __dirname + "/style.css"
        });
        this.add(web);
    }
}

exports.KinopoiskPage = KinopoiskPage