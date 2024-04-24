const {Main, MenuItem, path, App, formatBytes} = require('chuijs');
let json = require("./package.json");
const {UserDB} = require("./app/sqlite/sqlite");
const main = new Main({
    name: `${json.productName} (${json.version})`,
    width: 600,
    height: 600,
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
        //new MenuItem().separator(),
        //new MenuItem().button('Воспроизведение | Пауза', () => main.getWindow().webContents.send("PLAY_PAUSE")),
        //new MenuItem().button('Следующий трек', () => main.getWindow().webContents.send("NEXT_TRACK")),
        //new MenuItem().button('Предыдущий трек', () => main.getWindow().webContents.send("PREV_TRACK")),
        new MenuItem().separator(),
        new MenuItem().button('Показать | Скрыть', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit('Выход')
    ]
});

App.get().on('session-created', (session) => {
    session.on('will-download', (e, item, contents) => {
        console.log(item.getFilename())
        if (contents.getType() === 'webview') {
            main.sendDownload("Загрузка трека", item.getFilename())
            item.setSavePath(path.join(path.join(App.userDataPath(), "downloads"), item.getFilename()))
            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        console.log('Download is paused')
                    } else {
                        //main.sendDownloadUpdate("Загрузка", `${item.getFilename()} ${formatBytes(item.getReceivedBytes())} - ${formatBytes(item.getTotalBytes())}`)
                        console.log(`Received bytes: ${formatBytes(item.getReceivedBytes())} - ${formatBytes(item.getTotalBytes())}`)
                    }
                }
            })
            item.on('done', (event, state) => {
                if (state === 'completed') {
                    console.log('Download successfully')
                    main.sendDownloadComplete()
                } else {
                    console.log(`Download failed: ${state}`)
                    main.sendDownloadError()
                }
            })
        }
    });
});

main.enableAutoUpdateApp(2000)