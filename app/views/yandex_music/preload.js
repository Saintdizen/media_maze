//Mu.blocks.di.repo.player.play();
document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.head-container > div > div > div.head-kids__left").remove();
document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.centerblock-wrapper.deco-pane.theme.theme_dark.black > div.footer").remove();

let span1 = document.createElement("span");
span1.className = "player-controls__btn-cast";
let span2 = document.createElement("span");
span2.className = "d-icon deco-icon d-icon_share"
span2.style.rotate = "180deg"
//
span1.appendChild(span2)

span1.addEventListener("click", () => {
    Mu.blocks.di.repo.player.play();
})

let test2 = document.querySelector("body > div.page-root.page-root_no-player.deco-pane-back.theme.theme_dark.black > div.bar > div.bar__content > div.player-controls.deco-player-controls > div.player-controls__track-container > div > div");
test2.appendChild(span1)
