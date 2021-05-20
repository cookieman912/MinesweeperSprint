'use strict'
document.addEventListener('contextmenu', event => event.preventDefault());

function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var tdId = 'cell-' + i + '-' + j;
      strHTML += `<td id="${tdId}"  oncontextmenu  ="toggleMarkCell(this)" onclick="cellClicked(this)"><img src="img/notshown.jpg"> </td>`
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderHints() {
  var strHTML = '';
  for (var i = 0; i < gHints.length; i++) {
    strHTML += `<img src="img/hint.png" id="${i}" onclick="toggleHint(this)"=>`
  }
  var hintsContainer = document.querySelector('.hints');
  hintsContainer.innerHTML = strHTML
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getCellCoord(strCellId) {
  var coord = {};
  var parts = strCellId.split('-');
  coord.i = +parts[1];
  coord.j = +parts[2];
  return coord;
}


function getRandomSquareLocation(min, max) {
  var randomLocation = { i: getRandomInt(min, max), j: getRandomInt(min, max) }
  return randomLocation;
}

