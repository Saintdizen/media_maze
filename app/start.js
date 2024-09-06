const {PlaylistDB, UserDB} = require("./sqlite/sqlite");
const {App, YaApi} = require("chuijs");

class DataBases {
    constructor() {}
    static USER_DB = new UserDB(App.userDataPath())
    static PLAYLISTS_DB = new PlaylistDB(App.userDataPath())
}

module.exports = {
    DataBases: DataBases
}

//
globalThis.playlists = []
globalThis.playlist = []
globalThis.player = undefined