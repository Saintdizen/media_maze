const {Dialog, CustomElement, Icon, Icons, TextInput, Styles, YaApi, Button, ProgressBar, Spinner} = require("chuijs");
let path_css = require("path").join(__dirname, "player_elements.css")

class PlayerDialog {
    #dialog = undefined
    #title = new CustomElement({
        tag: "cust_elem", id: "test_dialog_pl_list_title", pathToCSS: path_css
    })
    #button_close = new CustomElement({
        tag: "cust_elem", id: "test_close_button_one", pathToCSS: path_css
    })
    #main_block = new CustomElement({
        tag: "cust_elem", id: "test_track_list_main_block", className: "test_track_list_main_block", pathToCSS: path_css
    })
    #search_block = new CustomElement({
        tag: "cust_elem", id: "test_track_list_main_block2", className: "test_track_list_main_block2", pathToCSS: path_css
    })
    #search_input = new TextInput({
        transparentBack: true,
        width: Styles.SIZE.WEBKIT_FILL,
        placeholder: "Поиск"
    })
    constructor(width = "max-content", height = "max-content", title = "Список плейлистов") {
        this.#dialog = new Dialog({ closeOutSideClick: false, width: width, height: height, transparentBack: true })
        this.#title.innerText(title)
        this.#button_close.innerHTML(new Icon(Icons.NAVIGATION.CLOSE, "18px").getHTML())
        this.#button_close.addEventListener("click", () => this.#dialog.close())
        this.#dialog.addToHeader(this.#title, this.#button_close)
        this.#search_block.set().appendChild(this.#search_input.set())
        this.#dialog.addToBody(this.#search_block, this.#main_block)

        this.#search_input.addInputListener((event) => {
            event.preventDefault()
            let children = this.#main_block.set().childNodes
            if (children.length > 1) {
                for (let node of children) {
                    let text1 = node.childNodes[0].textContent.toLowerCase()
                    let text2 = event.target.value.toLowerCase()
                    if (text1.includes(text2)) {
                        node.style.display = 'flex'
                    } else {
                        node.style.display = 'none'
                    }
                }
            } else {
                for (let node of children[0].childNodes) {
                    let text1 = node.childNodes[1].textContent.toLowerCase()
                    let text2 = event.target.value.toLowerCase()
                    if (text1.includes(text2)) {
                        node.style.display = 'flex'
                    } else {
                        node.style.display = 'none'
                    }
                }
            }
        })
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
        this.#search_input.setValue("")
        this.#dialog.open()
    }
    close() {
        this.#search_input.setValue("")
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
        tag: "cust_elem", id: "test_main_block", className: "test_main_block", pathToCSS: path_css
    })
    #title = new CustomElement({
        tag: "cust_elem", id: "test_title", className: "test_title", pathToCSS: path_css
    })
    //
    #controls = new CustomElement({
        tag: "cust_elem", id: "test_controls_block", className: "test_controls_block", pathToCSS: path_css
    })
    #download = new CustomElement({
        tag: "cust_elem", id: "test_download", className: "test_controls_button", pathToCSS: path_css
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
    #dialog = undefined
    #title = new CustomElement({
        tag: "cust_elem", id: "test_dialog_pl_list_title", pathToCSS: path_css
    })
    #button_close = new CustomElement({
        tag: "cust_elem", id: "test_close_button_one", pathToCSS: path_css
    })
    #main_block = new CustomElement({
        tag: "cust_elem", id: "test_track_list_main_block", className: "test_track_list_main_block", pathToCSS: path_css
    })
    #search_block = new CustomElement({
        tag: "cust_elem", id: "test_track_list_main_block2", className: "test_track_list_main_block2", pathToCSS: path_css
    })
    #search_input = new TextInput({
        transparentBack: true,
        width: Styles.SIZE.WEBKIT_FILL,
        placeholder: "Поиск"
    })
    #search_button = new Button({
        //reverse: Boolean(),
        title: "Поиск",
        icon: undefined,
        transparentBack: false
    })
    constructor(width = "max-content", height = "max-content", title = "Поиск") {
        this.#dialog = new Dialog({ closeOutSideClick: false, width: width, height: height, transparentBack: true })
        this.#title.innerText(title)
        this.#button_close.innerHTML(new Icon(Icons.NAVIGATION.CLOSE, "18px").getHTML())
        this.#button_close.addEventListener("click", () => this.#dialog.close())
        this.#dialog.addToHeader(this.#title, this.#button_close)
        this.#search_block.set().appendChild(this.#search_input.set())
        this.#search_block.set().appendChild(this.#search_button.set())
        this.#dialog.addToBody(this.#search_block, this.#main_block)

        this.#search_button.addClickListener(async () => {
            await this.#renderSearchResults()
        })
    }
    async #renderSearchResults() {
        global.playlist = []
        let spinner_big = new Spinner(Spinner.SIZE.BIG, 'auto');
        this.addToMainBlock(spinner_big)
        this.#search_button.setDisabled(true)
        for (let i = 0; i <= 10; i++) {
            let res = await new YaApi().searchTracks(global.access_token, global.user_id, this.#search_input.getValue(), i, 5000)
            try {
                if (res.tracks.results.length === 0) {
                    break;
                }
                console.log(res)
                let res_json = {
                    q: this.#search_input.getValue(),
                    results: res.tracks.results
                }
                this.#test(res_json)
            } catch (e) {
                break;
            }
        }
        global.player.setPlayList([...new Set(global.playlist)])
        this.addToMainBlock(global.player.getPlaylist().getPlaylist())
        this.#search_button.setDisabled(false)
    }
    #test(res_json) {
        for (let s_track of res_json.results) {
            let artist_name = []
            for (let artist of s_track.artists) artist_name.push(artist.name)

            let cover = undefined
            try {
                cover = `https://${s_track.coverUri.replaceAll("%%", "800x800")}`
            } catch (e) {
                cover = ""
            }

            let test_track = {
                track_id: s_track.id,
                title: s_track.title,
                artist: artist_name.join(", ").toString(),
                album: cover,
                mimetype: "audio/mpeg",
                path: ""
            }

            let val = this.#search_input.getValue().toLowerCase()

            if (artist_name.join(", ").toString().toLowerCase().includes(val)) {
                global.playlist.push(test_track)
            }

            if (s_track.title.toLowerCase().includes(val)) {
                global.playlist.push(test_track)
            }
        }
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
        //this.#search_input.setValue("")
        this.#dialog.open()
    }
    close() {
        //this.#search_input.setValue("")
        this.#dialog.close()
    }
    clear() {
        this.#main_block.set().innerHTML = ''
    }
    addToMainBlock(...components) {
        this.clear()
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

exports.PlayerDialogSearch = PlayerDialogSearch