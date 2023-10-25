const {Main, MenuItem, path, App} = require('chuijs');
let json = require("./package.json");
const main = new Main({
    name: `${json.productName} (${json.version})`,
    width: 1280,
    height: 720,
    icon: `${__dirname}/resources/icons/app/icon.png`,
    render: `${__dirname}/app/app.js`,
    devTools: false,
    resizable: true,
    paths: {
        downloadPath: path.join(App.userDataPath(), "downloads")
    }
});

main.start({
    hideOnClose: true,
    tray: [
        new MenuItem().separator(),
        new MenuItem().help(`Версия: ${json.version}`),
        new MenuItem().separator(),
        new MenuItem().button('Воспроизведение | Пауза', () => main.getWindow().webContents.send("PLAY_PAUSE")),
        new MenuItem().button('Следующий трек', () => main.getWindow().webContents.send("NEXT_TRACK")),
        new MenuItem().button('Предыдущий трек', () => main.getWindow().webContents.send("PREV_TRACK")),
        new MenuItem().separator(),
        new MenuItem().button('Показать | Скрыть', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit('Выход')
    ]
});

main.enableAutoUpdateApp(2000)