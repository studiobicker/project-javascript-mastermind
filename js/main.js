let chronometer;
let mastermindGame;
let startAudio;
let colorAudio;
let scoreAudio;
let successAudio;
let failAudio;


$(document).ready(function() {
  //Initialise the chronometer
  chronometer = new Chronometer(printTime);

  //Set the sound effects
  startAudio = $("#startaudio");
  colorAudio = $("#coloraudio");
  scoreAudio = $("#scoreaudio");
  successAudio = $("#successaudio");
  failAudio = $("#failaudio");

  //Start the game on window load
  startGame();

  //(re-)start the game when New Game is clicked
  $(".play").click(function() {
    $("#game_over").css({'visibility':'hidden','opacity':0});
    $('#game-board').html(gameBoardHTML());

    playSound(startAudio);
    startGame();
  })

  //Handle navigation links
  $(".link").click(function(){
    const $this = $(this);
    const showContent = $this.data("id");
    $(showContent).addClass("toggled-on");
  })

  $(".close").click(function(){
    const $this = $(this);
    const hideContent = $this.data("id");
    $(hideContent).removeClass();
  })


  //Stop playing the game after you finished a game
  $(".stopgame").click(function(){
    $("#game_over").css({'visibility':'hidden','opacity':0});
  })

  $('#soundSwitch').change(function() {
    if ($(this).is(":checked")) {
      soundOn = true;  //it is checked
    } else {
      soundOn = false;
    }
    soundToggle(soundOn);
  });

});

const gameBoardHTML = () => {
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

  return html;
}

const colorPegsHTML = levelArr => {
  let html = '';
  for (let i=0;i<levelArr.length;i++) {
    html += `<div data-color="${levelArr[i]}" class="oval ${levelArr[i]}"></div>`
  }
  return html;
}

const startGame = () => {
  //Setup the gameboard
  $('#game-board').html(gameBoardHTML());

  //Setup level (=number of colors) of game
  const beginner = ["red", "blue", "green", "orange", "purple", "pink"];
  const intermediate = ["red", "blue", "green", "orange", "purple", "pink", "yellow"];
  const advanced = ["red", "blue", "green", "orange", "purple", "pink", "yellow", "grey"];
  const level =  $( "#level" ).val();
  $('.game-control .color-pegs').html(colorPegsHTML(eval(level)));

  //Create instance of the game
  mastermindGame = new MastermindGame(getOption("#sameColor"), eval(level));
  mastermindGame.generateSecretCode();

  //Start the chronometer and stop the 'previous' chronometer when you restart the game
  if(chronometer) {
    chronometer.stopClick();
    chronometer.resetClick();
  }
  chronometer.startClick();

  //show the secret code in the source code if debug option is on
  if(getOption("#debug")) {
    $("body").append(`<!--${mastermindGame.secretCode}-->`);
  }

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

      playSound(colorAudio);
    
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
          playSound(scoreAudio);
      }

      setTimeout(function(){
        const currentRow = $(".active");
        const nextRow = currentRow.closest('tr').next('tr');
        let gameOverAudio;
   
        //check if game is finished
        if (mastermindGame.isFinished()) {
          resetGameDOM();
          chronometer.stopClick();

          if(mastermindGame.numCorrect === 4 ) {
            $("#game_over h2").html("You won!!!");
            gameOverAudio = successAudio;
          } else {
            $("#game_over h2").html("Game over");
            gameOverAudio = failAudio;
          }
          $("#game_over").css({'visibility':'visible','opacity':1});         
          playSound(gameOverAudio);
        } else {
          //de-activate the current row and activate the next row
          activateRow(nextRow,currentRow);
          //empty the guess array before the next guess
          mastermindGame.resetGuess();
        }
      }, 100);
    }
  });  
}

const activateRow = (nextrow,currow) => {
  if (currow) {
    //remove class and event listeners from tablerow
    currow.removeClass("active");
    currow.find(".input table td").off();
  }
  //add class active to row and class selected to first cell in table inside active row 
  nextrow.addClass("active");
  nextrow.find(".input table td:first").addClass("selected");

  //add event listeners to table cells of active rows
  nextrow.find(".input table td").click(function(){
    clearAndSelect($(this));
  });
}

const clearAndSelect = (tableCell) => {
  const columnNr = tableCell[0].cellIndex;

  //remove value from guessArray
  mastermindGame.saveGuess(columnNr,null);
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
 
const soundToggle = soundOn => {
  $('audio').each(function(){
    if (!soundOn ) {
      $(this).prop("muted",true);
    } else {
      $(this).prop('muted',false);
    }
  });
};

const playSound = sound => {
  sound[0].play();
}

const getOption = (option) => {
  let optionValue = false;
  if ($(option).is(":checked")) {
    optionValue = true;  //it is checked
  }
  return optionValue;

}