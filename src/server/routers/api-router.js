var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/secretsanta', function(request, response) {
	require("../secretsanta").run(request.body);
	response.sendStatus(200);
});

router.post('/sudoku', function(request, response) {
	var Verify = require("../sudoku/ValidatePartialBoard");
	var spawn = require('threads').spawn;
	var timeoutSeconds = 20;

	response.setHeader('Content-Type', 'application/json');

	if (Verify.check(request.body)) {
		const thread = spawn(__dirname + '/../sudoku/index.js');

		var timeout = setTimeout(function(t) {
			thread.kill();
			clearTimeout(t);
			response.status(406).send({reason: "Calculation took too long to run (sorry, I can't afford exponential calculations)"});
		}, timeoutSeconds * 1000);

		thread.send({'board' : request.body}).on('message', function(message) {
			clearTimeout(timeout);

    		if (message.board != null) {
				response.status(200).send({board: message.board});
			} else {
				response.status(406).send({reason: "No Solutions to board exist"});
			}

   			thread.kill();
  		});

	} else {
		response.status(406).send({reason: "Invalid board"});
	}
});

router.get("/randomgif", function(request, response) {
  const https = require("https");
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_KEY}&rating=PG-13`;
  console.log(url);

  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      response.send(body.data.images.fixed_height);
    });
  });
});

module.exports = router;
