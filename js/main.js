const colors = ["red", "blue", "green", "orange", "purple", "pink"];
let mastermindGame = new MastermindGame(colors);
let guess = [];

$(document).ready(function() {

  $(".color-pegs .oval").click(function(){
    const $this = $(this);
    setColor($this);
  
    if ( guess.length > 3 ) {
      console.log(guess);
      debugger;
    }

  })

});

const setColor = color => {
  const colorPeg = color.data("color");
  guess.push(colorPeg);

  $(".active .selected").addClass(colorPeg);
  $(".active .selected").removeClass("selected").next().addClass("selected");

}