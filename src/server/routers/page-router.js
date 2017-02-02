var express   = require('express');
var router    = express.Router();

router.get('/', function(request, response) {
	response.render('pages/index', {
		title: "",
		navLinks: getNavLinks('Home')
	});
});

router.get('/resume', function(request, response) {
	response.render('pages/resume', {
		title: "Resume",
		navLinks: getNavLinks('Resume'),
		extensions: ['<link rel="stylesheet" href="/styles/resume.css" type="text/css">']
	});
});

router.get('/projects', function(request, response) {
	response.render('pages/projects', {
		title: "Projects",
		navLinks: getNavLinks('Projects')
	});
});

router.get('/projects/secretsanta', function(request, response) {
	response.render('pages/secretsanta', {
		title: "Secret Santa",
		navLinks: getNavLinks(),
		extensions: ['<link rel="stylesheet" href="/styles/secretsanta.css" type="text/css">',
					 '<script type="text/javascript" src="/scripts/secretsanta.js"></script>']
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