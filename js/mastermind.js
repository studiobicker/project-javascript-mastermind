class MastermindGame {
  constructor(colors) {
    this.colors = colors;
    this.secretCode = [];
    this.numCorrect = 0;
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
    let scoreCorrect = 0;
    for (let i=0;i<guess.length;i++) {
      if (this.secretCode.indexOf(guess[i]) === -1 ) {
        score[i] = null;
      } else if (this.secretCode[i] === guess[i]) {
        score[i] = "bothgood";
        scoreCorrect++;
      } else {
        score[i] = "colorgood";
      }
    }
    this.numCorrect = scoreCorrect;
    return score.sort();
  }

  isFinished(){
    if(this.numRows === this.nextRow || this.numCorrect === 4) {
      return true;
    } else {
      return false;
    }
  } 
}

class Chronometer {
  constructor(show) {
    this.currentTime = 0;
    this.intervalId = null;
    this.showTime = show
  }
  
  startClick() {
    this.intervalId = setInterval(()=>{
      //debugger;
      this.currentTime++
      this.showTime(...this.setTime())
    },1000);
  }
  
  getMinutes() {
    const minutes = Math.floor(this.currentTime / 60);
    return minutes;
  }
  
  getSeconds() {
    const seconds = this.currentTime - this.getMinutes() * 60;
    return seconds;
  }
  
  twoDigitsNumber(aNum) {
    const twoDigits = aNum.toString().length > 1 ? aNum : "0"+aNum;
    return twoDigits;
  }

  setTime() {
    const minutes = this.twoDigitsNumber(this.getMinutes());
    const seconds = this.twoDigitsNumber(this.getSeconds());
    return [minutes,seconds];
  }

  stopClick() {
    clearInterval(this.intervalId);
  }
  
  resetClick() {
    this.currentTime = 0;
  }

}