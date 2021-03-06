const { Tray, Menu, dialog } = require('electron');
const { resolve, basename } = require('path');
const child = require('child_process').spawn;
const executables = { code: 'code', intellij: `"C:\\Program Files\\JetBrains\\IntelliJ IDEA 2018.2.5\\bin\\idea.bat"` }
const { platform } = require('os'), osType = platform();
const {handleClick} = require('../actions/handles');

const Store = require('electron-store');


module.exports = function tray(win) {
  const schema = {
    projects: {
      type: 'string',
    },
  };

  const store = new Store({ schema });


  let quit = false;



  const handleQuit = () => {
    quit = true;
    win.close();
  };

  const handleSobre = () => {
    if (win.isVisible()) {
      win.hide()
    } else {
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


    buildMenu();
  }

  const handleAddCode = () => {
    const result = dialog.showOpenDialog({ properties: ['openDirectory'] });

    if (!result) return;

    const [path] = result;
    const name = basename(path);

    buildMenu({
      path,
      name,
      type: 'code'
    });
  }

  const handleOpenItem = item => {
    const executablePath = executables[item.type];
    const parameters = [item.path];

    let options = {
      shell: true,
      cwd: process.cwd(),
      env: {
        PATH: process.env.PATH,
      },
      stdio: 'inherit',
    };

    if (osType == 'win32') {
      options.shell = true;
     }
    child(executablePath, parameters, options, function (err, data) {
      console.log(err)
      console.log(data.toString());
    });

  }

  const buildMenu = (item) => {
    const storedProjects = store.get('projects');
    const projects = storedProjects ? JSON.parse(storedProjects) : [];

    if (item) {
      projects.push(item);
      store.set('projects', JSON.stringify([...projects]));
    }

    const items = projects.map(item => {
      return {
        label: item.name,
        type: 'normal',
        click: () => { handleOpenItem(item) }
      }
    });

    const contextMenu = Menu.buildFromTemplate([
      ...items,
      { type: 'separator' },
      { label: 'Configurações', type: 'normal', click: () => {handleClick(win)} },
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
  }

  let tray = null;
  tray = new Tray(resolve(__dirname, '..', 'assets', 'iconTemplate.png'));


  const handleClean = () => {
    store.set('projects', JSON.stringify([]));
    buildMenu();
  }

  buildMenu();

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
      handleClick(win);
    }
  })
  return tray;
}






