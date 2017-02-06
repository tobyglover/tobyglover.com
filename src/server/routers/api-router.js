var express    = require('express');
var router     = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.json());

router.post('/secretsanta', function(request, response) {
	require("../secretsanta").run(request.body);
	response.sendStatus(200);
});

router.post('/sudoku', function(request, response) {
	var Sudoku = require("../sudoku/");
	var Board = require("../sudoku/Board");
	var Verify = require("../sudoku/ValidatePartialBoard");

	response.setHeader('Content-Type', 'application/json');

	if (Verify.check(request.body)) {
		var board = new Board(request.body);
		var solvedBoard = Sudoku.solve(board);

		if (solvedBoard != null) {
			response.status(200).send({board: solvedBoard.toArray()});
		} else {
			response.status(406).send({reason: "No Solutions to board exist"});
		}
	} else {
		response.status(406).send({reason: "Invalid board"});
	}
});

module.exports = router;