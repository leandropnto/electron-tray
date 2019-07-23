const { Tray, Menu } = require('electron');
const { resolve, basename } = require('path');


module.exports = function tray(win, app) {

  let quit = false;

  const handleClick = () => {
    console.log(win.isVisible());
    if (win.isVisible()) {
      win.hide()
    } else {
      console.log('show window');
      win.loadFile(resolve(__dirname, '..', 'pages', 'config', 'settings.html'));
      win.setMenu(null);
      win.webContents.on('did-finish-load', () => {
        win.show()
      })
    }

  }

  const handleQuit = () => {
    quit = true;
    win.close();
  };

  const handleSobre = () => {
    if (win.isVisible()) {
      win.hide()
    } else {
      console.log('show window');
      win.loadFile(resolve(__dirname, '..', 'pages', 'about', 'index.html'));
      win.setMenu(null);
      win.webContents.on('did-finish-load', () => {
        win.show()
      })
    }
  }

  let tray = null;
  tray = new Tray(resolve(__dirname, '..', 'assets', 'iconTemplate.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Configurações', type: 'normal', click: handleClick },
    { label: 'Sobre', type: 'normal', click: handleSobre },
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






