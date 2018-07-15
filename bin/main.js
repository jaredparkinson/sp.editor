"use strict";
// Modules to control application life and create native browser window
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importDefault(require("electron"));
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
}
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
class Program {
    constructor() {
        // This method will be called when Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        electron_1.default.app.on('ready', () => {
            // Create the browser window.
            mainWindow = new electron_1.default.BrowserWindow({ width: 800, height: 600 });
            // and load the index.html of the app.
            mainWindow.loadFile('index.html');
            // Open the DevTools.
            // mainWindow.webContents.openDevTools()
            // Emitted when the window is closed.
            mainWindow.on('closed', () => {
                // Dereference the window object, usually you would store windows
                // in an array if your app supports multi windows, this is the time
                // when you should delete the corresponding element.
                mainWindow = null;
            });
        });
    }
    main() {
        // Quit when all windows are closed.
        electron_1.default.app.on('window-all-closed', function () {
            // On OS X it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                electron_1.default.app.quit();
            }
        });
        electron_1.default.app.on('activate', function () {
            // On OS X it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (mainWindow === null) {
                createWindow();
            }
        });
    }
}
let program = new Program();
program.main();
