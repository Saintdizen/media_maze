const {Main, MenuItem, path, App, ipcMain, BrowserWindow, ipcRenderer, YaApi} = require('chuijs');
let json = require("./package.json");
require('electron-file-downloader')();
const {download} = require("electron-file-downloader");
const {PlaylistDB, UserDB} = require("./app/sqlite/sqlite");
const main = new Main({
    name: `${json.productName} (${json.version})`,
    width: 960,
    height: 540,
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

ipcMain.on("download", async (event, info) => {
    for (let track of info.data) {
        let info = await save(track)
        let pdb = new PlaylistDB(App.userDataPath())
        await pdb.updateRow(track.table, track.track_id, info)
        console.log(info)
    }
});

function save(track) {
    return new Promise(async resolve => {
        let udb = new UserDB(App.userDataPath())
        let api = new YaApi()
        udb.selectUserData().then(async (udt) => {
            let link = await api.getLink(track.track_id, udt.access_token, udt.user_id)
            await download(BrowserWindow.getAllWindows()[0], link, {
                directory: track.savePath,
                filename: track.filename,
                // onStarted: (event) => {
                //     event.on('done', (event, state) => {
                //         resolve({
                //             state: state,
                //             path: event.getSavePath()
                //         })
                //     })
                // },
                // onProgress: (event) => {
                //     console.log(event.progress, event.speed, event.remaining, event.total, event.downloaded, event.status)
                // }
            }).then(dl => resolve(dl.DownloadItem.getSavePath()))
        })
    })
}

// App.get().on('session-created', (session) => {
//     session.on('will-download', (e, item, contents) => {
//         console.log(item.getFilename())
//         main.sendDownload("Загрузка трека", item.getFilename())
//         item.setSavePath(path.join(path.join(App.userDataPath(), "downloads"), item.getFilename()))
//         item.on('updated', (event, state) => {
//             if (state === 'interrupted') {
//                 console.log('Download is interrupted but can be resumed')
//             } else if (state === 'progressing') {
//                 if (item.isPaused()) {
//                     console.log('Download is paused')
//                 } else {
//                     //main.sendDownloadUpdate("Загрузка", `${item.getFilename()} ${formatBytes(item.getReceivedBytes())} - ${formatBytes(item.getTotalBytes())}`)
//                     console.log(`Received bytes: ${formatBytes(item.getReceivedBytes())} - ${formatBytes(item.getTotalBytes())}`)
//                 }
//             }
//         })
//         item.on('done', (event, state) => {
//             if (state === 'completed') {
//                 console.log('Download successfully')
//                 main.sendDownloadComplete()
//             } else {
//                 console.log(`Download failed: ${state}`)
//                 main.sendDownloadError()
//             }
//         })
//     });
// });

main.enableAutoUpdateApp(2000)