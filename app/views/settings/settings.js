const {Page, store, ContentBlock, Styles, FieldSet, CheckBox, Notification} = require('chuijs');
const {SettingsMarks} = require("./settings_marks");

class Settings extends Page {
    #main = new ContentBlock({
        direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER
    })
    constructor() {
        super();
        this.setTitle('Настройки');
        this.setFullHeight()
        this.disablePadding()
        this.setMain(false)
        this.add(this.#main)
        this.#main.add(this.setPlaybackBlock())
    }
    setPlaybackBlock() {
        // === Автоматическое воспроизведение музыки ===
        let autoplay = new CheckBox({title: "Автоматическое воспроизведение музыки"})
        autoplay.setValue(store.get(SettingsMarks.PLAYBACK.autoplay))
        autoplay.addChangeListener((e) => {
            store.set(SettingsMarks.PLAYBACK.autoplay, e.target.checked)
            new Notification({ title: this.getTitle(), text: `Сохранено: "${autoplay.getTitle()}"`, style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
        })
        // ===
        return new FieldSet({
            title: "Воспроизведение",
            style: {
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
                width: Styles.SIZE.WEBKIT_FILL
            },
            components: [autoplay]
        })
    }
}

exports.Settings = Settings