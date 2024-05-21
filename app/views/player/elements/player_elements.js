const {Dialog, CustomElement, Icon, Icons} = require("chuijs");
let path_css = require("path").join(__dirname, "player_elements.css")

class PlayerDialog {
    #dialog = undefined
    #title = new CustomElement({
        id: "test_dialog_pl_list_title", pathToCSS: path_css
    })
    #button_close = new CustomElement({
        id: "test_close_button_one", pathToCSS: path_css
    })
    #main_block = new CustomElement({
        id: "test_track_list_main_block", className: "test_track_list_main_block", pathToCSS: path_css
    })
    constructor(width = "max-content", height = "max-content") {
        this.#dialog = new Dialog({ closeOutSideClick: false, width: width, height: height, transparentBack: true })
        this.#title.innerText("Список плейлистов")
        this.#button_close.innerHTML(new Icon(Icons.NAVIGATION.CLOSE, "18px").getHTML())
        this.#button_close.addEventListener("click", () => this.#dialog.close())
        this.#dialog.addToHeader(this.#title, this.#button_close)
        this.#dialog.addToBody(this.#main_block)
    }
    setTitle(name = String()) {
        this.#title.innerText(name)
    }
    addToHeader(...components) {
        for (let component of components) this.#dialog.addToHeader(component);
    }
    addToBody(...components) {
        for (let component of components) this.#dialog.addToBody(component);
    }
    open() {
        this.#dialog.open()
    }
    close() {
        this.#dialog.close()
    }
    clear() {
        this.#main_block.set().innerHTML = ''
    }
    addToMainBlock(...components) {
        try {
            for (let component of components) this.#main_block.set().appendChild(component.set());
        } catch {
            for (let component of components) this.#main_block.set().appendChild(component);
        }
    }
    set() {
        return this.#dialog.set()
    }
}

exports.PlayerDialog = PlayerDialog

class PlayerDialogButton {
    #main_block = new CustomElement({
        id: "test_main_block", className: "test_main_block", pathToCSS: path_css
    })
    #title = new CustomElement({
        id: "test_title", className: "test_title", pathToCSS: path_css
    })
    //
    #controls = new CustomElement({
        id: "test_controls_block", className: "test_controls_block", pathToCSS: path_css
    })
    #download = new CustomElement({
        id: "test_download", className: "test_controls_button", pathToCSS: path_css
    })
    constructor(table, listener = () => {}) {
        this.#main_block.addEventListener("click", listener)
        this.#title.innerText(table.pl_title)
        this.#download.innerHTML(new Icon(Icons.FILE.DOWNLOAD, "18px").getHTML())
        //
        this.#main_block.set().appendChild(this.#title.set())
        this.#main_block.set().appendChild(this.#controls.set())
    }
    addDownloadButton() {
        this.#controls.set().appendChild(this.#download.set())
    }
    set() {
        return this.#main_block
    }
}

exports.PlayerDialogButton = PlayerDialogButton