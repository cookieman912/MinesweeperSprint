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
    timePassed: 0,
    minesNum: 0,
    lives: 3
}
var gMainMusic = new Audio('sounds/Fodlan-Winds.mp3');
gMainMusic.loop=true;
gMainMusic.volume=0.05;
var gExplodeSound= new Audio('sounds/explode.ogg');
var gWinSound= new Audio('sounds/win.mp3');
gWinSound.volume=0.05;
function init() {
    gGame.isOn = true;
    gBoard = buildBoard();
    renderBoard(gBoard, '.board-container') 
}

function changeDiff(difficultyValue) {
    restart();
    switch (difficultyValue) {
        case 0:
            gLevel.SIZE = 4;
            gLevel.MINES = 2;
            break;
        case 1:
            gLevel.SIZE = 8;
            gLevel.MINES = 12
            break;
        case 2:
            gLevel.SIZE = 12;
            gLevel.MINES = 30;
            break;
    }
    gBoard = buildBoard();
    renderBoard(gBoard, '.board-container');
}


function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };

        }
    }

    return board;
}

function generateMines() {
    var randLocations = [];
    for (var h = 0; h < gLevel.MINES; h++) {
        randLocations.push(getRandomSquareLocation(0, gLevel.SIZE))
    }
    randLocations = ensureRandomLocations(randLocations);
    gGame.minesNum = randLocations.length;
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var currLocation = { i: i, j: j }
            for (var k = 0; k < randLocations.length; k++) {
                if (currLocation.i === randLocations[k].i && currLocation.j === randLocations[k].j && gBoard[currLocation.i][currLocation.j].isShown === false) {
                    gBoard[i][j] = {
                        minesAroundCount: 0,
                        isShown: false,
                        isMine: true,
                        isMarked: false,
                    };
                }
            }

        }
    }
}

function ensureRandomLocations(randLocations) {
    for (var i = 0; i < randLocations.length; i++) {
        for (var j = i + 1; j < randLocations.length; j++) {
            if (randLocations[i].i === randLocations[j].i && randLocations[i].j === randLocations[j].j) {
                console.log('in!');
                randLocations[i] = getRandomSquareLocation(0, gLevel.SIZE)
                ensureRandomLocations(randLocations)
            }
        }
    }
    return randLocations;
}
function cellClicked(elCell) {
    if (gGame.isOn === false) { 
        return;
    }
    var location = getCellCoord(elCell.id)
    if (gIsFirstclick === true) {
        gMainMusic.play();
        startClock();
        showCell(location, elCell)
        generateMines();
        setMinesNegsCount();
        showCell(location, elCell)
        gIsFirstclick = false;
        return;
    }

    if (gBoard[location.i][location.j].isMine === true && gBoard[location.i][location.j].isMarked === false) {
        explodeMine(elCell);
    }
    else if (gBoard[location.i][location.j].minesAroundCount !== 0 && gBoard[location.i][location.j].isMarked === false) {
        showCell(location, elCell)

    }
    else if (gBoard[location.i][location.j].isMine === false && gBoard[location.i][location.j].isMarked === false) {
        showNegCells(location)
    }
}

function explodeMine(elCell) {
    gGame.lives--;
    gExplodeSound.play();
    var elLives = document.querySelector('.lives');
    if (gGame.lives === 2) {
        elLives.innerText = `Watch out! you only have ${gGame.lives} left!`
    }
    else {
        elLives.innerText = `Careful now! you are on your last life!`
    }
    elCell.innerHTML = "<img src=\"img/mine.jpg\"></img>";
    if (gGame.lives < 1) {
        loseGame();
    }
}

function showCell(location, elCell) {
    if (gBoard[location.i][location.j].minesAroundCount === 0) {
        elCell.innerText = 'safe';
        elCell.style.color='rgb(40, 21, 75)';
    }

    else {
        elCell.innerText = gBoard[location.i][location.j].minesAroundCount
        elCell.style.color='turquoise';
    }
    gBoard[location.i][location.j].isShown = true;
    gGame.shownCount++
    checkVictory();
}


