const {Main, MenuItem} = require('chuijs');
const main = new Main({
    name: "Media Maze",
    //width: '25%',
    //height: '25%',
    icon: `${__dirname}/resources/icons/app/icon.png`,
    render: `${__dirname}/app/app.js`,
    devTools: false
});

main.start({
    tray: [
        new MenuItem().button('Показать | Скрыть', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit('Выход')
    ]
});

main.enableAutoUpdateApp(5000, require('./package.json').version)