var verify = require("./ValidatePartialBoard");
var Board = require("./Board");
var PriorityQueue = require("./PriorityQueue");

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
Set.prototype.diff = function(setB) {
    var diff = new Set(this);
    for (var elem of setB) {
        diff.delete(elem);
    }
    return diff;
}

Set.prototype.isSuperset = function(subset) {
    for (var elem of subset) {
        if (!this.has(elem)) {
            return false;
        }
    }
    return true;
}

function init(input, d) {
	var done = false;
	var board = new Board(input.board);
	board = solve(board);

	if (board) {
		d({'board' : board.toArray()});
	} else {
		d({'board' : null});
	}
}

function solve(board) {
	var done = false;

	initBoard(board);
	done = isSolved(board);

	if (!done) {
		done = buildPreemptiveSets(board);
	}

	// If CSP and pre-emptive sets do not solve, recurse to solution
	if (!done) {
		board = search(board);
		done = board != null && isSolved(board);
	}

	if (done) {
		return board;
	} else {
		return null;
	}

}

function initBoard(board) {
	var points = [];

	board.map(function (r, c, val) {
		if (!isSet(val)) {
			points.push([r, c]);
		}
	});

	for (var i = 0; i < points.length; i++) {
		applyConstraints(board, points[i][0], points[i][1]);
	}
}

function buildPreemptiveSets(board) {
	var done = false;
	for (var i = 8; i > 0; i--) {
		done = analyze(board, i);
		if (done) {
			break;
		}
	}
	return done;
}

function analyze(board, numRequiredSets) {
	var loopfuncs = [board.mapRow, board.mapCol, board.mapSec];
	var countNums = 0;

	board.map(function(row, col, val) {
		if (isSet(val)) {
			if (val.size == numRequiredSets) {
				for (var i = 0; i < loopfuncs.length; i++) {
					var numSubsets = 1;

					loopfuncs[i](row, col, function(r, c, v) {
						if (isSet(v) && val.isSuperset(v)) {
							numSubsets++;
						}
					});

					if (numSubsets == numRequiredSets) {
						loopfuncs[i](row, col, function(r, c, v) {
							if (isSet(v) && !val.isSuperset(v)) {
								board.set(r, c, board.get(r, c).diff(val));
								if (board.get(r, c).size == 1) {
									applyConstraints(board, r, c);
								}
							}
						});
					}
				}
			}
		} else {
			countNums++;
		}
	});

	return countNums == 81;
}

function search(board) {
	var openDomains = new PriorityQueue();

	board.map(function (row, col, val) {
		if (isSet(val)) {
			openDomains.add(row, col, val);
		}
	});

	var data = openDomains.pop();
	while (data) {
		var row = data.row;
		var col = data.col;
		var set = data.set;

		for (num of set) {
			board.set(row, col, num);
			if (verify.fitsConstraints(board.toArray(), row, col)) {
				var copy = board.copy();
				var solvedBoard = solve(copy);

				if (solvedBoard != null) {
					return solvedBoard;
				}
			}
		}

		board.set(row, col, set);
		data = openDomains.pop();
	}

	return null;
}

function applyConstraints(board, row, col) {
	if (isSet(board.get(row, col))) {
		board.set(row, col, [...board.get(row, col)][0]);
	}

	var val = board.get(row, col);
	var func = function(r, c, v) {
		if (isSet(v)) {
			v.delete(val);
			if (v.size == 1) {
				applyConstraints(board, r, c);
			}
		}
	};

	board.mapRow(row, col, func);
	board.mapCol(row, col, func);
	board.mapSec(row, col, func);
}

function isSolved(board) {
	var solved = true;

	board.map(function(r, c, val) {
		if (isSet(val)) {
			solved = false;
		}
	});

	if (solved) {
		solved = verify.check(board.toArray());
	}

	return solved;
}

function isSet(val) {
	return typeof val == "object";
}

module.exports = init;
