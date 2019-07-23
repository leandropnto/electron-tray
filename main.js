const { app, Tray, Menu, shell, dialog, BrowserWindow } = require('electron');

const Store = require('electron-store');

const schema = {

};

const store = new Store();

console.log('Iniciado');



//acho que o dock só funciona no mac
// tsoenho sóue ajustar a ide para um aspecto melhor
app.dock && app.dock.hide();

app.on('ready', () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: 'Configurações',
    minimizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile('pages/settings.html');

  const tray = require('./components/tray');
  const appTray = tray(win, app);

});
