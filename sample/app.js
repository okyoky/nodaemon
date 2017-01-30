var fs = require('fs');
eval(fs.readFileSync('./_include/bootstrap.js')+'');
eval(fs.readFileSync('./_include/webserver.js')+'');

app.use('/', require('./routes/index'));
