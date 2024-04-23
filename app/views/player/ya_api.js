const {YMApi, WrappedYMApi} = require('ym-api-meowed');
const {XMLParser} = require("fast-xml-parser");
const crypto = require('node:crypto');
const {DownloadTrackCodec, DownloadTrackQuality} = require("ym-api-meowed/dist/types");
const {Audio, path} = require("chuijs");

class YaApi {
    #test_token = "y0_AgAAAAAFcl_-AAG8XgAAAAEC1hRAAAA3td4TXRxKIKH1nrNXs-22ogHYJg"
    #api = new YMApi();
    #wapi = new WrappedYMApi();
    url = 'https://oauth.yandex.ru/authorize?response_type=token&client_id=23cabbbdc6cd418abb4b39c32c41195d'
    #access_token = null
    // userdata
    #uid = null
    constructor() {
        //
    }

    async auth() {
        const { BrowserWindow } = require('@electron/remote')
        let win = new BrowserWindow({ width: 800, height: 600 })
        await win.loadURL(this.url)
        win.webContents.on("did-start-navigation", async (event, details) => {
            if (details.includes("access_token")) {
                const regex = '#access_token=(.*)&token_type';
                const found = details.match(regex);
                this.#access_token = found[1]
            }
        })
        await this.#api.init({access_token: this.#test_token, uid: 1});
        await this.#wapi.init({access_token: this.#test_token, uid: 1});
        return this.#access_token;
    }

    async getAccountStatus() {
        let res = null
        try {
            res = await this.#api.getAccountStatus();
        } catch (e) {
            console.log(`api error ${e.message}`);
        }
        this.#uid = res.account.uid
        return res.account.uid
    }

    async getTracks() {
        let playlist_mass = []
        try {
            let pls = await this.#api.getUserPlaylists(this.#uid)
            for (let playlist of pls) {
                let pl = await this.#wapi.getPlaylist(playlist.kind, playlist.uid);
                for (let trs of pl.tracks) {
                    let tr = await this.#api.getSingleTrack(trs.id);
                    console.log(tr)
                    //console.log(tr.albums)
                    //let di1 = await this.#getLink(trs.id)
                    playlist_mass.push({
                        title: tr.title,
                        artist: tr.artists[0].name,
                        album: "",
                        mimetype: Audio.MIMETYPES.MP3,
                        path: await this.#getLink(trs.id)
                    })
                }
                break
            }
        } catch (e) {
            console.log(`api error ${e.message}`);
        }
        return playlist_mass
    }

    async #getLink(track_id = String()) {
        let di = await this.#wapi.getConcreteDownloadInfo(track_id, DownloadTrackCodec.MP3, DownloadTrackQuality.High)
        let res = await fetch(di.downloadInfoUrl)
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