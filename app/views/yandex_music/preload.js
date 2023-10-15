//Mu.blocks.di.repo.player.play();
class Test {
    #span1 = document.createElement("span");
    #span2 = document.createElement("a");
    constructor() {
        document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.head-container > div > div > div.head-kids__left").remove();
        document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.centerblock-wrapper.deco-pane.theme.theme_dark.black > div.footer").remove();
        //
        this.#span1.className = "player-controls__btn-cast";
        this.#span2.className = "d-icon deco-icon d-icon_share"
        this.#span2.style.rotate = "180deg"
        this.#span1.appendChild(this.#span2)
        this.#span1.addEventListener("click", async () => {
            //let link = JSON.parse(Mu.blocks.di.repo.player.getTrack()._$f9);
            //this.#span2.setAttribute("href", link)
            //this.#span2.setAttribute("download", Mu.blocks.di.repo.player.getTrack()._$f9)
            let fileHandle = await showSaveFilePicker({
                types: [{
                    description: 'file',
                }],
            });
            const writableStream = await fileHandle.createWritable()
            await writableStream.write(Mu.blocks.di.repo.player.getTrack()._$f9)
            // данный метод не упоминается в черновике спецификации,
            // хотя там говорится о необходимости закрытия потока
            // для успешной записи файла
            await writableStream.close()
        })
        let test2 = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.bar > div.bar__content > div.player-controls.deco-player-controls > div.player-controls__track-container > div > div");
        test2.appendChild(this.#span1)


    }
}



setTimeout(() => {
    new Test()
}, 250)