function showNegCells(location) {
    var count = 0;

    for (var i = location.i - 1; i < location.i + 2; i++) {
        if (i < 0 || i > gBoard.length - 1) {
            continue;
        }
        for (var j = location.j - 1; j < location.j + 2; j++) {
            if (j < 0 || j > gBoard.length - 1) {
                continue;
            }
            count++;
            var strId = 'cell-' + i + '-' + j;
            var currLocation = getCellCoord(strId)
            var currElCell = document.querySelector(`#${strId}`)
            if (gBoard[i][j].minesAroundCount === 0 && gBoard[i][j].isShown === false) {
                currElCell.innerText = 'safe'
                gBoard[i][j].isShown = true;
                showNegCells(currLocation)
            }
            else if (gBoard[i][j].minesAroundCount === 0) {
                currElCell.innerText = 'safe'
                currElCell.style.color='rgb(40, 21, 75)';
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
        gGame.markedCount--;
        if (gBoard[location.i][location.j].isShown === true) {
            showCell(location, elCell)
        }

        else {
            elCell.innerHTML = "<img src=\"img/notshown.jpg\"></img>"
            gBoard[location.i][location.j].isMarked = false;
        }
    }
    else {
        elCell.innerHTML = "<img src=\"img/mark.jpg\"></img>";
        gBoard[location.i][location.j].isMarked = true;
        gGame.markedCount++;

    }
    checkVictory();
}

function setSingleMineNegsCount(location) {
    var count = 0;
    for (var i = location.i - 1; i < location.i + 2; i++) {
        if (i < 0 || i > gBoard.length - 1) {
            continue;
        }
        for (var j = location.j - 1; j < location.j + 2; j++) {
            if (j < 0 || j > gBoard.length - 1) {
                continue;
            }

            if (gBoard[i][j].isMine === true && gBoard[location.i][location.j].isMine === false) {
                count++;
            }
        }
    }
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
    gMainMusic.pause()
}
function checkVictory() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked === false && gBoard[i][j].isShown === false) {
                return;
            }
            if (gBoard[i][j].isMine === true && gBoard[i][j].isMarked === false || gGame.markedCount > gGame.minesNum) {
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
    var elWizard = document.querySelector('.wizard')
    elWizard.innerHTML = `<img onclick="restart()" src=\"img/winningwizard.png\"></img>`
    gWinSound.play();
}

function loseGame() {
    gameOver();
    var elTitle = document.querySelector('.title')
    elTitle.innerText = 'you lose...'
    var elWizard = document.querySelector('.wizard')
    elWizard.innerHTML = `<img onclick="restart()" src=\"img/deadwizard.png\"></img>`
}

function restart() {
    gGame.lives= 3;
    gIsFirstclick = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.timePassed = 0;
    gGame.minesNum = 0; 
    gLevel.SIZE = 4;
    gLevel.MINES = 2;
    var elLives=document.querySelector('.lives');
    elLives.innerText='You have 3 lives'

    var elTitle = document.querySelector('.title')
    elTitle.innerText = 'have another go!'


    stopClock();
    gGame.timePassed = 0;
    var elTimer = document.querySelector('.timer')
    elTimer.style.color = 'black'

    
    var elWizard = document.querySelector('.wizard')
    elWizard.innerHTML = `<img onclick="restart()" src=\"img/happywizard.png\"></img>`
    init();
    gWinSound.pause();


}

function startClock() {
    gGameTimeInterval = setInterval(function () {
        gGame.timePassed += 0.01
        var elTimer = document.querySelector('.timer')
        elTimer.style.color = 'violet'
        elTimer.innerText = gGame.timePassed.toFixed(3)

    }, 10)
}
function stopClock() {
    clearInterval(gGameTimeInterval);
}