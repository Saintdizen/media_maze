const {store, ContentBlock, Styles, FieldSet, CheckBox, Notification} = require('chuijs');
const {SettingsMarks} = require("./settings_marks");

class Settings {
    #main = new ContentBlock({
        direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER
    })
    constructor() {
        this.#main.add(
            this.setPlaybackBlock(),
            this.setTracksBlock(),
            this.setInterfaceBlock()
        )
        return this.#main;
    }
    setInterfaceBlock() {
        // === Автоматическое воспроизведение музыки ===
        let new_skin = new CheckBox({title: "Новый интерфейс (Требуется перезапуск)"})
        new_skin.setValue(store.get(SettingsMarks.INTERFACE.new_skin))
        new_skin.addChangeListener((e) => {
            store.set(SettingsMarks.INTERFACE.new_skin, e.target.checked)
            new Notification({ title: new_skin.getTitle(), text: `Сохранено`, style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
        })
        // ===
        return new FieldSet({
            title: "Музыка",
            style: {
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
                width: Styles.SIZE.WEBKIT_FILL
            },
            components: [new_skin]
        })
    }
    setTracksBlock() {
        // === Автоматическое воспроизведение музыки ===
        let download_track = new CheckBox({title: "Загрузка музыки (Требуется перезапуск)"})
        download_track.setValue(store.get(SettingsMarks.TRACKS.download))
        download_track.addChangeListener((e) => {
            store.set(SettingsMarks.TRACKS.download, e.target.checked)
            new Notification({ title: download_track.getTitle(), text: `Сохранено`, style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
        })
        // ===
        return new FieldSet({
            title: "Музыка",
            style: {
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
                width: Styles.SIZE.WEBKIT_FILL
            },
            components: [download_track]
        })
    }
    setPlaybackBlock() {
        // === Автоматическое воспроизведение музыки ===
        let autoplay = new CheckBox({title: "Автоматическое воспроизведение музыки"})
        autoplay.setValue(store.get(SettingsMarks.PLAYBACK.autoplay))
        autoplay.addChangeListener((e) => {
            store.set(SettingsMarks.PLAYBACK.autoplay, e.target.checked)
            new Notification({ title: autoplay.getTitle(), text: `Сохранено`, style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
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