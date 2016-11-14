var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var projects = {"DejaView": {"short":"Service that allowed anyone to create private and anonymous photo albums where any user with the access code could upload and view full-resolution photos.",
							 "long": "",
							 "link": "https://github.com/wtglover/DejaView"},
				"TwoCents": {"short":"Android application where users could anonymously post questions for others in their area to vote on the answer or solution",
							 "long": "",
							 "link": "https://github.com/wtglover/twocentsapp-backend"},
				"Secret Santa": {"short":"Description",
								 "long": "",
								 "link": "projects/secretsanta"}};

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
});

app.use(express.static(__dirname + '/public'));
app.use("/styles",express.static(__dirname + "/views/stylesheets"));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('pages/index', {
		title: "Toby Glover",
		navLinks: getNavLinks('Home')
	});
});

app.get('/resume', function(request, response) {
	response.render('pages/resume', {
		title: "Resume",
		navLinks: getNavLinks('Resume')
	});
});

app.get('/projects', function(request, response) {
	response.render('pages/projects', {
		title: "Projects",
		navLinks: getNavLinks('Projects'),
		"projects": projects
	});
});

function getNavLinks(pageName) {
	var navLinks = {Home: "/",
					Resume: "/resume",
					Projects: "/projects"};
	delete navLinks[pageName];
	return navLinks;
}

function enableCORS(response) {
	response.header("Access-Control-Allow-Origin", "*");
  	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}