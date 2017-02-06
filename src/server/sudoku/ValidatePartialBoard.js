function check(partialBoard) {
	var i = 0;
	var validBoard = true;

	while (i < 9 && validBoard) {
		for (var j = 0; j < 9; j++) {
			if (partialBoard[i][j]) {
				validBoard = fitsConstraints(partialBoard, i, j);

				if (!validBoard) {
					break;
				}
			}
		}
		i++;
	}
	return validBoard;
}

function fitsConstraints(board, row, col) {
	return fitsSection(board, row, col) && fitsRow(board, row, col) && fitsCol(board, row, col);
}

function fitsRow(board, row, col) {
	for (var i = 0; i < 9; i++) {
		if (col != i && board[row][i] === board[row][col]) {
			return false;
		}
	}

	return true;
}

function fitsCol(board, row, col) {
	for (var i = 0; i < 9; i++) {
		if (row != i && board[i][col] === board[row][col]) {
			return false;
		}
	}

	return true;
}

function fitsSection(board, row, col) {
	var sectionRow = Math.floor(row / 3);
	var sectionCol = Math.floor(col / 3);

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			var checkRow = sectionRow * 3 + i;
			var checkCol = sectionCol * 3 + j;
			if ((checkRow != row || checkCol != col) && board[checkRow][checkCol] === board[row][col]) {
				return false;
			}
		}
	}

	return true;
}

module.exports.check = check;
module.exports.fitsConstraints = fitsConstraints;