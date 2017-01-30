var express = require('express');
var app = express();

var http = require('http');
var debug = require('debug')('nodaemon: ' + appName);
app.set('port', config.port);

var server = http.createServer(app);

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr.port;
	debug('Listening on ' + bind);
}

server.on('error', onError);
server.on('listening', onListening);

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');

/*						uncomment to session store
//          req.session is a session data object
var session = require('express-session');
var redis = require('connect-redis')(session);
app.use(session({
	store: new redis({
		host:'redis',
		prefix:'nodaemon_' + appName
	}),
	secret: appName + 'Pass'
}));
//*/

app.set('views', [path.join(config.projectname, 'views'), path.join('.', '_views')]);
app.locals.pretty = true;

app.set('view engine', 'pug');
app.set('strict routing', false);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(config.projectname, 'public')));
app.use(express.static(path.join('_public')));

/*						uncomment to use less
var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(path.join(config.projectname, 'public')));
app.use(lessMiddleware(path.join('_public')));
//*/


/*						uncomment to use stylus
var stylus = require('express-stylus');
var nib = require('nib');
app.use(stylus({
	src: path.join(config.projectname, 'public'),
	use: [nib()],
	import: ['nib']
}));
//*/

if(config.domain != undefined) {
	server = app.listen(config.port, config.domain);
	console.log(_N + appName + ' now listening at http://' + config.domain + ':' + config.port + _N);
} else {
	server = app.listen(config.port);
	console.log(_N + appName + ' now listening at http://' + server.address().address + ':' + server.address().port + _N);
}

module.exports = app;
