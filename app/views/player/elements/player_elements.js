const {Dialog, CustomElement, Icon, Icons, TextInput, Styles, Button, ContentBlock, App, YaApi} = require("chuijs");
const {UserDB, PlaylistDB} = require("../../../sqlite/sqlite");
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
    constructor(width = "max-content", height = "max-content", title = "Список плейлистов") {
        this.#dialog = new Dialog({ closeOutSideClick: false, width: width, height: height, transparentBack: true })
        this.#title.innerText(title)
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

class PlayerDialogSearch {
    udb = new UserDB(App.userDataPath())
    pdb = new PlaylistDB(App.userDataPath())
    api = new YaApi()
    //
    #search_list = new PlayerDialog("60%", "90%", "Поиск")
    //
    #main = new ContentBlock({
        direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER,
        disableMarginChild: true,
    })
    #controls = new ContentBlock({
        direction: Styles.DIRECTION.ROW, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER
    })
    #search_input = new TextInput({ width: Styles.SIZE.WEBKIT_FILL })
    #search_button = new Button({ icon: Icons.ACTIONS.SEARCH, transparentBack: true })
    //
    #list = new ContentBlock({
        direction: Styles.DIRECTION.COLUMN, wrap: Styles.WRAP.NOWRAP,
        align: Styles.ALIGN.CENTER, justify: Styles.JUSTIFY.CENTER
    })
    constructor() {
        //
        this.#main.setWidth(Styles.SIZE.WEBKIT_FILL)
        this.#main.setHeight(Styles.SIZE.WEBKIT_FILL)
        this.#controls.setWidth(Styles.SIZE.WEBKIT_FILL)
        this.#list.setHeight(Styles.SIZE.WEBKIT_FILL)
        this.#list.setWidth(Styles.SIZE.WEBKIT_FILL)
        this.#list.setAutoOverflow(true)
        //
        this.#controls.add(this.#search_input, this.#search_button)
        this.#main.add(this.#controls, this.#list)
        this.#search_list.addToMainBlock(this.#main)
        //

        this.#search_button.addClickListener(() => {
            this.udb.selectUserData().then(async (udt) => {
                let res = await this.api.search(udt.access_token, udt.user_id, this.#search_input.getValue())
                let tracks = res.tracks.results

                this.#list.clear()
                for (let track of tracks) {
                    console.log(track.id, track.artists[0].name, track.title, track.coverUri)
                    this.#list.add(this.generateButton(track))
                }

            })
        })
    }
    generateButton(track) {
        let button_track = new CustomElement({
            id: String(track.id), className: "search_button_track", pathToCSS: path_css
        })
        let button_track_cover = new CustomElement({
            id: "search_button_track_cover", className: "search_button_track_cover", pathToCSS: path_css
        })
        button_track_cover.set().style.backgroundImage = `url('https://${track.coverUri.replace("%%", '400x400')}')`
        button_track_cover.set().style.backgroundSize = 'cover'
        let button_track_title = new CustomElement({
            id: "search_button_track_title", className: "search_button_track_title", pathToCSS: path_css
        })
        button_track_title.innerText(`${track.artists[0].name} - ${track.title}`)
        button_track.set().appendChild(button_track_cover.set())
        button_track.set().appendChild(button_track_title.set())
        return button_track
    }
    open() {
        this.#search_list.open()
    }
    set() {
        return this.#search_list.set()
    }
}

exports.PlayerDialogSearch = PlayerDialogSearch