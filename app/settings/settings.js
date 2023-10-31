const {store, ContentBlock, Styles, FieldSet, CheckBox, Notification} = require('chuijs');
const {SettingsMarks} = require("./settings_marks");

class Settings {
    #main = new ContentBlock({
        direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER
    })
    #elements = new SettingsElements();
    constructor() {
        this.#main.add(
            this.#elements.setFieldSet("Интерфейс", [
                this.#elements.setCheckBox("Новый интерфейс (Требуется перезапуск)", SettingsMarks.INTERFACE.new_skin)
            ]),
            this.#elements.setFieldSet("Музыка", [
                this.#elements.setCheckBox("Загрузка музыки (Требуется перезапуск)", SettingsMarks.TRACKS.download)
            ]),
            this.#elements.setFieldSet("Воспроизведение", [
                this.#elements.setCheckBox("Автоматическое воспроизведение музыки", SettingsMarks.PLAYBACK.autoplay)
            ])
        )
        return this.#main;
    }
}

class SettingsElements {
    setFieldSet(title = String(), components = []) {
        return new FieldSet({
            title: title,
            style: {
                direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
                align: Styles.ALIGN.START, justify: Styles.JUSTIFY.CENTER,
                width: Styles.SIZE.WEBKIT_FILL
            },
            components: components
        })
    }
    setCheckBox(title = String(), stores = String()) {
        let checkBox = new CheckBox({title: title})
        checkBox.setValue(store.get(stores))
        checkBox.addChangeListener((e) => {
            store.set(stores, e.target.checked)
            new Notification({ title: checkBox.getTitle(), text: `Сохранено`, style: Notification.STYLE.SUCCESS, showTime: 1000 }).show()
        })
        return checkBox
    }
}

exports.Settings = Settings