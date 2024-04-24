const {YMApi, WrappedYMApi} = require('ym-api-meowed');
const {XMLParser} = require("fast-xml-parser");
const crypto = require('node:crypto');
const {DownloadTrackCodec, DownloadTrackQuality} = require("ym-api-meowed/dist/types");
const {Audio, App} = require("chuijs");
const {UserDB, PlaylistDB} = require("../../sqlite/sqlite");

class YaApi {
    #api = new YMApi();
    #wapi = new WrappedYMApi();
    #udb = new UserDB(App.userDataPath())
    #pdb = new PlaylistDB(App.userDataPath())
    url = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d'
    constructor() {
        this.#udb.createUserTable()
    }

    async auth() {
        try {
            const { BrowserWindow } = require('@electron/remote')
            let win = new BrowserWindow({ width: 800, height: 600 })
            await win.loadURL(this.url)
            win.webContents.on("did-start-navigation", async (event, details) => {
                if (details.includes("access_token")) {
                    const regex = '#access_token=(.*)&token_type';
                    const found = details.match(regex);
                    win.close()
                    await this.#api.init({access_token: found[1], uid: 1});
                    await this.#wapi.init({access_token: found[1], uid: 1});
                    let res = await this.#api.getAccountStatus();
                    this.#udb.addUserData(found[1], res.account.uid)
                }
            })
        } catch (e) {
            console.log(`api error ${e.message}`);
        }

    }

    async getTracks() {
        let data = await this.#udb.selectUserData()
        console.log(data)
        let api = new YMApi();
        let wapi = new WrappedYMApi();
        await api.init({access_token: data.access_token, uid: 1});
        await wapi.init({access_token: data.access_token, uid: 1});
        try {
            let pls = await api.getUserPlaylists(data.user_id)
            for (let playlist of pls) {
                this.#pdb.createPlaylistTable(playlist.kind)
                let pl = await wapi.getPlaylist(playlist.kind, playlist.uid);
                for (let trs of pl.tracks) {
                    console.log(`${pl.tracks.indexOf(trs) + 1} / ${pl.tracks.length}`)
                    try {
                        let tr = await api.getSingleTrack(trs.id);
                        let di = await wapi.getConcreteDownloadInfo(trs.id, DownloadTrackCodec.MP3, DownloadTrackQuality.High)
                        let path = await this.#getLink(di.downloadInfoUrl, trs.id)
                        this.#pdb.addTrack(
                            playlist.kind,
                            trs.id,
                            tr.title,
                            tr.artists[0].name,
                            tr.albums[0].title,
                            Audio.MIMETYPES.MP3,
                            path
                        )
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        } catch (e) {
            console.log(`api error ${e.message}`);
        }
    }

    async #getLink(downloadInfoUrl, track_id = String()) {
        let res = await fetch(downloadInfoUrl)
        let text = await res.text()
        const parsedXml = new XMLParser().parse(text);
        let host = parsedXml['download-info'].host
        let path = parsedXml['download-info'].path
        let ts = parsedXml['download-info'].ts
        let s = parsedXml['download-info'].s
        let sign = crypto.createHash("md5").update("XGRlBW9FXlekgbPrRHuSiA" + path.slice(1) + s).digest("hex");
        return `https://${host}/get-mp3/${sign}/${ts}${path}?track-id=${track_id}&play=false`
    }
}

exports.YaApi = YaApi