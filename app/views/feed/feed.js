const {Page, YaAudio, Styles, Button, App, YaApi} = require('chuijs');
const {UserDB} = require("../../sqlite/sqlite");

class Feed extends Page {
    #udb = new UserDB(App.userDataPath())
    #audio = new YaAudio({
        autoplay: false,
        playlist: false,
        width: Styles.SIZE.WEBKIT_FILL,
        // height: Styles.SIZE.WEBKIT_FILL,
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
                    let test = await new YaApi().getAllStationsList(data.access_token, data.user_id)
                    console.log(test)

                    let stations1 = test.filter(station => this.filterByDiversity(station))
                    console.log(stations1)

                    let stations2 = stations1.filter(station => this.filterByLanguage(station))
                    console.log(stations2)

                    let stations3 = stations2.filter(station => this.filterByMoodEnergy(station))
                    console.log(stations3)

                    // for (let station of test) {
                    //     let diversity = station.station.restrictions2.diversity.possibleValues.filter((datas) => datas.value === "favorite")
                    //     if (diversity.length > 0) {
                    //         console.log(station)
                    //     }
                    //
                    //     console.log(diversity)
                    //     // console.log(station.station.restrictions2.diversity.possibleValues)
                    //     // console.log(station.station.restrictions2.language.possibleValues)
                    //     // console.log(station.station.restrictions2.moodEnergy.possibleValues)
                    // }

                    // let test2 = await new YaApi().getRecomendedStationsList(data.access_token, data.user_id)
                    // console.log(test2)
                })
            }
        })

        this.add(b1)
    }

    filterByDiversity(station) {
        let tt = station.station.restrictions2.diversity.possibleValues.filter((datas) => datas.value === "favorite")
        return tt.length
    }

    filterByLanguage(station) {
        let tt = station.station.restrictions2.language.possibleValues.filter((datas) => datas.value === "russian")
        return tt.length
    }

    filterByMoodEnergy(station) {
        let tt = station.station.restrictions2.moodEnergy.possibleValues.filter((datas) => datas.value === "fun")
        return tt.length
    }
}

exports.Feed = Feed