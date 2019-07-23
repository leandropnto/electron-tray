const { app, Tray, Menu, shell, dialog, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const Store = require('electron-store');

const schema = {
  projects: {
    type: 'string',
  },
};

const store = new Store();

console.log('Iniciado');

const storedProjects = store.get('projects');
const projects = storedProjects ? JSON.parse(storedProjects) : [];

console.log(projects);

//acho que o dock só funciona no mac
// tsoenho sóue ajustar a ide para um aspecto melhor
app.dock && app.dock.hide();

app.on('ready', () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    title: 'Electron Tray',
    minimizable: false,
    fullscreenable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile('pages/settings.html');

  const tray = require('./components/tray');
  const appTray = tray(win, store, projects, store);

});
