var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, resp) {
	resp.render('sample');
});


module.exports = router;