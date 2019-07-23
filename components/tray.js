const { Tray, Menu } = require('electron');
const { resolve, basename } = require('path');


module.exports = function tray(win, app) {

  let quit = false;

  const handleClick = () => {
    win.loadFile(resolve(__dirname, '..', 'pages', 'config', 'settings.html'));
    win.setMenu(null);
    win.isVisible() ? win.hide() : win.show();
  }

  const handleQuit = () => {
    quit = true;
    win.close();
  };

  let tray = null;
  tray = new Tray(resolve(__dirname, '..', 'assets', 'iconTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Configurações', type: 'normal', click: handleClick },
    { type: 'separator' },
    { label: 'Fechar', type: 'normal', click: handleQuit }
  ]);
  tray.setToolTip('Electron App');
  tray.setContextMenu(contextMenu);

  // tray.on('click', () => {
  //   win.isVisible() ? win.hide() : win.show()
  // })
  win.on('show', () => {
    tray.setHighlightMode('always')
  })
  win.on('hide', () => {
    tray.setHighlightMode('never')
  })

  win.on('close', (e) => {
    if (quit) {
      win = null;
    } else {
      e.preventDefault();
      handleClick();
    }
  })
  return tray;
}






