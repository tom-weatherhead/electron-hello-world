'use strict';

// var app = require('app');
// var BrowserWindow = require('browser-window');
const { app, BrowserWindow /* , screen */ } = require('electron');

let mainWindow = undefined;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });

    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
});