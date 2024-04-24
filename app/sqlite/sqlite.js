const fs = require("fs");
const {Audio} = require("chuijs");
const sqlite3 = require("sqlite3").verbose();


class UserDB {
    #user_db = null
    constructor(path) {
        const filepath = path + `/USER.db`;
        if (fs.existsSync(filepath)) {
            this.#user_db = new sqlite3.Database(filepath);
        } else {
            this.#user_db = new sqlite3.Database(filepath, (error) => {
                if (error) return console.error(error.message);
            });
        }
        console.log(`Connection with SQLite (${filepath}) has been established`);
    }
    createUserTable() {
        this.#user_db.exec(`CREATE TABLE IF NOT EXISTS user (access_token VARCHAR(50) NOT NULL, user_id INTEGER NOT NULL);`);
    }
    addUserData(access_token, user_id) {
        this.#user_db.run(`INSERT INTO user (access_token, user_id) VALUES (?, ?)`,
            [access_token, user_id],
            (error) => {
                if (error) console.error(error.message);
            }
        );
    }
    updateUserData(user_id, access_token) {
        this.#user_db.run(`UPDATE user SET access_token = ? WHERE user_id = ?`,
            [access_token, user_id],
            (error) => {
                if (error) console.error(error.message);
            }
        );
    }
    selectUserData() {
        return new Promise((resolve, reject) => {
            this.#user_db.each(`SELECT * FROM user;`, (error, row) => {
                if (error) reject(error.message);
                resolve(row)
            });
        })
    }
    async deleteUserData(user_id) {
        this.#user_db.run(`DELETE FROM user WHERE user_id = ?`, [user_id],
            (error) => {
            if (error) return console.error(error.message);
        });
    }
}

class PlaylistDB {
    #pl_db = null
    constructor(path) {
        const filepath = path + `/PLAYLISTS.db`;
        if (fs.existsSync(filepath)) {
            this.#pl_db = new sqlite3.Database(filepath);
        } else {
            this.#pl_db = new sqlite3.Database(filepath, (error) => {
                if (error) return console.error(error.message);
            });
        }
        console.log(`Connection with SQLite (${filepath}) has been established`);
    }
    createPlaylistTable(pl_kind) {
        this.#pl_db.exec(`
            CREATE TABLE IF NOT EXISTS pl_${pl_kind} (
                track_id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                album TEXT NOT NULL,
                mimetype TEXT NOT NULL,
                path TEXT NOT NULL,
                offline_path TEXT NOT NULL
            );
        `);
    }
    addTrack(pl_kind, track_id, title, artist, album, mimetype, path) {
        this.#pl_db.run(`INSERT OR IGNORE INTO pl_${pl_kind} (track_id, title, artist, album, mimetype, path, offline_path) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        [track_id, title, artist, album, mimetype, path, ""],
        (error) => {
            if (error) console.error(error.message);
            console.log(`Inserted a row with the ID: ${track_id}`);
        });
    }
    select() {
        return new Promise((resolve, reject) => {
            this.#pl_db.all(`SELECT * FROM pl_1017;`, (error, rows) => {
                if (error) reject(error.message);
                resolve(rows)
            });
        })
    }
    updateRow(id, name) {
        this.#pl_db.run(`UPDATE sharks SET name = ? WHERE id = ?`,
        [name, id],
        (error) => {
            if (error) console.error(error.message);
            console.log(`Row ${id} has been updated`);
        });
    }
    async deleteRow(id) {
        this.#pl_db.run(`DELETE FROM sharks WHERE id = ?`, [id],
        (error) => {
            if (error) return console.error(error.message);
            console.log(`Row with the ID ${id} has been deleted`);
        });
    }
}

exports.UserDB = UserDB
exports.PlaylistDB = PlaylistDB