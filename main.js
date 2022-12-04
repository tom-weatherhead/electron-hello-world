'use strict';

const { app, BrowserWindow } = require('electron');

let mainWindow = undefined;

function isMainDisplay(display) {
    return display.bounds.x === 0 && display.bounds.y === 0;
}

// From https://www.electronjs.org/docs/latest/api/screen :
// app.whenReady().then(() => { ... }); -> Error: app.whenReady() not a function

app.on('ready', () => {
    console.log('App event: ready');

    const { screen } = require('electron');

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

            title: `Electron BrowserWindow on Display ${display.id}`,
            x,
            y,
            width,
            height
        });

        window.loadURL('file://' + __dirname + '/app/index.html');
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
    app.quit();
});
