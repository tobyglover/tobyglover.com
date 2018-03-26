window.addEventListener('DOMContentLoaded', init, false);

function init() {
	board = document.getElementById("board");
	boardData = initBoardData();
	countNums = 0;
	clearBtn = document.getElementById("clear");
	document.getElementById("submit").addEventListener("click", validate);
	clearBtn.addEventListener("click", clear);

	for (var sectionRow = 0; sectionRow < 3; sectionRow++) {
		var row = document.createElement("div");
		row.className = "row";
		for (var sectionCol = 0; sectionCol < 3; sectionCol++) {
			row.appendChild(drawSection(sectionRow, sectionCol));
		}
		board.appendChild(row);
	}
}

function clear() {
	if (!clearBtn.disabled && window.confirm("Are you sure you want to clear?")) {
		board.innerHTML = "";
		init();
	}
}

function clearSolution() {
	var solutionCells = document.getElementsByClassName("solved");
	while(solutionCells.length > 0) {
		solutionCells[0].value = "";
		solutionCells[0].className = "cell";
	}

	clearBtn.removeEventListener("click", clearSolution);
	clearBtn.addEventListener("click", clear);

	clearBtn.innerHTML = "Clear";
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
	cell.autocomplete = "off";
	cell.id = row.toString() + col.toString();
	cell.addEventListener("keydown", function(e) {
		blockCharacters(e, cell, row, col);
	});
	cell.addEventListener("keyup", function(e) {
		updateBoardData(row, col, parseInt(cell.value));
	});
	return cell;
}

function blockCharacters(e, cell, row, col) {
	// Allow: backspace, delete, home, end, left, right
	var k = e.keyCode;

    if (k == 8 || k == 46) {
        return;
    }
    // Ensure that it is a number and stop the keypress
    if (cell.value != "" || ((e.shiftKey || (e.keyCode < 49 || e.keyCode > 57)) && (e.keyCode < 97 || e.keyCode > 105))) {
        e.preventDefault();
    }
}

function updateBoardData(row, col, data) {
	if (data) {
		countNums++;
	} else {
		data = null;
		countNums--;
	}
	boardData[row][col] = data;
	boardDataChanged();
}

function boardDataChanged() {
	if (countNums > 0) {
		clearBtn.disabled = false;
	} else {
		clearBtn.disabled = true;
	}
}

function validate(e) {
	if (countNums < 15) {
		window.alert("Please enter at least 15 values to start");
		return;
	}

	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (boardData[i][j] > 10 || boardData[i][j] < 0) {
				window.alert("Invalid value on board");
				return;
			}
		}
	}

	submit()
}

function submit() {
	var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
        	var resData = JSON.parse(this.responseText);

            if (this.status == 200) {
                var board = resData.board;
                drawSolvedBoard(board);
            } else {
            	if (resData) {
            		window.alert(resData.reason);
            	} else {
            		window.alert("There was an error processing your request");
            	}
            }
            hideProcessing();
        }
    };

    xhr.open("POST", "/api/sudoku", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(boardData));
    showProcessing();
}

function drawSolvedBoard(board) {
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			var cell = document.getElementById(row.toString() + col.toString());
			if (cell.value == "") {
				cell.className = cell.className + " solved";
				cell.value = board[row][col];
			}
		}
	}
	clearBtn.removeEventListener("click", clear);
	clearBtn.addEventListener("click", clearSolution);

	clearBtn.innerHTML = "Clear Solution";
}

function showProcessing() {
	document.getElementById("loading").style["display"] = "block";
}

function hideProcessing() {
	document.getElementById("loading").style["display"] = "none";
}




