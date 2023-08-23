const {Page, WebView, Notification} = require('chuijs');

class YandexMusicPage extends Page {
    constructor() {
        super();
        this.setTitle('Яндекс Музыка');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(true)
        let web = new WebView("https://music.yandex.ru/");
        web.customScrollBar({
            enable: true,
            width: "6px",
            trackBackgroundColor: "inherit",
            thumbRadius: "6px",
            thumbColor: "#fcca00"
        })
        web.addFinishLoadEvent(() => {
            new Notification({
                title: this.getTitle(),
                text: "Загружено",
                style: Notification.STYLE.SUCCESS,
                showTime: 1000
            }).show()
        })
        web.insertCustomCSS([
            {
                name: ".theme-white .deco-player-controls",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                }
            },
            {
                name: ".theme-black .deco-player-controls",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                }
            },
            {
                name: ".theme-white .deco-pane",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                }
            },
            {
                name: ".theme-black .deco-pane",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                }
            },
            {
                name: ".theme-white .deco-popup-menu",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                    "border-radius": "8px !important",
                    //"border": "1px solid rgba(75, 75, 75, 0.2) !important"
                }
            },
            {
                name: ".theme-black .deco-popup-menu",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                    "border-radius": "8px !important",
                    //"border": "1px solid rgba(205, 205, 205, 0.2) !important"
                }
            },
            {
                name: ".theme-white .deco-pane-popup",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(235, 235, 235, 0.6) !important",
                    "border-radius": "8px !important",
                    //"border": "1px solid rgba(75, 75, 75, 0.2) !important"
                }
            },
            {
                name: ".theme-black .deco-pane-popup",
                style: {
                    "backdrop-filter": "blur(16px)",
                    "background-color": "rgba(44, 44, 44, 0.6) !important",
                    "border-radius": "8px !important",
                    //"border": "1px solid rgba(205, 205, 205, 0.2) !important"
                }
            },
            //
            {
                name: ".d-track_with-cover .d-track__play, .d-track_selectable:hover:after, .d-hover__overlap, .playlist .d-hover, .playlist__cover, .playlist-cover__mosaic, video, figure, img, .teaser__content, .rup-settings-context, .d-button_rounded.d-button-inner, .d-button_rounded .d-button-inner, .entity-cover.deco-entity-image-placeholder.track-cover.entity-cover_size_Large, .d-cover__wrapper.playlist-cover__wrapper, .playlist-cover__mosaic, .playlist_selectable.playlist::before",
                style: {
                    "border-radius": "8px !important"
                }
            },
            {
                name: ".rup__animation, .page-users .d-generic-page-head__aside",
                style: {
                    "display": "none !important"
                }
            },
            {
                name: ".page-main__line, .page-main__line_row",
                style: {
                    "margin-bottom": "40px !important"
                }
            },
            {
                name: ".rup__content-button",
                style: {
                    "margin": "auto !important",
                    "margin-top": "40px"
                }
            },
            {
                name: ".rup__content",
                style: {
                    "height": "auto !important",
                    "margin-bottom": "40px !important"
                }
            }
        ])
        this.add(web);
    }
}

exports.YandexMusicPage = YandexMusicPage