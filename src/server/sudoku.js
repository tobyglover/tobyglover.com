var verifyBoard = require("../shared/ValidatePartialBoard");
var solvedBoard = []; 
var returnValue = {
	board: [],
	reason: null
};

module.exports.solve = function(partialBoard) {
	if (!verifyBoard.check(partialBoard)) {
		returnValue.board = null;
		returnValue.reason = "Board is invalid";
	} else {
		initSolvedBoard();
		returnValue.board = null;
		returnValue.reason = "Feature not fully implemented";
	}
	
	return returnValue;
}

function initSolvedBoard() {
	for (var i = 0; i < 9; i++) {
		var row = [];
		for (var j = 0; j < 9; j++) {
			row.push(Array.apply(null, {length: 10}).map(Number.call, Number));
		}
		solvedBoard.push(row);
	}
}
