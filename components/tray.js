const { Tray, Menu, dialog } = require('electron');
const { resolve, basename } = require('path');
const child = require('child_process').spawn;
const executables = { code: 'code', intellij: `"C:\\Program Files\\JetBrains\\IntelliJ IDEA 2018.2.5\\bin\\idea.bat"` }


module.exports = function tray(win, store, projects, store) {

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

  const handleAddIntellij = () => {
    const result = dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (!result) return;

    const [path] = result;
    const name = basename(path);

    store.set('projects', JSON.stringify([...projects, {
      path,
      name,
      type: 'intellij'
    }]));
  }

  const handleAddCode = () => {
    const result = dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (!result) return;

    const [path] = result;
    const name = basename(path);

    store.set('projects', JSON.stringify([...projects, {
      path,
      name,
      type: 'code'
    }]));
  }

  const handleOpenItem = item => {
    const executablePath = executables[item.type];
    console.log(`${executablePath} ${item.path}`);
    const parameters = [item.path];
    child(executablePath, parameters, {
      shell: true,
      cwd: process.cwd(),
      env: {
        PATH: process.env.PATH,
      },
      stdio: 'inherit',
    }, function (err, data) {
      console.log(err)
      console.log(data.toString());
    });

  }

  let tray = null;
  tray = new Tray(resolve(__dirname, '..', 'assets', 'iconTemplate.png'));
  const items = projects.map(item => {
    return {
      label: item.name,
      type: 'normal',
      click: () => { handleOpenItem(item) }
    }
  });

  const handleClean = () => {
    store.clear();
  }

  const contextMenu = Menu.buildFromTemplate([
    ...items,
    { type: 'separator' },
    { label: 'Configurações', type: 'normal', click: handleClick },
    { label: 'Sobre', type: 'normal', click: handleSobre },
    { type: 'separator' },
    { label: 'Adicionar Projeto Intellij', type: 'normal', click: handleAddIntellij },
    { label: 'Adicionar Projeto Code', type: 'normal', click: handleAddCode },
    { type: 'separator' },
    { label: 'Limpar diretorios', type: 'normal', click: handleClean },
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






