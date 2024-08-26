const {Page, YaAudio, Styles, path, App, ipcRenderer, Icons, Notification, DownloadProgressNotification, YaApi} = require('chuijs');
const {PlaylistDB, UserDB} = require("../../sqlite/sqlite");
const {PlayerDialog, PlayerDialogButton} = require("./elements/player_elements");
const DownloadManager = require("@electron/remote").require("electron-download-manager");
const fs = require("fs");
const udb = new UserDB(App.userDataPath())
const pdb = new PlaylistDB(App.userDataPath())
const api = new YaApi()

class Player extends Page {
    #audio = new YaAudio({
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        coverPath: `file://${require('path').join(__dirname, 'cover.png')}`
    })
    #dialog = undefined
    //
    #playlist = []
    playlist_list = new PlayerDialog()
    track_list = new PlayerDialog("60%", "90%", "Очередь")
    constructor(dialog) {
        super();
        this.#dialog = dialog
        this.setTitle('Media Maze');
        this.setFullHeight();
        this.setMain(false);
        this.#audio.openFolder(path.join(App.userDataPath(), "downloads"))
        this.add(this.#audio, this.#dialog)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
        })

        ipcRenderer.on("GENPLAYLIST", () => {
            this.#generatePlayList()
            this.#dialog.close()
        })

        this.#audio.addFunctionButton(
            YaAudio.FUNCTION_ACTIVE_BUTTON({
                value: false,
                icon_on: Icons.AUDIO_VIDEO.SHUFFLE_ON,
                icon_off: Icons.AUDIO_VIDEO.SHUFFLE,
                activateEvent: (evt) => {
                    if (evt.target.checked) {
                        this.#audio.setPlayList(shuffle(this.#playlist.slice()))
                        new Notification({
                            title: "Перемешать", text: evt.target.checked, showTime: 1000
                        }).show()
                    } else {
                        this.#audio.setPlayList(this.#playlist)
                        new Notification({
                            title: "Перемешать", text: evt.target.checked, showTime: 1000
                        }).show()
                    }
                },
            }),
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_ADD,
                clickEvent: () => this.playlist_list.open()
            }),
            YaAudio.FUNCTION_BUTTON({
                icon: Icons.AUDIO_VIDEO.PLAYLIST_PLAY,
                clickEvent: () => this.track_list.open()
            })
        )

        this.#generatePlayList()
        this.add(this.playlist_list, this.track_list)
    }

    #generatePlayList() {
        this.playlist_list.clear()
        this.track_list.clear()
        pdb.getPlaylists().then(async playlists => {
            for (let table of playlists) {
                const button = new PlayerDialogButton(table, async (evt) => {
                    if (evt.target.id === "test_download") {
                        pdb.getPlaylist(table.pl_kind).then(async dpl => {
                            const notif = new DownloadProgressNotification({title: `Загрузка ${table.pl_title}`})
                            let links = []
                            for (let dtr of dpl) {
                                if (dtr.path === "") {
                                    links.push({
                                        table: table.pl_kind,
                                        pl_title: table.pl_title,
                                        track_id: dtr.track_id,
                                        savePath: table.pl_kind,
                                        filename: `${dtr.artist.replaceAll(" ", "_")}_-_${dtr.title.replaceAll(" ", "_")}.mp3`,
                                        filename_old: `${dtr.artist} - ${dtr.title}.mp3`
                                    })
                                }
                            }
                            if (links.length !== 0) {
                                notif.show()
                                for (let track of links) {
                                    notif.update(`Загрузка ${table.pl_title}`, track.filename_old, links.indexOf(track) + 1, links.length)
                                    let info = await this.save(track)
                                    await pdb.updateTrack(track.table, track.track_id, info)
                                }
                                notif.done()
                                //await this.#generatePlayList()
                            }
                        })
                    } else {
                        //
                        this.#playlist = []
                        let local_tracks = await pdb.getPlaylist(table.pl_kind)
                        //
                        api.getTracks(global.access_token, global.user_id).then(tracks => {
                            for (let playlist of tracks) {
                                if (playlist.playlist_name === table.pl_kind) {
                                    for (let track of playlist.tracks) {
                                        let loc_track = local_tracks.filter(ltrack => {
                                            return String(track.track_id) === String(ltrack.track_id)
                                        })[0]
                                        if (loc_track !== undefined) {
                                            let test_track = {
                                                track_id: loc_track.track_id,
                                                title: loc_track.title,
                                                artist: loc_track.artist,
                                                album: `https://${loc_track.album.replaceAll("%%", "800x800")}`,
                                                mimetype: loc_track.mimetype,
                                                path: loc_track.path,
                                                remove: () => {
                                                    this.remove(loc_track, table)
                                                },
                                                download: async () => {
                                                    let links = []
                                                    if (loc_track.path === "") {
                                                        links.push({
                                                            table: table.pl_kind,
                                                            pl_title: table.pl_title,
                                                            track_id: loc_track.track_id,
                                                            savePath: table.pl_kind,
                                                            filename: `${loc_track.artist.replaceAll(/\/|\s/gm, '_')}_-_${loc_track.title.replaceAll(/\/|\s/gm, "_")}.mp3`,
                                                            filename_old: `${loc_track.artist} - ${loc_track.title}.mp3`
                                                        })
                                                    }
                                                    if (links.length !== 0) {
                                                        for (let track of links) {
                                                            let info = await this.saveOne(track)
                                                            await pdb.updateTrack(track.table, track.track_id, info)
                                                        }
                                                    }
                                                }
                                            }
                                            this.#playlist.push(test_track)
                                        }
                                    }
                                }
                            }
                        }).finally(() => {
                            this.#audio.setPlayList(this.#playlist)
                            this.track_list.addToMainBlock(this.#audio.getPlaylist().getPlaylist())
                            this.track_list.setTitle(table.pl_title)
                            this.track_list.open()

                        })
                        this.playlist_list.close()
                    }
                })
                pdb.getPlaylist(table.pl_kind).then(async dpl => {
                    for (let dtr of dpl) {
                        if (dtr.path === "") {
                            button.addDownloadButton()
                            break
                        }
                    }
                    this.playlist_list.addToMainBlock(button.set())
                })

            }
        })
    }

    remove(track, table) {
        console.log(table)
        udb.selectUserData().then(async (udt) => {
            await api.removeTrack(udt.access_token, udt.user_id, Number(table.pl_kind.replace("pl_", "")), track.track_id)

        })
        pdb.deleteRow(table.pl_kind, track.track_id).then(() => {
            document.getElementsByName(track.track_id)[0].remove()
        })
    }

    save(track) {
        return new Promise(async resolve => {
            udb.selectUserData().then(async (udt) => {
                let link = await api.getLink(track.track_id, udt.access_token, udt.user_id)
                DownloadManager.download({
                    url: link,
                    path: track.savePath,
                    onProgress: (progress, item) => {
                        console.log(progress, item)
                    }
                }, (error, info) => {
                    console.log(info)
                    if (error) { console.error(error); return; }
                    let dl_path = require("path").join(App.userDataPath(), 'downloads')
                    let new_name = path.join(dl_path, track.savePath, track.filename)
                    fs.rename(info.filePath, new_name, (err) => {
                        if ( err ) console.error('ERROR: ' + err);
                        resolve(new_name)
                    });
                });
            })
        })
    }

    saveOne(track) {
        const notif = new DownloadProgressNotification({title: "Загрузка трека"})
        return new Promise(async resolve => {
            udb.selectUserData().then(async (udt) => {
                notif.show()
                let link = await api.getLink(track.track_id, udt.access_token, udt.user_id)
                DownloadManager.download({
                    url: link,
                    path: track.savePath,
                    onProgress: (progress, item) => {
                        notif.update("Загрузка трека", track.filename_old, Number(progress.progress).toFixed(), 100)
                    }
                }, (error, info) => {
                    console.log(info)
                    if (error) { console.error(error); return; }
                    let dl_path = require("path").join(App.userDataPath(), 'downloads')
                    let new_name = path.join(dl_path, track.savePath, track.filename)
                    fs.rename(info.filePath, new_name, (err) => {
                        if ( err ) console.error('ERROR: ' + err);
                        notif.done()
                        resolve(new_name)
                    });
                });
            })
        })
    }
}

exports.Player = Player

const shuffle = (array) => {
    let m = array.length, t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
}
