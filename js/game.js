'use strict'
var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
}
var gIsFirstclick = true;
var gGameTimeInterval;
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    timePassed: 0
}

function init() {
    gGame.isOn = true;
    gBoard = buildBoardEasy();
    setMinesNegsCount();
    renderBoard(gBoard, '.board-container')
    console.table(gBoard)
}

function buildBoardEasy() {
    var randLocation1 = getRandomSquareLocation(0, 4);
    var randLocation2 = getRandomSquareLocation(0, 4);
    var size = 4;
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            var currLocation = { i: i, j: j }
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };

            if ((currLocation.i === randLocation1.i && currLocation.j === randLocation1.j)
                || (currLocation.i === randLocation2.i && currLocation.j === randLocation2.j)) {
                board[i][j] = {
                    minesAroundCount: 0,
                    isShown: false,
                    isMine: true,
                    isMarked: false,
                };
            }
        }
    }

    return board;
}


function cellClicked(elCell) {
    if (gGame.isOn === false) {
        return;
    }

    if (gIsFirstclick === true) {
        startClock();
        gIsFirstclick = false;
    }
    var location = getCellCoord(elCell.id)
    if (gBoard[location.i][location.j].isMine === true) {
        console.log('mine!');
        explodeMine(elCell);
    }
    else if (gBoard[location.i][location.j].minesAroundCount !== 0) {
        console.log(location);
        console.log('in');
        showCell(location, elCell)

    }
    else {
        console.log(gBoard[location.i][location.j].minesAroundCount, 'inside showcell!s');
        showNegCells(location)
    }
}

function explodeMine(elCell) {
    console.log(elCell.innerHTML);
    elCell.innerHTML = "<img src=\"img/mine.jpg\"></img>";
    loseGame();
}

function showCell(location, elCell) {
    if (gBoard[location.i][location.j].minesAroundCount === 0) {
        elCell.innerText = 'safe!';
    }

    else {
        elCell.innerText = gBoard[location.i][location.j].minesAroundCount
    }
    gBoard[location.i][location.j].isShown = true;
    gGame.shownCount++
    checkVictory();
}


function showNegCells(location,) {

    for (var i = location.i - 1; i < location.i + 2; i++) {
        if (i < 0 || i > gBoard.length - 1) {
            console.log('i is out of bounds');
            continue;
        }
        for (var j = location.j - 1; j < location.j + 2; j++) {
            if (j < 0 || j > gBoard.length - 1) {
                console.log('j is out of bounds');
                continue;
            }
            var strId = 'cell-' + i + '-' + j;
            var currLocation = getCellCoord(strId)
            var currElCell = document.querySelector(`#${strId}`)
            if (gBoard[i][j].minesAroundCount === 0) {
                currElCell.innerText = 'safe!'
                gBoard[i][j].isShown = true;

            }
            else {
                currElCell.innerText = gBoard[currLocation.i][currLocation.j].minesAroundCount
                gBoard[i][j].isShown = true;
            }
            gGame.shownCount++
        }
    }
    checkVictory();
}



function toggleMarkCell(elCell) {
    var location = getCellCoord(elCell.id)
    if (gGame.isOn === false) {
        return;
    }
    if (elCell.innerHTML === '<img src="img/mark.jpg">') {
        elCell.innerHTML = "<img src=\"img/notshown.jpg\"></img>"
        gBoard[location.i][location.j].isMarked = false;
        gGame.markedCount--;
    }
    else {
        elCell.innerHTML = "<img src=\"img/mark.jpg\"></img>";
        gBoard[location.i][location.j].isMarked = true;
        gGame.markedCount++;

    }
    console.log('marked count', gGame.markedCount);
    checkVictory();
}

function setSingleMineNegsCount(location) {
    var count = 0;
    for (var i = location.i - 1; i < location.i + 2; i++) {
        if (i < 0 || i > gBoard.length - 1) {
            // console.log('i is out of bounds');
            continue;
        }
        for (var j = location.j - 1; j < location.j + 2; j++) {
            if (j < 0 || j > gBoard.length - 1) {
                // console.log('j is out of bounds');
                continue;
            }

            if (gBoard[i][j].isMine === true && gBoard[location.i][location.j].isMine === false) {
                console.log('has a mine neighbour!');
                count++;
            }
        }
    }
    // console.log('count!', count);
    return count;
}
function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard.length; j++) {
            var count = setSingleMineNegsCount({ i: i, j: j })
            gBoard[i][j].minesAroundCount = count;
        }
    }
}

function gameOver() {
    gGame.isOn = false;
    stopClock();
}
function checkVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked === false && gBoard[i][j].isShown === false) {
                return;
            }
            if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false || gGame.markedCount > 2) {
                return;
            }
        }
    }
    winGame();
}
function winGame() {
    gameOver();
    var elTitle = document.querySelector('.title')
    elTitle.innerText = 'you win!'
}

function loseGame() {
    gameOver();
    var elTitle = document.querySelector('.title')
    elTitle.innerText = 'you lose...'
}
















function startClock() {
    gGameTimeInterval = setInterval(function () {
        gGame.timePassed += 0.01
        var elTimer = document.querySelector('.timer')
        elTimer.style.visibility = 'visible'
        elTimer.innerText = gGame.timePassed.toFixed(3)

    }, 10)
}
function stopClock() {
    clearInterval(gGameTimeInterval);
}