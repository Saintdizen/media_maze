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
                name: ".theme-white .rup-settings-context, .theme-white .rup-settings__button .d-button-inner, .theme-white .deco-button-slider-control .deco-button-stylable",
                style: {
                    "border": "2px solid !important",
                }
            },
            {
                name: ".theme-black .rup-settings-context, .theme-black .rup-settings__button .d-button-inner, .theme-black .deco-button-slider-control .deco-button-stylable",
                style: {
                    "border": "2px solid !important",
                }
            },
            {
                name: ".theme-white .deco-pane-popup, .theme-white .deco-text-overlay:after, .theme-white .deco-tooltip",
                style: {
                    "background-color": "transparent !important",
                    "background-image": "none !important",
                }
            },
            {
                name: ".theme-black .deco-pane-popup, .theme-black .deco-text-overlay:after, .theme-black .deco-tooltip",
                style: {
                    "background-color": "transparent !important",
                    "background-image": "none !important",
                }
            },
            {
                name: ".theme-white .deco-popup-menu, body.theme-white.deco-pane-body, .theme-white .deco-player-controls, .theme-white .deco-progress .progress__bg, .theme-white .deco-pane",
                style: {
                    "background-color": "rgba(235, 235, 235, 0.5) !important",
                    "color": "rgba(44, 44, 44, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            {
                name: ".theme-black .deco-popup-menu, body.theme-black.deco-pane-body, .theme-black .deco-player-controls, .theme-black .deco-progress .progress__bg, .theme-black .deco-pane",
                style: {
                    "background-color": "rgba(44, 44, 44, 0.5) !important",
                    "color": "rgba(235, 235, 235, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            // Поиск
            {
                name: ".theme-white .deco-input",
                style: {
                    "background-color": "rgba(235, 235, 235, 0.5) !important",
                    "color": "rgba(44, 44, 44, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            {
                name: ".theme-black .deco-input",
                style: {
                    "background-color": "rgba(44, 44, 44, 0.5) !important",
                    "color": "rgba(235, 235, 235, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            {
                name: ".theme-white .deco-popup-suggest-menu",
                style: {
                    "background-color": "rgba(235, 235, 235, 0.5) !important",
                    "color": "rgba(44, 44, 44, 1) !important",
                    "border-bottom-left-radius": "8px !important",
                    "border-bottom-right-radius": "8px !important",
                }
            },
            {
                name: ".theme-black .deco-popup-suggest-menu",
                style: {
                    "background-color": "rgba(44, 44, 44, 0.5) !important",
                    "color": "rgba(235, 235, 235, 1) !important",
                    "border-bottom-left-radius": "8px !important",
                    "border-bottom-right-radius": "8px !important",
                }
            },
            //
            {
                name: ".theme-white .sidebar-rup-button",
                style: {
                    "background-color": "transparent !important",
                    "color": "rgba(44, 44, 44, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            {
                name: ".theme-black .sidebar-rup-button",
                style: {
                    "background-color": "transparent !important",
                    "color": "rgba(235, 235, 235, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            {
                name: ".theme-white .sidebar-rup-button:hover",
                style: {
                    "background-color": "rgba(44, 44, 44, 0.5) !important",
                    "color": "rgba(235, 235, 235, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            {
                name: ".theme-black .sidebar-rup-button:hover",
                style: {
                    "background-color": "rgba(235, 235, 235, 0.5) !important",
                    "color": "rgba(44, 44, 44, 1) !important",
                    "border-radius": "8px !important",
                }
            },
            //
            {
                name: ".playlist-cover__mosaic",
                style: {
                    "outline": "none !important",
                }
            },
            {
                name: ".sidebar-cont, .player-controls, .progress, .popup, .volume__control, .radio-station__subs",
                style: {
                    "backdrop-filter": "blur(16px) !important",
                }
            },
            {
                name: ".d-share .ya-share2__container_size_M .ya-share2__item .ya-share2__badge, .d-button_size_S.d-button-inner, .d-button_size_S .d-button-inner, .popup, .page-main__clips-button .d-button-inner, .d-share-popup .share_hover.d-button, .d-like_theme-hover .d-button, .button_round, .button2_rounded, .d-track_with-cover .d-track__play, .d-track_selectable:hover:after, .d-hover__overlap, .playlist .d-hover, .playlist__cover, .playlist-cover__mosaic, video, figure, img, .teaser__content, .rup-settings-context, .d-button_rounded.d-button-inner, .d-button_rounded .d-button-inner, .entity-cover.deco-entity-image-placeholder.track-cover.entity-cover_size_Large, .d-cover__wrapper.playlist-cover__wrapper, .playlist-cover__mosaic, .playlist_selectable.playlist::before",
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