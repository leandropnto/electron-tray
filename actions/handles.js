const { resolve } = require('path');

const handleClick = (win) => {

  console.log(win);

  if (win.isVisible()) {
    win.hide()
  } else {

    win.loadFile(resolve(__dirname, '..', 'pages', 'config', 'settings.html'));
    win.setMenu(null);
    win.webContents.on('did-finish-load', () => {
      win.show()
    })
  }

}

module.exports = {
  handleClick
}
