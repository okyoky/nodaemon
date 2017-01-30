var path = require('path');
global.appName = path.relative('.',module.filename).replace(path.sep + path.basename(module.filename), '');
global._N = "\n";

eval(fs.readFileSync('./_config/config.js')+'');

var daemon_timer_func;
function daemon_timer(f_call) {
	if(f_call !== undefined) daemon_timer_func = f_call;
	daemon_timer_func();
	setTimeout(daemon_timer, 1000 * config.daemon_period);
}