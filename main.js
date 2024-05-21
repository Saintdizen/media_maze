const {Main, MenuItem, path, App, ipcMain, BrowserWindow, YaApi} = require('chuijs');
const json = require("./package.json");
const DownloadManager = require("electron-download-manager");
const dl_path = require("path").join(App.userDataPath(), 'downloads')
let fs = require('fs');
DownloadManager.register({downloadFolder: dl_path});
//
const {PlaylistDB, UserDB} = require("./app/sqlite/sqlite");
const udb = new UserDB(App.userDataPath())
const pdb = new PlaylistDB(App.userDataPath())
const api = new YaApi()
//
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

pdb.getPlaylists().then(pls => {
    let window = BrowserWindow.getAllWindows()[0].webContents;
    for (let pl of pls) {
        ipcMain.on("download_"+pl.pl_kind, async (event, info) => {
            let tracks = info.data;
            window.send("DOWNLOAD_START_"+pl.pl_kind)
            for (let track of tracks) {
                window.send("DOWNLOAD_TRACK_START_"+pl.pl_kind, {
                    title: `Загрузка ${track.pl_title}`,
                    track: track.filename_old,
                    number: tracks.indexOf(track) + 1,
                    max: tracks.length
                })
                let info = await save(track)
                await pdb.updateTrack(track.table, track.track_id, info)
            }
            window.send("DOWNLOAD_DONE_"+pl.pl_kind)
        });
    }
})

function save(track) {
    return new Promise(async resolve => {
        udb.selectUserData().then(async (udt) => {
            let link = await api.getLink(track.track_id, udt.access_token, udt.user_id)
            DownloadManager.download({
                url: link, path: track.savePath,
            }, (error, info) => {
                if (error) { console.error(error); return; }
                let new_name = path.join(dl_path, track.savePath, track.filename)
                fs.rename(info.filePath, new_name, (err) => {
                    if ( err ) console.error('ERROR: ' + err);
                    resolve(new_name)
                });
            });
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