const {Page, YaAudio, Styles, Button, App, YaApi} = require('chuijs');
const {UserDB} = require("../../sqlite/sqlite");

class Stations extends Page {
    #udb = new UserDB(App.userDataPath())
    #audio = new YaAudio({
        autoplay: false,
        playlist: false,
        width: Styles.SIZE.WEBKIT_FILL,
        height: Styles.SIZE.WEBKIT_FILL,
        //pin: Audio.PIN.BOTTOM
    })
    constructor() {
        super();
        this.setTitle('Media Maze');
        this.setFullHeight();
        this.setMain(false);

        this.add(this.#audio)
        this.addRouteEvent(this, () => {
            this.#audio.restoreFX();
        })

        // ПО ХАРАКТЕРУ
        // Любимое  Незнакомое  Популярное
        // ПО ЯЗЫКУ
        // Русский  Иностранный  Без слов
        // ПОД НАСТРОЕНИЕ
        // Бодрое  Весёлое  Спокойное  Грустное

        let b1 = new Button({
            title: "getAllStationsList",
            clickEvent: () => {
                this.#udb.selectUserData().then(async data => {
                    let stationsAll = await new YaApi().getAllStationsList(data.access_token, data.user_id)
                    console.log(stationsAll)

                    // let stations1 = stationsAll.filter(station => this.filterByDiversity(station))
                    // console.log(stations1)
                    //
                    // let stations2 = stationsAll.filter(station => this.filterByLanguage(station))
                    // console.log(stations2)

                    let stations3 = stationsAll.filter(station => this.filterByMoodEnergy(station))
                    console.log(stations3)

                    let sid = `${stations3[0].station.id.type}:${stations3[0].station.id.tag}`

                    let tracks = await new YaApi().getStationTracks(data.access_token, data.user_id, {
                        stationId: sid
                    })

                    console.log(tracks)

                })
            }
        })

        this.add(b1)
    }

    filterByDiversity(station) {
        return station.settings2.diversity === Stations.FILTERS.diversity.default.value
    }

    filterByLanguage(station) {
        return station.settings2.language === Stations.FILTERS.language.without_words.value
    }

    filterByMoodEnergy(station) {
        return station.settings2.moodEnergy === Stations.FILTERS.moodEnergy.fun.value
    }

    static FILTERS = {
        diversity: {
            favorite: {value: 'favorite', name: 'Любимое' },
            discover: {value: 'discover', name: 'Незнакомое' },
            popular: {value: 'popular', name: 'Популярное' },
            default: {value: 'default', name: 'Любое' }
        },
        language: {
            russian: {value: 'russian', name: 'Русский' },
            not_russian: {value: 'not-russian', name: 'Иностранный' },
            any: {value: 'any', name: 'Любой' },
            without_words: {value: 'without-words', name: 'Без слов' }
        },
        moodEnergy: {
            active: {value: 'active', name: 'Бодрое' },
            fun: {value: 'fun', name: 'Весёлое' },
            calm: {value: 'calm', name: 'Спокойное' },
            sad: {value: 'sad', name: 'Грустное' },
            all: {value: 'all', name: 'Любое' }
        }
    }
}

exports.Feed = Stations