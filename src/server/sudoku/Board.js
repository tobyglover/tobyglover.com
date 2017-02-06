class Board {

	constructor(partialBoard) {
		for (var row = 0; row < 9; row++) {
			for (var col = 0; col < 9; col++) {
				if (partialBoard[row][col] == null) {
					partialBoard[row][col] = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
				}
			}
		}
		this.board = partialBoard;
		this.mapRow = this.mapRow.bind(this);
		this.mapCol = this.mapCol.bind(this);
		this.mapSec = this.mapSec.bind(this);
	}

	set(row, col, val) {
		this.board[row][col] = val;
	}

	get(row, col) {
		return this.board[row][col];
	}

	mapRow(row, col, callback) {
		for (var c = 0; c < 9; c++) {
			if (c != col) {
				callback(row, c, this.get(row, c));
			}
		}
	}

	mapCol(row, col, callback) {
		for (var r = 0; r < 9; r++) {
			if (r != row) {
				callback(r, col, this.get(r, col));
			}
		}
	}

	mapSec(row, col, callback) {
		var sectionRow = Math.floor(row / 3);
		var sectionCol = Math.floor(col / 3);

		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var checkRow = sectionRow * 3 + i;
				var checkCol = sectionCol * 3 + j;
				if (checkRow != row || checkCol != col) {
					callback(checkRow, checkCol, this.get(checkRow, checkCol));
				}
			}
		}
	}

	map(callback) {
		for (var row = 0; row < 9; row++) {
			for (var col = 0; col < 9; col++) {
				callback(row, col, this.get(row, col));
			}
		}
	}

	print() {
		this.map(function(r, c, v) {
			if (typeof v == 'object') {
				process.stdout.write("  ");
			} else {
				process.stdout.write(v + " ");
			}
			if (c == 8) {
				console.log();
			}
		});
	}

	toArray() {
		return this.board;
	}

	copy() {
		var board = [];
		for (var i = 0; i < 9; i++) {
			board.push(new Array(9));
		}

		this.map(function(r, c, v) {
			if (isSet(v)) {
				board[r][c] = new Set(v);
			} else {
				board[r][c] = v;
			}
		});

		return new Board(board);
	}
}

function isSet(v) {
	return typeof v == 'object';
}

module.exports = Board;