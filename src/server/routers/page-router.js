var express   = require('express');
var router    = express.Router();

router.get('/', function(request, response) {
	response.render('pages/index', {
		navLinks: getNavLinks('Home')
	});
});

router.get('/resume', function(request, response) {
	response.render('pages/resume', {
		navLinks: getNavLinks('Resume'),
	});
});

router.get('/projects', function(request, response) {
	response.render('pages/projects', {
		navLinks: getNavLinks('Projects')
	});
});

router.get('/projects/sudoku', function(request, response) {
	response.render('pages/sudoku', {
		navLinks: getNavLinks()
	});
});

router.get('/projects/secretsanta', function(request, response) {
	response.render('pages/secretsanta', {
		navLinks: getNavLinks()
	});
});

router.get('/pagenotfound', function(request, response) {
	response.render('pages/pagenotfound', {
		navLinks: getNavLinks()
	});
});

function getNavLinks(pageName) {
	var navLinks = {Home: "/",
					Resume: "/resume",
					Projects: "/projects"};
	delete navLinks[pageName];
	return navLinks;
}

module.exports = router;