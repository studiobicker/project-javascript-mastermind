
$(document).ready(function() {
  //Setup the gameboard
  setupGameBoard();
  setupSoundEffects();
  playGame();

  $(".play").click(function(){
    playSound("startaudio");
    setupGameBoard();
    playGame();
  })
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

const activateRow = (game,row) => {
  //add class active to row and class selected to first cell in table inside active row 
  row.addClass("active");
  row.find(".input table td:first").addClass("selected");

  //add event listeners to table cells of active rows
  row.find(".input table td").click(function(){
    clearAndSelect(game,$(this));
  });
}

const deActivateRow = row => {
  //remove class and event listeners from tablerow
  row.removeClass("active");
  row.find(".input table td").off();
}

const clearAndSelect = (game,tableCell) => {
  const columnNr = tableCell[0].cellIndex;

  //remove value from guessArray
  game.saveGuess(columnNr,null);
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

const playGame = () => {
  resetGameDOM();

  const mastermindGame = new MastermindGame();
  mastermindGame.generateSecretCode();

  const chronometer = new Chronometer(printTime);
  chronometer.startClick();

  //temporary show the secret code in the footer
  $("footer p").html(mastermindGame.secretCode);

  //activate the first row
  activateRow(mastermindGame,$("table tr:first"));

  $(".color-pegs .oval").click(function(){
    const colorPeg = $(this).data("color");

    //get column number of selected tableCell
    const tableCell = $(".active .selected");
    const columnNr = tableCell[0].cellIndex;

    $(".active .selected").addClass(colorPeg).removeClass("selected");

    mastermindGame.saveGuess(columnNr,colorPeg);

    playSound("coloraudio");
  
    //add class 'selected' to first empty tableCell
    const tableRow = tableCell.parent();
    tableRow.find("td:not([class]):first").addClass("selected");
  })

  $(".btn-check").click(function(){
    if ( isReadyForCheck(mastermindGame.guess) ) {
      //check the score of the guess
      const scoreResult = mastermindGame.scoreGuess();
      const scoreOvals = $(".active .score .oval");

      //display scores
      for (let i=0;i<scoreResult.length;i++) {
          $(scoreOvals[i]).addClass(scoreResult[i]);
          playSound("scoreaudio");
      }

      setTimeout(function(){
        const currentRow = $(".active");
        const nextRow = currentRow.closest('tr').next('tr');
        //check if game is finished
        if (mastermindGame.isFinished()) {
          deActivateRow(currentRow);
          //$(".btn-check, .color-pegs .oval").off();
          resetGameDOM();
          chronometer.stopClick();
          playSound("successaudio");
          alert('game over');
        } else {
          //de-activate the row and activate the next row
          deActivateRow(currentRow);
          activateRow(mastermindGame,nextRow);
          //empty the guess array before the next guess
          mastermindGame.resetGuess();
        }
      }, 100);
    }
  });  
}

const resetGameDOM = () => {
  $(".btn-check, .color-pegs .oval,.input table td").off();
}

const printTime = (minutes,seconds) => {
  printMinutes(minutes);
  printSeconds(seconds);
 }
 
 const printMinutes = min => {
   sMin = min.toString();
   $("#minDec").html(sMin.charAt(0));
   $("#minUni").html(sMin.charAt(1));
 }
 
 const printSeconds = sec => {
   sSec = sec.toString();
   $("#secDec").html(sSec.charAt(0));
   $("#secUni").html(sSec.charAt(1));
 }
 
const setupSoundEffects = () => {
  
}
 const playSound = sound => {
  var sound = document.getElementById(sound);
  sound.play()
}