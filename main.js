// See https://medium.com/developers-writing/building-a-desktop-application-with-electron-204203eeb658#.rpbzyljfo

// Once package.json is in place (possibly without any devDependencies), run: npm install --save-dev electron-prebuilt

'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});