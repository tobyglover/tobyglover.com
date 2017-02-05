var verifyBoard = require("../shared/ValidatePartialBoard");

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
Set.prototype.diff = function(setB) {
    for (var elem of setB) {
        this.delete(elem);
    }
}

module.exports.solve = function(partialBoard) {
	returnValue = {
		board: [],
		reason: null
	};

	if (!verifyBoard.check(partialBoard)) {
		returnValue.board = null;
		returnValue.reason = "Board is invalid";
	} else {
		board = partialBoard;

		initBoard();
		var numsOnBoard;
		for (var i = 0; i < 10; i++) { // more of a timeout (this is running on a server, after all). If it gets here its almost definitely not solvable.
			numsOnBoard = analyze();
			if (numsOnBoard >= 81) {
				break;
			}
		}
		if (numsOnBoard >= 81) {
			returnValue.board = board;
			returnValue.reason = "";
		} else {
			returnValue.board = null;
			returnValue.reason = "Error: Board requires guessing to solve";
		}
	}
	
	return returnValue;
}

function initBoard() {
	var points = [];

	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] == null) {
				board[i][j] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
			} else {
				points.push([i, j]);
			}
		}
	}

	for (var i = 0; i < points.length; i++) {
		applyConstraints(points[i][0], points[i][1]);
	}
}

function analyze() {
	var numsOnBoard = 0;
	var loopFuncs = [loopRow, loopCol, loopSec];

	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			for (var i = 0; i < loopFuncs.length; i++) {
				if (isSet(row, col)) {
					var copy = new Set(board[row][col].values());
					loopFuncs[i](row, col, function(r, c) {
						if (copy != null && isSet(r, c)) {
							copy.diff(board[r][c]);
							if (copy.size == 1) {
								board[row][col] = [...copy][0];
								applyConstraints(row, col);
								copy = null;
							}
						}
					});
				} else {
					numsOnBoard++;
				}
			}
		}
	}

	return numsOnBoard;
}

function applyConstraints(row, col) {
	var val = board[row][col];

	loopConstraints(row, col, function(r, c) {
		reduceDomain(val, r, c);
	});
}

function reduceDomain(val, row, col) {
	if (isSet(row, col)) {
		board[row][col].delete(val);
		if (board[row][col].size == 1) {
			board[row][col] = [...board[row][col]][0];
			applyConstraints(row, col);
		}
	}
}

function loopConstraints(row, col, callback) {
	loopRow(row, col, callback);
	loopCol(row, col, callback);
	loopSec(row, col, callback);
}

function loopRow(row, col, callback) {
	for (var c = 0; c < 9; c++) {
		if (c != col) {
			callback(row, c);
		}
	}
}

function loopCol(row, col, callback) {
	for (var r = 0; r < 9; r++) {
		if (r != row) {
			callback(r, col);
		}
	}
}

function loopSec(row, col, callback) {
	var sectionRow = Math.floor(row / 3);
	var sectionCol = Math.floor(col / 3);

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var checkRow = sectionRow * 3 + i;
			var checkCol = sectionCol * 3 + j;
			if (checkRow != row || checkCol != col) {
				callback(checkRow, checkCol);
			}
		}
	}
}

function isSet(row, col) {
	return typeof board[row][col] == "object";
}

function printBoard() {
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			if (isSet(row, col)) {
				process.stdout.write("  ");
			} else {
				process.stdout.write(board[row][col] + " ");
			}
		}
		console.log();
	}
}
