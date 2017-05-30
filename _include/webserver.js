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

var path = require('path');

if(config.use.json2xls) {
	json2xls = require('json2xls');
	app.use(json2xls.middleware);
}

app.set('views', [path.join(config.projectname, 'views'), path.join('.', '_views')]);
if(config.env == 'development') app.locals.pretty = true;

if(config.use.pug) {
	app.set('view engine', 'pug');
}
app.set('strict routing', false);

if(config.use.bodyParser) {
	var bodyParser = require('body-parser');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
}

if(config.use.cookieParser) {
	var cookieParser = require('cookie-parser');
	app.use(cookieParser());
}

if(config.use.redisSession) {
	var session = require('express-session');
	var redis = require('connect-redis')(session);
	app.use(session({
		store: new redis({
			host: config.use.redisSessionHost,
			prefix: config.use.sessionPrefix
		}),
		secret: config.use.sessionSecret,
		saveUninitialized: false,
		resave: false
	}));
}

if(config.use.less) {
	var lessMiddleware = require('less-middleware');
	app.use(lessMiddleware(path.join(config.projectname, 'public')));
	app.use(lessMiddleware(path.join('_public')));
}


if(config.use.stylus) {
	var stylus = require('express-stylus');
	var stylOpts = {
		src: path.join(config.projectname, 'public'),
		force: env == 'development'
	};
	if(config.use.stylus_nib) {
		var nib = require('nib');
		stylOpts.use = [nib()];
		stylOpts.import = ['nib'];
	}
	app.use(stylus(stylOpts));
}

if(config.domain != undefined) {
	server = app.listen(config.port, config.domain);
	console.log(_N + appName + ' now listening at http://' + config.domain + ':' + config.port + _N);
} else {
	server = app.listen(config.port);
	console.log(_N + appName + ' now listening at http://' + server.address().address + ':' + server.address().port + _N);
}

app.use(express.static(path.join(config.projectname, 'public')));
app.use(express.static(path.join('_public')));

module.exports = app;
