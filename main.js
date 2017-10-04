/*
Sourced from https://www.fyears.org/2015/06/electron-as-gui-of-python-apps.html
*/
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');

var mainWindow = null;

app.on('window-all-closed', function() {
    //if (process.platform != 'darwin') {
        app.quit();
    //}
});

console.log("Starting Simple Mod Installer...")



app.on('ready', function() {
    // call python?
	// Set up Sudoer to start python as admin
	/*
	var Sudoer = require('electron-sudo').default;
	
	var options = {name: 'Simple Mod Installer'};
	var sudoer = new Sudoer(options);
	
	sudoer.spawn('nano', ['hi there']).then(function(cp) {app.quit()});
	
	sudoer.spawn(
		path.join('bin', 'python'),
		[path.join('bin', 'simple_mod_installer', 'simple_mod_installer', '__init__.py')] // Change this to match Python's startup file location.
	).then(function(cp) {
		cp.stdout.setEncoding('utf8')
		cp.stderr.setEncoding('utf8')
		
		cp.stdout.on('data', (data) => {
			console.log(data);
		});
		
		cp.stderr.on('data', (data) => {
			console.error(data);
		});
		
		cp.on('close', (code) => {
			console.log("Server closed with code: " + code);
			
			if (code != "0") {
				var btnIndex = electron.dialog.showMessageBox({
					type: "warning",
					buttons: ["Take me to the log files", "close"],
					title: "Simple Mod Installer: is everything alright?",
					message: "The server has exited with a non-zero condition.\nThis may be a sign that something has gone wrong with the Simple Mod Installer. If something has gone wrong, please send a report which includes either the output of the console, or the data in the log files.\n\nIf everything's fine then you can safely ignore this message."
				});
				
				if (btnIndex == 0) {
					// Show the log files
					electron.shell.showItemInFolder(require('path').resolve(__dirname) + '/simple_mod_installer/simple_mod_installer/simple.log')
				}
				
				console.warn("Server closed with a bad code, something may have gone wrong. If something has gone wrong, please send a report which includes either the output of the console here, or the output in the log files.")
			}
			
			app.quit()
		});
	});*/
	
    var p_path = path.join('resources', 'app', 'bin', 'python');
	var app_path = path.join('resources', 'app', 'bin', 'simple_mod_installer', '__init__.py')

	console.log("Spawning: " + p_path + " " + app_path);

    var subpy = require('child_process').spawn(
		p_path,
		[app_path] // Change this to match Python's startup file location.
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
		
		if (code != "0") {
			var btnIndex = electron.dialog.showMessageBox({
				type: "warning",
				buttons: ["Take me to the log files", "close"],
				title: "Simple Mod Installer: is everything alright?",
				message: "The server has exited with a non-zero condition.\nThis may be a sign that something has gone wrong with the Simple Mod Installer. If something has gone wrong, please send a report which includes either the output of the console, or the data in the log files.\n\nIf everything's fine then you can safely ignore this message."
			});
			
			if (btnIndex == 0) {
				// Show the log files
				electron.shell.showItemInFolder(require('path').resolve(__dirname) + '/simple_mod_installer/simple_mod_installer/simple.log')
			}
			
			console.warn("Server closed with a bad code, something may have gone wrong. If something has gone wrong, please send a report which includes either the output of the console here, or the output in the log files.")
		}
		
		app.quit()
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
        //mainWindow.webContents.openDevTools();
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
