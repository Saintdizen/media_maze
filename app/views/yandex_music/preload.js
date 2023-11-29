//Mu.blocks.di.repo.player.play();
function render() {
    if (document.getElementById("dl_button") === null) {
        // dl_main
        let dl_main = document.createElement("div");
        dl_main.className = "hq";
        // ===
        // dl_icon
        let dl_icon = document.createElement("span");
        dl_icon.className = "d-icon deco-icon d-icon_share"
        dl_icon.style.rotate = "180deg";
        // ===
        // dl_button
        let dl_button = document.createElement("button");
        dl_button.id = "dl_button"
        dl_button.style.border = "none"
        dl_button.style.background = "transparent"
        dl_button.style.height = "-webkit-fill-available"
        dl_button.className = "hq__icon player-controls__btn deco-player-controls__button"
        dl_button.addEventListener("click", async () => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", Mu.blocks.di.repo.player.getTrack()._$f9);
            xhr.responseType = "arraybuffer";
            xhr.onloadend = function () {
                if (this.status === 200) {
                    let artist = getArtists(externalAPI.getCurrentTrack().artists)
                    let title = externalAPI.getCurrentTrack().title;
                    let blob = new Blob([xhr.response], {type: "audio/mp3"});
                    createLink(blob, artist, title)
                }
            };
            xhr.send();
        });
        // ===
        dl_main.appendChild(dl_button)
        dl_button.appendChild(dl_icon)
        getControls().appendChild(dl_main)
    }
}

function createLink(blob, artist, title) {
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${artist} - ${title}.mp3`;
    link.target = '_blank'
    document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

function getArtists(massive = []) {
    let artist = ""
    for (let art of massive) {
        if (massive.indexOf(art) === massive.length - 1) {
            artist+=art.title
        } else {
            artist+=art.title + ", "
        }
    }
    return artist;
}

function getControls() {
    let path = '//*[@class="player-controls__seq-controls"]'
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
}

externalAPI.on(externalAPI.EVENT_STATE, () => render())
externalAPI.on(externalAPI.EVENT_TRACK, () => render())

