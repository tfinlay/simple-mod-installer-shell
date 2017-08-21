/*
Sourced from https://www.fyears.org/2015/06/electron-as-gui-of-python-apps.html
*/

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var mainWindow = null;

app.on('window-all-closed', function() {
    //if (process.platform != 'darwin') {
        app.quit();
    //}
});

app.on('ready', function() {
    // call python?
    var subpy = require('child_process').spawn(
		'python3',
		['./simple_mod_installer/__init__.py'] // Change this to match Python's startup file location.
		/*{
		    0,
		    'pipe'
		}*/
	);
    
    
    subpy.stdout.setEncoding('utf8')
    subpy.stderr.setEncoding('utf8')
    
    subpy.stdout.on('data', (data) => {
        console.log(data);
    });
    
    subpy.stderr.on('data', (data) => {
        console.error(data);
    });
    
    subpy.on('close', (code) => {
        console.log("Server closed with code: " + code);
    });
    
    //var subpy = require('child_process').spawn('./dist/hello.exe');
    var rq = require('request-promise');
    var mainAddr = 'http://localhost:5000';

    var openWindow = function(){
        mainWindow = new BrowserWindow({width: 1000, height: 600, show: false, minWidth: 1000, minHeight: 600, title: "tfff1's Simple Mod Installer", icon: 'assets/favicon.ico', fullscreenable: false, defaultFontFamily: 'sansSerif'});
        // mainWindow.loadURL('file://' + __dirname + '/index.html');

        mainWindow.once('ready-to-show', () => {
            mainWindow.show();
        });

        mainWindow.loadURL('http://localhost:5000');
        mainWindow.webContents.openDevTools();
        mainWindow.on('closed', function() {
          mainWindow = null;
          subpy.kill('SIGINT');
        });
    };

    var startUp = function(){
        rq(mainAddr)
            .then(function(htmlString){
                console.log('server started!');
                openWindow();
            })
            .catch(function(err){
                //console.log('waiting for the server start...');
                startUp();
            });
    };

    // fire!
    startUp();
});
