const { app, Tray, Menu, shell, dialog } = require('electron');
const { resolve, basename } = require('path');

console.log('Iniciado');

const handleClick = (item, right, ev) => console.log('clicou')
const handleClose = () => app.quit();
const handleIntellij = () => {
  shell.openExternal('C:\\Program Files\\JetBrains\\IntelliJ IDEA 2018.2.5\\bin\\idea64.exe')
}


const settingsWindow = () => {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

};



//acho que o dock só funciona no mac
// tsoenho sóue ajustar a ide para um aspecto melhor
app.dock && app.dock.hide();

app.on('ready', () => {
  const tray = new Tray(resolve(__dirname, 'assets', 'iconTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'item1', type: 'radio', checked: true },
    {
      label: 'Teste 2', type: 'normal', click() {
        handleClick()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Intellij', type: 'normal', click() {
        handleIntellij();
      }
    },
    {label: 'Configurações', type: 'normal', click(){
      const win = settingsWindow();
      win.loadFile('pages/settings.html');
    }},
    {
      type: 'separator'
    },
    { label: 'Fechar', type: 'normal', click() { handleClose() } }
  ])

  tray.setToolTip('Aplicativo Mega Boga');
  tray.setContextMenu(contextMenu);
});
