//Mu.blocks.di.repo.player.play();
//document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.head-container > div > div > div.head-kids__left").remove();
//document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.centerblock-wrapper.deco-pane.theme.theme_dark.black > div.footer").remove();
class Test {
    #div1 = document.createElement("div");
    #div2 = document.createElement("div");
    #span1 = document.createElement("span")
    constructor() {
        this.#div1.className = "hq";
        this.#div2.className = "hq__icon player-controls__btn deco-player-controls__button"
        this.#span1.className = "d-icon deco-icon d-icon_share"
        this.#span1.style.rotate = "180deg"
        this.#div1.addEventListener("click", async (evt) => {
            let test_link = document.createElement("a");
            let test = await fetch(Mu.blocks.di.repo.player.getTrack()._$f9);
            const uri = window.URL.createObjectURL(await test.blob());
            let artist = Mu.blocks.di.repo.player.getTrack().artists[0].name;
            let title = Mu.blocks.di.repo.player.getTrack().title;
            test_link.href = uri
            test_link.download = `${artist} - ${title}.mp3`;
            test_link.target = '_blank'
            //
            this.#div1.appendChild(test_link)
            test_link.click()
            test_link.remove()
            evt.preventDefault()
        })
    }
    render() {
        this.#div1.appendChild(this.#div2)
        this.#div2.appendChild(this.#span1)
        let test2 = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.bar > div.bar__content > div.player-controls.deco-player-controls > div.player-controls__seq-controls")
        test2.appendChild(this.#div1)
    }
}



setTimeout(() => {
    new Test().render();
}, 250)