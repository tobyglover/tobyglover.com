window.addEventListener('DOMContentLoaded', init, false);

function init() {
	board = document.getElementById("board");
	boardData = initBoardData();
	document.getElementById("submit").addEventListener("click", validate);

	for (var sectionRow = 0; sectionRow < 3; sectionRow++) {
		var row = document.createElement("div");
		row.className = "row";
		for (var sectionCol = 0; sectionCol < 3; sectionCol++) {
			row.appendChild(drawSection(sectionRow, sectionCol));
		}
		board.appendChild(row);
	}
}

function initBoardData() {
	var boardData = []
	for (var i = 0; i < 9; i++) {
		boardData.push(Array(9).fill(null));
	}
	return boardData;
}

function drawSection(sectionRow, sectionCol) {
	var section = document.createElement("div");
	section.className = "section";

	for (var row = 0; row < 3; row++) {
		for (var col = 0; col < 3; col++) {
			section.appendChild(createCell(sectionRow * 3 + row, sectionCol * 3 + col));
		}
		section.appendChild(document.createElement("br"));
	}
	return section;
}

function createCell(row, col) {
	var cell = document.createElement("input");
	cell.className = "cell";
	cell.type = "text";
	cell.addEventListener("keyup", function(e) {
		if (parseInt(cell.value) < 10) {
			updateBoardData(row, col, parseInt(cell.value));
		} else if (cell.value == "") {
			updateBoardData(row, col, null);
		} else {
			cell.value = cell.value.charAt(0);
		}
	});
	cell.addEventListener("keydown", blockCharacters);
	return cell;
}

function blockCharacters(e) {
	// Allow: backspace, delete, home, end, left, right
	var k = e.keyCode;
    if (k == 8 || k == 46 || (k >= 35 && e.keyCode <= 39)) {
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }

}

function updateBoardData(row, col, data) {
	boardData[row][col] = data;
}

function validate(e) {
	var totalValues = 0;

	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] > 10 || board[i][j] < 0) {
				window.alert("Invalid value on board");
				return;
			}
			if (boardData[i][j]) {
				totalValues++;
			}
		}
	}

	if (totalValues < 10) {
		window.alert("Please enter at least 10 values to start");
	} else {
		submit()
	}
}

function submit() {
	var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                resData = JSON.parse(this.responseText);
            } else {
            	window.alert("There was an error processing your request");
            }
        }
    };

    xhr.open("POST", "/api/sudoku", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(boardData));
    showProcessing();
}

function showProcessing() {
	document.getElementById("loading").style["display"] = "block";
}

function hideProcessing() {
	document.getElementById("loading").style["display"] = "none";
}




