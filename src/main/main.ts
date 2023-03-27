/* eslint-disable prettier/prettier */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import ChildProcess from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { loginUser, User, Data } from './postAuth';
import { getEquipment, Equipment } from './getEquipment';
import { getBookings, Booking } from './getBookingsToday';
import { postNewBooking, NewBooking } from './postBookingVC';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-site', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-site', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1320,
    height: 2160,
    icon: getAssetPath('icon.png'),
    transparent: true,
    backgroundColor: '#ffffffff',
    alwaysOnTop: true,
    kiosk: true, // should be true in production
    frame: false,  // should be false in production
    webPreferences: {
      devTools: true, // also should be false in production
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  // hide the following in production
  mainWindow.webContents.openDevTools();

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */
ipcMain.on('booco-post-req', async (event, arg) => {
  console.log("api request here");

  const user: User = await loginUser(arg[0], arg[1], arg[2], arg[3]) as User;
  try
    {
    if(user.status === "success" && user.data.authToken === null) {
        console.log("ERROR: user authorization failed");
        return -1;
        }

        console.log("User authToken: %s\nUser ID: %s",
        user.data.authToken, user.data.userId);
        /*
        const equipmentApi = '/api/v1/equipment?driver=booco-panel-device';
        const eq: Equipment = await getEquipment(
          arg[0],
          equipmentApi,
          user.data.authToken,
          user.data.userId) as Equipment
        return eq;
        */
        const todayBookingApi = '/api/v1/bookings/today';
        const bk: Booking = await getBookings(
          arg[0],
          todayBookingApi,
          user.data.authToken,
          user.data.userId) as Booking
        return bk;

    }
    catch(e){
      if (e instanceof Error) {
        console.log("ERROR: connection failed: {0}", e.message);
        return -1;
      }

    }
  return 0;
});

ipcMain.on('booco-postnewbook-req', async (event, arg) => {
  console.log("generate new bookings");

  const user: User = await loginUser(arg[0], arg[1], arg[2], arg[3]) as User;
  try
    {
    if(user.status === "success" && user.data.authToken === null) {
        console.log("ERROR: user authorization failed");
        return -1;
        }

        console.log("User authToken: %s\nUser ID: %s",
        user.data.authToken, user.data.userId);
        // const today = new Date().getUTCDay().toString();
        // const time = new Date().toTimeString();
        const nbk: NewBooking = await postNewBooking(
          arg[0],
          '2023-03-27',
          '13',
          '2fwKcjvxkbrJvtM7L',
          'https://us05web.zoom.us/wc/82604234154/start',
          user.data.authToken,
          user.data.userId) as NewBooking
        return nbk;

    }
    catch(e){
      if (e instanceof Error) {
        console.log("ERROR: connection failed: {0}", e.message);
        return -1;
      }

    }
  return 0;
});

ipcMain.on('open-site', async (event, arg) => {
  //  start bash script here
  const livpath = path.normalize(`${__dirname}/../`); // go up along file tree to get lib directory
  const script = ChildProcess.spawn('bash', [
    `${livpath}lib/run.sh`,
    arg[0],
  ]);
  // set window size mode and background color
  const delay = (ms:number) => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  const webContents = event.sender
  const win = BrowserWindow.fromWebContents(webContents)
  win?.setAlwaysOnTop(true)
  if(arg[0]==="CLOSE") {
    win?.setBackgroundColor('#ffffffff') // set not transparent color
    win?.setKiosk(true)
  }
  else{
    const reDrawWindowWithDelay = async () => {
    await delay(3000);
    win?.setBackgroundColor('#00ffffff'); // #AARRGGBB set transparent color
    win?.setKiosk(false);
    win?.setSize(300, 130, false);
    win?.setPosition(0, 930, false);
    };
    reDrawWindowWithDelay();
  }

  console.log(`PID: ${script.pid}`);

  script.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  script.stderr.on('data', (err) => {
    console.log(`stderr: ${err}`);
  });

  script.on('exit', (code) => {
    console.log(`Exit Code: ${code}`);
  });
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
