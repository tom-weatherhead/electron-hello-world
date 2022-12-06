'use strict';

const { app, BrowserWindow, ipcMain, Menu, screen, Tray } = require('electron');
const path = require('path');

// const platform = os.platform();
const platform = process.platform;
// const isPlatformWindows = platform === 'win32';
const isPlatformMac = platform === 'darwin';
// const isPlatformLinux = platform === 'linux';

// console.log('platform is', platform);

const faviconFilePath = path.join(__dirname, 'src', 'assets', 'icons', 'png', 'favicon.png');
const trayIconFilePath = faviconFilePath;

// const trayIconFilePath = path.join(__dirname, 'src', 'assets', 'icons', 'macos-tray', 'nipple-icon01-024x024.png');

const appIconFilePath = path.join(__dirname, 'src', 'assets', 'icons', 'macos-dock', 'green-f-01-96x96.png');;
// const pngIconFilePath = appIconFilePath;

let mainWindow = undefined;

// See https://electronjs.org/docs/api/app#appdisablehardwareacceleration
// app.disableHardwareAcceleration();

// TODO: Use app.isUnityRunning() on Linux?

if (isPlatformMac) {
	app.setAboutPanelOptions({
		applicationName: 'Foo',
		applicationVersion: '0.0.0',
		copyright: 'Copyright (c) 2018-2022 Buckwheat Unlimited',
		version: '0.0.0', // macOS only.
		credits: 'Praise the LORD!' // macOS and Windows only.
		// , authors: ['Buckwheat'], // Linux only.
		// website: 'https://2hrd4u.org' // , // Linux only.
		// iconPath: pngIconFilePath // Linux and Windows only.
	});
}

function setDockMenu() {

	if (!isPlatformMac) {
		return;
	}

	const dockMenu = Menu.buildFromTemplate([
		{
			label: 'New Window',
			click() {
				console.log('New Window');
			}
		},
		{
			label: 'New Window with Settings',
			submenu: [
				{
					label: 'Basic'
				},
				{
					label: 'Pro'
				}
			]
		},
		{
			label: 'New Foo Command...'
		}
	]);

	app.dock.setMenu(dockMenu);

	// getPathToRandomAppIconPNGFile(appIconPNGFilesDir).then((appIconPNGFile) => {
	// 	console.log('Using app icon at', appIconPNGFile);
	// 	pngIconFilePath = appIconPNGFile;
	// 	app.dock.setIcon(appIconPNGFile);
	// });
	app.dock.setIcon(appIconFilePath);
}

function isMainDisplay(display) {
    return display.bounds.x === 0 && display.bounds.y === 0;
}

function createWindow() {
    const displays = screen.getAllDisplays();

    // Panasonic TV: id == 1, bounds.x == 0
    // Philips TV: id == 5, bounds.x == -3200
    // KDS Radius display: id == 8, bounds.x == -1280

    for (let display of displays) {
        console.log('\nDisplay:');
        console.log('id:', display.id);
        console.log('Bounds.x:', display.bounds.x);
        console.log('Bounds.y:', display.bounds.y);
        console.log('Bounds.width:', display.bounds.width);
        console.log('Bounds.height:', display.bounds.height);
        console.log('Size.width:', display.size.width);
        console.log('Size.height:', display.size.height);
        console.log('rotation:', display.rotation);
        console.log('scaleFactor:', display.scaleFactor);
        console.log('touchSupport:', display.touchSupport);
        console.log('monochrome:', display.monochrome);
        console.log('accelerometerSupport:', display.accelerometerSupport);
        console.log('colorSpace:', display.colorSpace);
        console.log('colorDepth:', display.colorDepth);
        console.log('depthPerComponent:', display.depthPerComponent);
        console.log('displayFrequency:', display.displayFrequency);
        console.log('workArea.x:', display.workArea.x);
        console.log('workArea.y:', display.workArea.y);
        console.log('workArea.width:', display.workArea.width);
        console.log('workArea.height:', display.workArea.height);
        console.log('workAreaSize.width:', display.workAreaSize.width);
        console.log('workAreaSize.height:', display.workAreaSize.height);
        console.log('internal:', display.internal);
    }

    const xMargin = 100;
    const yMargin = 100;

    const windows = displays.map(display => {
        console.log('Creating a window on display', display.id);

        const x = display.workArea.x + xMargin;
        const y = display.workArea.y + yMargin;
        const width = display.workArea.width - 2 * xMargin;
        const height = display.workArea.height - 2 * yMargin;

        const window = new BrowserWindow({
            // x: 100,     // Show the window on the Panasonic display
            // x: -1180,    // Show the window on the KDS display
            // x: -3100,    // Show the window on the Philips display

            // x: display.bounds.x + 100,
            // y: 100,
            // width: 1024,
            // height: 768

			backgroundColor: '#ffffff',
			// backgroundColor: '#7851a9', // From the TouchBar button
			// icon: 'assets/favicon.png', // On Windows, use an .ico file for best results.
			// icon: faviconFilePath, // ThAW: Does this have any effect? I.e. On non-Mac?
            title: `Electron BrowserWindow on Display ${display.id}`,
            x,
            y,
            width,
            height,
			webPreferences: {
				preload: path.join(__dirname, 'preload.js')
			}
        });

        // window.loadURL('file://' + __dirname + '/app/index.html');
        window.loadFile('./app/index.html');
        // Or e.g. window.loadURL('https://github.com');

        // const win = new BrowserWindow({ show: false })
        // win.once('ready-to-show', () => {
        //     win.show()
        // });

        if (isMainDisplay(display)) {
            mainWindow = window;
        }

        return window;
    });
}

app.whenReady().then(() => {
    console.log('App event: ready');

	// Create the first window
	createWindow()

	// Ensure that there is always at least one window.
	app.on('activate', () => {

		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});

	// Create the tray icon
	const tray = new Tray(trayIconFilePath); // Should the icon be 24x24 ?

	// Configure the application's icon in the tray

	tray.on('click', () => {
		// When the app's tray icon is clicked, do some appropriate action.
		console.log('Tray event: click');

		// win.isVisible() ? win.hide() : win.show();
	});

	// Create all IPC (inter-process communications) listeners.
	ipcMain.on('set-title', (event, title) => {
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);

		win.setTitle(title);
	});

	// On macOS, set up the dock menu
	setDockMenu();
});

// Alternative to window.on('focus', ...); :
app.on('browser-window-focus', (event, window) => {
    // E.g. The user clicked on the window, giving the window focus
    console.log('App event: browser-window-focus');

    if (window) {
        console.log('Focus window:', window.id);
    }
});

// Alternative to window.on('blur', ...); :
app.on('browser-window-blur', (event, window) => {
    // I.e. The window had focus, but then the focus went elsewhere.
    console.log('App event: browser-window-blur');

    if (window) {
        console.log('Blur window:', window.id);
    }
});

app.on('window-all-closed', () => {
    console.log('App event: window-all-closed');

    // if (process.platform !== 'darwin') {
	app.quit();
	// }
});
