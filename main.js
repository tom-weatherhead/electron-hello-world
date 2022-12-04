'use strict';

const { app, BrowserWindow } = require('electron');

let mainWindow = undefined;

function isMainDisplay(display) {
    return display.bounds.x === 0 && display.bounds.y === 0;
}

app.on('ready', () => {
    console.log('App event: ready');

    // mainWindow = new BrowserWindow({
    //     // x: 100,     // Show the window on the Panasonic display
    //     // x: -1180,    // Show the window on the KDS display
    //     x: -3100,    // Show the window on the Philips display
    //     y: 100,
    //     width: 1024,
    //     height: 768
    // });

    // mainWindow.loadURL('file://' + __dirname + '/app/index.html');
// });

// From https://www.electronjs.org/docs/latest/api/screen :
// app.whenReady().then(() => {
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

    const windows = displays.map(display => {
        console.log('Creating a window on display', display.id);

        const window = new BrowserWindow({
            // x: 100,     // Show the window on the Panasonic display
            // x: -1180,    // Show the window on the KDS display
            // x: -3100,    // Show the window on the Philips display
            x: display.bounds.x + 100,
            y: 100,
            width: 1024,
            height: 768
        });
    
        window.loadURL('file://' + __dirname + '/app/index.html');

        if (isMainDisplay(display)) {
            mainWindow = window;
        }

        return window;
    });

    /* const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0
    })
  
    if (externalDisplay) {
      win = new BrowserWindow({
        x: externalDisplay.bounds.x + 50,
        y: externalDisplay.bounds.y + 50
      })
      win.loadURL('https://github.com')
    } */
});

app.on('window-all-closed', () => {
    console.log('App event: window-all-closed');
    app.quit();
});
