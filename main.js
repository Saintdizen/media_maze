const {Main, MenuItem} = require('chuijs');
let json = require("./package.json");
const main = new Main({
    name: `${json.productName} (${json.version})`,
    //width: '25%',
    //height: '25%',
    icon: `${__dirname}/resources/icons/app/icon.png`,
    render: `${__dirname}/app/app.js`,
    devTools: false
});

main.start({
    hideOnClose: true,
    tray: [
        new MenuItem().separator(),
        new MenuItem().help(`Версия: ${json.version}`),
        new MenuItem().separator(),
        new MenuItem().button('Показать | Скрыть', () => main.hideAndShow()),
        new MenuItem().button('Консоль', () => main.toggleDevTools()),
        new MenuItem().quit('Выход')
    ]
});

main.enableAutoUpdateApp(2000, require("./update.json"))