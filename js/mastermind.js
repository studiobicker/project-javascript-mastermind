class MastermindGame {
  constructor() {
    this.colors = ["red", "blue", "green", "orange", "purple", "pink"];
    this.guess = [null, null, null, null];
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
  scoreGuess() {
    const score = [];
    let copySecretCode = [...this.secretCode];
    let scoreCorrect = 0;
    
    //check if color and position is correct. 
    for (let i=0;i<4;i++) {
      if(this.guess[i] === copySecretCode[i]) {
        scoreCorrect++;
        score.push('black');
        this.guess[i] = copySecretCode[i] = NaN;
      }
    } 
    //check if color is correct
    for (let j=0;j<4;j++) {
      for(let k=0;k<4;k++) {
        if(this.guess[j] === copySecretCode[k]) {
          score.push('white');
          this.guess[j] = copySecretCode[k] = NaN;
        }
      }
    }
    this.numCorrect = scoreCorrect;
    this.nextRow++
    return score;
  }
  saveGuess(i,color) {
    this.guess[i] = color;
  }
  resetGuess() {
    this.guess = [null,null,null,null];
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
    this.intervalId = setInterval(() => {
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