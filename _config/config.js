var rootPath = path.normalize(__dirname + '/..');
var env = process.env.NODE_ENV || 'development';

var def_config = {
	root: rootPath,
	db: {},
	port: 3000,
	daemon_period: 60,
	env: env
};

var env_config = {
	development: {
		db: {
			sample: 'postgres://user:pass@localhost:5432/sample'
		},
		schemas: {
			sample: 'public'
		}
	},

	production: {
		db: {
			sample: 'postgres://user:pass@localhost:5432/sample'
		},
		schemas: {
			sample: 'public'
		}
	}
};

var appconfig = {
	sample: {
		use: {
			less: 0,
			stylus: 1,
			stylus_nib: 1,
			pug: 1,
			redisSession: 0,
			redisSessionHost: 'redis',
			sessionPrefix: 'nodaemon',
			sessionSecret: 'nodaemonpass',
			bodyParser: true,
			cookieParser: true,
			json2xls: false
		},
		domain: 'localhost',
		port: 8000,
		//daemon_period: 5,      //      seconds
		db: Object.assign({},env_config[env].db,{
		})
	}

};

// todo: db assign

global.config = {};
Object.assign(global.config, def_config, env_config[env], appconfig[appName]);

config.projectname = appName;
