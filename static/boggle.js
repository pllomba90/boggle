class BoggleGame{
    constructor(boardId, secs=60){
        this.secs= secs;
        this.displayTimer();

        this.score = 0;
        this.words = new Set();
        this.board = $('#' + boardId);

        this.timer = setInterval(this.tick.bind(this), 1000);

    $(".add-word", this.board).on("submit", this.handleSubmit.bind(this));
    }

    displayWord(word){
        $('words', this.board.append($("<li>", {text: word})));
    }

    displayScore(){
        $(".score", this.board).text(this.score);
    }

    displayMessage(msg, cls){
        $(".msg", this.board)
          .text(msg)
          .removeClass()
          .addClass(`msg ${cls}`);
      }

    async handleSubmit(evt){
        evt.preventDefault();
        const $word = $(".word", this.board);
    
        let word = $word.val();
        if (!word) return;
    
        if (this.words.has(word)) {
          this.displayMessage(`Already found ${word}`, "err");
          return;
        }
    
     const resp = await axios.get("/check-word", { params: { word: word }});
    if (resp.data.result === "not-word") {
      this.displayMessage(`${word} is not a valid English word`, "err");
    } else if (resp.data.result === "not-on-board") {
      this.displayMessage(`${word} is not a valid word on this board`, "err");
    } else {
      this.displayWord(word);
      this.score += word.length;
      this.displayScore();
      this.words.add(word);
      this.displayMessage(`Added: ${word}`, "ok");
    }

    $word.val("").focus();
  }

  displayTimer(){
    $('.timer', this.board).text(this.secs)
  }

  async tick(){
    this.secs -= 1;
    this.displayTimer();

    if (this.secs === 0) {
      clearInterval(this.timer);
      await this.scoreGame();
    }
  }

  async scoreGame(){
    $(".add-word", this.board).hide();
    const resp = await axios.post("/update-score", { score: this.score });
    if (resp.data.brokeRecord) {
      this.displayMessage(`New record: ${this.score}`, "ok");
    } else {
      this.displayMessage(`Final score: ${this.score}`, "ok");
    }
  }
}
