/**
 * Created by tshushan on 18/07/2017.
 */

class CharCatcher {
  constructor() {
    this.LETTER_HEIGHT = 30;
    this.MAX_COLUMN = 50;
    this.GAME_SPEED = 200;
    this.lettersArr = [...'אבגדהוזחטיכלמנסעפצקרשת'];
    this.lettersArr2 = [...'tcdsvuzjyhfknbxgpmera,'];
    this.gameIntervalHandler = null;

    this.container = document.querySelector('.container');
    document.addEventListener('keypress', (event) => {
      this.handleKeyPress(event.key);
    }, false);
  }

  run() {
    this.gameIntervalHandler = setInterval(this.addChar.bind(this), this.GAME_SPEED);
  }

  pause() {
    this.gameIntervalHandler && clearInterval(this.gameIntervalHandler);
    this.gameIntervalHandler = null;
  }

  getRandomChar() {
    return this.lettersArr[Math.floor(Math.random() * this.lettersArr.length)];
  }

  getRandomColumn() {
    return Math.floor(Math.random() * this.MAX_COLUMN);
  }

  isRunning() {
    return !!this.gameIntervalHandler;
  }

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
    }, this.GAME_SPEED);
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
