var express    = require('express');
var app        = express();
var apiRouter  = require('./src/server/routers/api-router');
var pageRouter = require('./src/server/routers/page-router');
var opn = require('opn');

global.test   = false;
var localPort = 5000;

// app.set('views', __dirname + '/src/client/views');
// app.set('view engine', 'ejs');

app.set('port', (process.env.PORT || localPort));
app.listen(app.get('port'), function() {
 	console.log('Node app is running on port', app.get('port'));
  if (process.env.NODE_ENV === "development") {
    opn('http://localhost:' + app.get('port'));
  }
});

app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/src/client/static'));

app.use(function(request, response, next) {
	global.test = false;
	if (request.hostname == 'localhost') {
        global.test = true;
    } else {
    	for (var i = 0; i < request.subdomains.length; i++) {
			if (request.subdomains[i] == "test") {
				global.test = true;
				break;
			}
		}
	}
	next();
});

app.use('/api', apiRouter);
// app.use('/',    pageRouter);
// app.use(function(request, response) {
// 	response.redirect("/pagenotfound");
// });
