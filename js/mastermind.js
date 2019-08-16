class MastermindGame {
  constructor(colors) {
    this.colors = colors;
    this.secretCode = [];
    this.numRows = 10;
    this.nextRow = 0;

  }

  generateSecretCode() {
    //randomly choose 4 colors from the six available colors
    for (let i=0;i < 4;i++) {
      this.secretCode[i] = this.colors[Math.floor( Math.random() * this.colors.length )];
    }
  }

  scoreGuess(guess) {
    this.nextRow++
    const score = [];
    for (let i=0;i<guess.length;i++) {
      if (this.secretCode.indexOf(guess[i]) === -1 ) {
        score[i] = null;
      } else if (this.secretCode[i] === guess[i]) {
        score[i] = "great";
      } else {
        score[i] = "good";
      }
    }
    return score.sort();
  }

  isFinished(){

  }


}