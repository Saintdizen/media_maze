//Mu.blocks.di.repo.player.play();
class Test {
    #div1 = document.createElement("div");
    #div2 = document.createElement("div");
    #span1 = document.createElement("span");
    constructor() {
        this.#div1.className = "hq";
        this.#div2.className = "hq__icon player-controls__btn deco-player-controls__button"
        this.#span1.className = "d-icon deco-icon d-icon_share"
        this.#span1.style.rotate = "180deg";
        this.#span1.id = "test111"
        this.#div1.addEventListener("click", async (evt) => {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", Mu.blocks.di.repo.player.getTrack()._$f9);
            xhr.responseType = "arraybuffer";
            xhr.onloadend = function () {
                if (this.status === 200) {
                    let artist = Mu.blocks.di.repo.player.getTrack().artists[0].name;
                    let title = Mu.blocks.di.repo.player.getTrack().title;
                    let link = document.createElement("a");
                    let blob = new Blob([xhr.response], {type: "application/pdf"});
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
        })
    }
    render() {
        this.#div1.appendChild(this.#div2)
        this.#div2.appendChild(this.#span1)
        let test2 = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.bar > div.bar__content > div.player-controls.deco-player-controls > div.player-controls__seq-controls")
        test2.appendChild(this.#div1)
    }
}
setTimeout(() => new Test().render(), 250)