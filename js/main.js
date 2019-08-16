const colors = ["red", "blue", "green", "orange", "purple", "pink"];
const mastermindGame = new MastermindGame(colors);
mastermindGame.generateSecretCode();
let guess = [];

$(document).ready(function() {
  //temporary show the secret code in the footer
  $("footer p").html(mastermindGame.secretCode);

  //Setup the gameboard
  setupGameBoard();

  $(".color-pegs .oval").click(function(){

    setColor($(this));

    //debugger;
    if ( isReadyForCheck(guess) ) {
      //activate check-button
      $(".btn").addClass("btn-check");

      $(".btn-check").click(function(){
        //de-activate checkbutton
        $(this).removeClass("btn-check");
        $(this).off();

        //check the score of the guess
        const scoreResult = mastermindGame.scoreGuess(guess);
        const scoreOvals = $(".active .score .oval");

        //display scores
        for (let i=0;i<scoreResult.length;i++) {
          $(scoreOvals[i]).addClass(scoreResult[i]);
        }

        //de-activate the row and activate the next row
        activateRow($(`.row:eq(${mastermindGame.nextRow})`), $(`.row:eq(${mastermindGame.nextRow - 1})`));

        //empty the guess array before the next guess
        guess = [];
      });
    }

  })

});

const setupGameBoard = () => {
  let html = '';
  for (let i=0;i<10;i++) {
    html += '<div class="row">';
    html += '<div class="pattern">';
    for (let j=0;j<4;j++) {
      html += '<div class="oval"></div>';
    }
    html += '</div>';
    html += '<div class="score">';
    for (let j=0;j<4;j++) {
      html += '<div class="small oval"></div>';
    }
    html += '</div>';
    html += '</div>';
  }
  $('#game-board').html(html);
  activateRow($(`.row:eq(${mastermindGame.nextRow})`));
}

const activateRow = (row, prow)=> {
  //remove class and event handlers if there is a previous row
  if (prow) {
    prow.removeClass("active");
    prow.find(".pattern .oval").off();
  } 

  //add class to row and first oval in the row
  row.addClass("active");
  row.find(".pattern .oval").first().addClass("selected");

  //add event handlers to the ovals in the active row
  row.find(".pattern .oval").click(function(){
    clearAndSelect($(this));
  });
}

const setColor = color => {
  const colorPeg = color.data("color");/* 
  const arrayOfOvals = [...$(".active .pattern .oval")];

  for (let i=0;i<arrayOfOvals;i++) {
    if (arrayOfOvals[i].hasClass("selected")) {
      debugger;
      guess[i] = colorPeg
    }
  } */

  $(".active .selected").addClass(colorPeg);
  guess.push(colorPeg);
  // const listClass = color.class()

  $(".active .selected").removeClass("selected").next().addClass("selected");
}

const clearAndSelect = oval => {
  //remove selected class from prev/next oval
  oval.parent().find(".selected").removeClass("selected");
  //remove all classes from current oval and add class oval and selected
  oval.removeClass().addClass("oval selected");
}

const isReadyForCheck = (guessArray) => {
  guessArray.forEach(function(color) {
    //debugger;
    console.log(color);
    if (!color) {
      return false;
    }   
  });
  return;
}