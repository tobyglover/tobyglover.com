var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var test = false;
var localPort = 5000;

app.set('port', (process.env.PORT || localPort));
app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
});

app.use(express.static(__dirname + '/public'));
app.use("/styles",express.static(__dirname + "/views/stylesheets"));
app.use("/scripts",express.static(__dirname + "/views/scripts"));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.get("*", function(request, response, next) {
	test = false;
	if (request.hostname == 'test.localhost') {
        test = true;
    } else { 
    	for (var i = 0; i < request.subdomains.length; i++) {
			if (request.subdomains[i] == "test") {
				test = true;
				break;
			}
		}
	}
	next();
});

app.get('/', function(request, response) {
	response.render('pages/index', {
		title: "Toby Glover",
		navLinks: getNavLinks('Home'),
		'test': test
	});
});

app.get('/resume', function(request, response) {
	response.render('pages/resume', {
		title: "Resume",
		navLinks: getNavLinks('Resume'),
		extensions: ['<link rel="stylesheet" href="/styles/resume.css" type="text/css">'],
		'test': test
	});
});

app.get('/projects', function(request, response) {
	response.render('pages/projects', {
		title: "Projects",
		navLinks: getNavLinks('Projects'),
		'test': test
	});
});

app.get('/projects/secretsanta', function(request, response) {
	response.render('pages/secretsanta', {
		title: "Secret Santa",
		navLinks: getNavLinks(),
		extensions: ['<link rel="stylesheet" href="/styles/secretsanta.css" type="text/css">',
					 '<script type="text/javascript" src="/scripts/secretsanta.js"></script>'],
		'test': test
	});
});

app.post('/api/secretsanta', function(request, response) {
	require("./secretsanta.js").run(request.body);
	response.sendStatus(200);
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