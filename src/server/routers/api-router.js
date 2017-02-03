var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/secretsanta', function(request, response) {
	require("../secretsanta").run(request.body);
	response.sendStatus(200);
});

router.post('/sudoku', function(request, response) {
	response.setHeader('Content-Type', 'application/json');

	var returnValue = require("../sudoku").solve(request.body);

	if (returnValue.board) {
		response.status(200).send({board: returnValue.board});
	} else {
		response.status(406).send({reason: returnValue.reason});
	}
});

module.exports = router;