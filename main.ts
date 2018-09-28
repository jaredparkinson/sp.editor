import {
  app,
  BrowserWindow,
  screen,
  ipcMain,
  webContents,
  BrowserView
} from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow;
let serve;
let content: webContents;
let view: BrowserView;

const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');
function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height
  });
  content = win.webContents;
  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');

    view = new BrowserView({
      webPreferences: {
        nodeIntegration: true
      }
    });
    win.setBrowserView(view);
    view.setBounds({ x: 200, y: 48, width: 300, height: 48 });

    view.webContents.loadURL(
      url.format({
        pathname: path.join('find-in-page.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    // view.webContents.loadFile('dist/find-in-page.html');
    // try {
    //   console.log(path.join('find-in-page.html'));

    //   console.log('no errors');
    // } catch (error) {

    // }
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      })
    );

    view = new BrowserView({
      webPreferences: {
        nodeIntegration: true
      }
    });
    win.setBrowserView(view);
    view.setBounds({ x: 200, y: 48, width: 300, height: 48 });
    view.webContents.loadURL(
      url.format({
        pathname: path.join(__dirname, '/find-in-page.html'),
        protocol: 'file:',
        slashes: true
      })
    );
    // use this to open dev tools manualy to debug
    // win.webContents.openDevTools();
  }

  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

  ipcMain.on('search-clear', (event, arg) => {
    content.stopFindInPage('clearSelection');
    event.returnValue = 'pong';
  });
  ipcMain.on('search-forward', (event, arg) => {
    console.log(content.findInPage(arg, { wordStart: true })); // prints "ping"
    event.returnValue = 'pong';
  });
  ipcMain.on('search-back', (event, arg) => {
    console.log(content.findInPage(arg, { forward: false })); // prints "ping"
    event.returnValue = 'pong';
  });
  ipcMain.on('synchronous-message', (event, arg) => {
    console.log(content.findInPage(arg)); // prints "ping"
    event.returnValue = 'pong';
  });
} catch (e) {
  // Catch Error
  // throw e;
}
