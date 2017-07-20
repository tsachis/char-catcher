/**
 * Created by tshushan on 18/07/2017.
 */

class CharCatcher {
  constructor() {
    this.LETTER_HEIGHT = 30;
    this.MAX_COLUMN = 50;
    this.BACKGROUNDS = 3;
    this.LEVEL_SIZE = 100;
    this.levels = [500, 300, 200, 100, 50];
    this.level = 0;
    this.MAX_ROW = 10;
    this.lettersArr = [...'אבגדהוזחטיכלמנסעפצקרשת'];
    this.lettersArr2 = [...'tcdsvuzjyhfknbxgpmera,'];
    this.gameIntervalHandler = null;
    this.container = document.querySelector('.container');
    this.container.classList.add(this.getRandomBackground());
    this.score = 0;
    document.addEventListener('keypress', (event) => {
      this.handleKeyPress(event.key);
    }, false);
    this.renderPanel();
  }

  run() {
    const currSpeed = this.levels[this.level] || this.levels[this.levels.length -1];
    this.gameIntervalHandler = setInterval(this.addChar.bind(this), currSpeed);
  }

  pause() {
    this.gameIntervalHandler && clearInterval(this.gameIntervalHandler);
    this.gameIntervalHandler = null;
  }

  changeLevel(newLevel) {
    this.level = newLevel;
    this.pause();
    this.run();
  }

  getRandomBackground() { return `background-${Math.floor(Math.random() * this.BACKGROUNDS) + 1}` };

  getRandomChar() { return this.lettersArr[Math.floor(Math.random() * this.lettersArr.length)]; }

  getRandomColumn() { return Math.floor(Math.random() * this.MAX_COLUMN); }

  isRunning() { return !!this.gameIntervalHandler; }

  addChar() {
    const col = this.getRandomColumn();
    const char = this.getRandomChar();
    const charEl = document.createElement('div');
    charEl.classList.add('letter');
    charEl.classList.add(`letter-col-${col}`);
    charEl.classList.add(`letter-${this.lettersArr.indexOf(char)}`);
    charEl.innerText = char;
    charEl.style.left = `${Math.floor(col * 98 / this.MAX_COLUMN)}%`;
    charEl.dataset.col = col;
    charEl.dataset.row = document.querySelectorAll(`.letter-col-${col}`).length;
    this.container.appendChild(charEl);
    this.moveLetterToBottom(charEl);
  }

  moveLetterToBottom(el) {
    setTimeout(() => {
      const bottom = el.dataset.row * this.LETTER_HEIGHT;
      el.style.bottom = `${bottom}px`;
      el.gameOverChecker = this.checkGameOver.bind(this, el);
      el.addEventListener("transitionend", el.gameOverChecker, false);
    }, 100);
  }

  checkGameOver(el) {
    el.removeEventListener("transitionend", el.gameOverChecker, false);
    if (this.isRunning() && el.dataset.row > this.MAX_ROW) {
      console.log('Game Over');
      this.pause();
    }
  }

  updateScore(points) {
    this.score += points;
    const newLevel = Math.floor(this.score / this.LEVEL_SIZE);
    if (newLevel > this.level) {
      this.changeLevel(newLevel);
    }
    this.renderPanel();
  }

  renderPanel() {
    document.querySelector('.score').innerText = `נקודות: ${this.score}`;
    document.querySelector('.level').innerText = `שלב: ${this.level + 1}`;
  }

  handleKeyPress(char) {
    if (char === ' ') {
      return this.isRunning() ? this.pause() : this.run();
    }
    if (this.isRunning()) {
      let index = this.lettersArr.indexOf(char);
      index = index >= 0 ? index : this.lettersArr2.indexOf(char);
      if (index >= 0) {
        const lettersToRemove = document.querySelectorAll(`.letter-${index}`);
        this.updateScore(lettersToRemove.length);
        const colsToCheck = [];
        lettersToRemove.forEach(letter => {
          colsToCheck.push(letter.dataset.col);
          this.container.removeChild(letter);
        });
        colsToCheck.forEach(col => {
         const letterInCol = Array.from(document.querySelectorAll(`.letter-col-${col}`))
              .sort((a, b) => a.dataset.row - b.dataset.row);
         letterInCol.forEach((el, index) => {
           el.dataset.row = index;
           el.style.transitionDuration = '100ms';
           this.moveLetterToBottom(el);
         });
        });
      }
    }
  }
}

(function() {
  const charCatcher = new CharCatcher();
  charCatcher.run();
})();
