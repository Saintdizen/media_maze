//Mu.blocks.di.repo.player.play();
function render() {
    if (document.getElementById("TESTTT") === null) {
        let div1 = document.createElement("div");
        div1.id = "TESTTT"
        let div2 = document.createElement("div");
        let span1 = document.createElement("span");
        div1.className = "hq";
        div2.className = "hq__icon player-controls__btn deco-player-controls__button"
        span1.className = "d-icon deco-icon d-icon_share"
        span1.style.rotate = "180deg";
        span1.id = "test111"
        div1.addEventListener("click", async () => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", Mu.blocks.di.repo.player.getTrack()._$f9);
            xhr.responseType = "arraybuffer";
            xhr.onloadend = function () {
                if (this.status === 200) {
                    let artist = Mu.blocks.di.repo.player.getTrack().artists[0].name;
                    let title = Mu.blocks.di.repo.player.getTrack().title;
                    let link = document.createElement("a");
                    let blob = new Blob([xhr.response], {type: "audio/mp3"});
                    link.href = URL.createObjectURL(blob);
                    link.download = `${artist} - ${title}.mp3`;
                    link.target = '_blank'
                    document.body.appendChild(link)
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(link.href);
                }
            };
            xhr.send();
            window.require("electron").ipcRenderer.send("TEST", "2")
        });
        div1.appendChild(div2)
        div2.appendChild(span1)
        let test2 = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.bar > div.bar__content > div.player-controls.deco-player-controls > div.player-controls__seq-controls")
        test2.appendChild(div1)
    }
}

setTimeout(() => render(), 250)

