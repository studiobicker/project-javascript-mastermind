const colors = ["red", "blue", "green", "orange", "purple", "pink"];
const mastermindGame = new MastermindGame(colors);
mastermindGame.generateSecretCode();
let guess = [null, null, null, null];

$(document).ready(function() {
  //temporary show the secret code in the footer
  $("footer p").html(mastermindGame.secretCode);

  //Setup the gameboard
  setupGameBoard();
  const tableRow = $("table tr:first");
  //Activate the first row
  activateRow(tableRow);

  $(".color-pegs .oval").click(function(){

    setColor($(this));
  })

  $(".btn-check").click(function(){

    if ( isReadyForCheck(guess) ) {
      //check the score of the guess
      const scoreResult = mastermindGame.scoreGuess(guess);
      const scoreOvals = $(".active .score .oval");

      //display scores
      for (let i=0;i<scoreResult.length;i++) {
        $(scoreOvals[i]).addClass(scoreResult[i]);
      }

      setTimeout(function(){
        const currentRow = $(".active");
        const nextRow = currentRow.closest('tr').next('tr');
        //check if game is finished
        if (mastermindGame.isFinished()) {
          deActivateRow(currentRow);
          $(".btn-check, .color-pegs .oval").off();
          alert('game over');
        } else {
          //de-activate the row and activate the next row
          deActivateRow(currentRow);
          activateRow(nextRow);
          //empty the guess array before the next guess
          guess = [null,null,null,null];
        }
      }, 100);


    }
  });  

});

const setupGameBoard = () => {
  let html = '';
  html += '<table class="board">';
  for (let i=0;i<10;i++) {
    html += '<tr>';
    html += '<td class="ind"></td>';
    html += '<td class="input"><table><tr>';
    for (let j=0;j<4;j++) {
      html += '<td><div class="oval"></div></td>';
    }
    html += '</tr></table></td>';
    html += '<td class="score">';
    html += '<table>';
    for (let j=0;j<2;j++) {
      html += '<tr>'
      for (let k=0;k<2;k++) {
        html += '<td><div class="small oval"></div></td>';
      }
      html += '</tr>'
    }
    html += '</table></td>';
  }
  html += '</table>';
  $('#game-board').html(html);

}

const activateRow = row => {
  //add class active to row and class selected to first cell in table inside active row 
  row.addClass("active");
  row.find(".input table td:first").addClass("selected");

  //add event listeners to table cells of active rows
  row.find(".input table td").click(function(){
    clearAndSelect($(this));
  });
}

const deActivateRow = row => {
  //remove class and event listeners from tablerow
  row.removeClass("active");
  row.find(".input table td").off();
}

const setColor = color => {
  const colorPeg = color.data("color");
  const tableCell = $(".active .selected");
  const columnNr = tableCell[0].cellIndex;
  const tableRow = tableCell.parent();

  $(".active .selected").addClass(colorPeg).removeClass("selected");
  guess[columnNr] = colorPeg;

  // add class 'selected' to first empty tableCell
  tableRow.find("td:not([class]):first").addClass("selected");
}

const clearAndSelect = tableCell => {
  const columnNr = tableCell[0].cellIndex;

  //remove value from guessArray
  guess[columnNr] = null;
  //remove class 'selected' from other tableCell
  tableCell.parent().find("td.selected").removeAttr("class");
  //remove color from current tableCell and add class selected to current tableCell
  tableCell.removeClass().addClass("selected");

}

const isReadyForCheck = (guessArray) => {
  for (let color of guessArray) {
    if (!color) {
      return false;
    }
  }
  return true;
}