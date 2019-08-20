let chronometer;
let mastermindGame;

$(document).ready(function() {
  //Setup the gameboard
  setupGameBoard();
  //setupSoundEffects();
  chronometer = new Chronometer(printTime);
  startGame();

  $(".play").click(function(){
    playSound("startaudio");
    setupGameBoard();
    startGame();
  })

  $(".stopgame").click(function(){
    $("#game_over").css({'visibility':'hidden','opacity':0});
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

const activateRow = (row) => {
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

const clearAndSelect = (tableCell) => {
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

const startGame = () => {
  resetGameDOM();

  mastermindGame = new MastermindGame();
  mastermindGame.generateSecretCode();

  //stop the 'previous' chronometer when you restart the game
  if(chronometer) {
    chronometer.stopClick();
    chronometer.resetClick();
  }
  chronometer.startClick();

  //temporary show the secret code in the footer
  $("footer p").html(mastermindGame.secretCode);

  //activate the first row
  activateRow($("table tr:first"));

  $(".color-pegs .oval").click(function(){
    const colorPeg = $(this).data("color");

    //get column number of selected tableCell
    const tableCell = $(".active .selected");
    if (tableCell.length > 0) {
      const columnNr = tableCell[0].cellIndex;

      $(".active .selected").addClass(colorPeg).removeClass("selected");

      mastermindGame.saveGuess(columnNr,colorPeg);

      playSound("coloraudio");
    
      //add class 'selected' to first empty tableCell
      const tableRow = tableCell.parent();
      tableRow.find("td:not([class]):first").addClass("selected");
    }
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
          resetGameDOM();
          chronometer.stopClick();
          $("#game_over").css({'visibility':'visible','opacity':1});
          playSound("successaudio");
        } else {
          //de-activate the row and activate the next row
          deActivateRow(currentRow);
          activateRow(nextRow);
          //empty the guess array before the next guess
          mastermindGame.resetGuess();
        }
      }, 100);
    }
  });  
}

const resetGameDOM = () => {
  $(".btn-check, .color-pegs .oval,.input table td").off().css({cursor:'unset'});
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