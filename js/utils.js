function renderBoard(mat, selector) {
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var tdId = 'cell-' + i + '-' + j;
        strHTML +=  `<td id="${tdId}"  oncontextmenu  ="toggleMarkCell(this)" onclick="cellClicked(this)"><img src="img/notshown.jpg"> </td>`

        }
    
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
  console.table(mat)
}

// location such as: {i: 2, j: 7}
// function renderCell(location, value) {
//   // Select the elCell and set the value
//   var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
//   // if (elCell===GHOST)
//   elCell.style.color = value.color
//   elCell.innerHTML = value;
// }

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomColor() {
  var randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return randomColor
}

function getCellCoord(strCellId) {
  var coord = {};
  var parts = strCellId.split('-');
  coord.i = +parts[1];
  coord.j = +parts[2];
  return coord;
}


function getRandomSquareLocation(min,max){
  var randomLocation={i:getRandomInt(min,max), j:getRandomInt(min,max)}
  return randomLocation;
}
