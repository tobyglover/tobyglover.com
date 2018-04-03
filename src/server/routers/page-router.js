var express   = require('express');
var router    = express.Router();

router.get('/', function(request, response) {
	response.render('pages/index');
});

router.get('/projects/sudoku', function(request, response) {
	response.render('pages/sudoku');
});

router.get('/projects/secretsanta', function(request, response) {
	response.render('pages/secretsanta');
});

router.get('/resume', function(request, response) {
	response.render('pages/resume');
});

router.get('/pagenotfound', function(request, response) {
	response.render('pages/pagenotfound');
});

router.get("*", function(request, response) {
  response.redirect('/pagenotfound?p=' + request.originalUrl);
});

module.exports = router;
