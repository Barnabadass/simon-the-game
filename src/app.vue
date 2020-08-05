<template>
  <div id="app">
    <h1>Simon the Game</h1>
    <h2 id="gameover-message">{{ message }}</h2>
    <h2>Round: {{ round }}</h2>
    <label for="difficulty">
      Difficulty:
      <select id="difficulty" v-model="difficulty" :disabled="playing">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="difficult">Difficult</option>
      </select>
    </label>
    <div id="board">
      <button
        v-for="(button, index) in buttons"
        :style="{ backgroundColor: button.color }"
        :key="index+1"
        @click="clickButton(index, 'player')"
      ></button>
    </div>
    <button id="start-button" @click="toggleState">{{ playing ? "Stop" : "Start" }}</button>
    <audio v-for="(button, index) in buttons" :key="index" :ref="button.id">
      <source :src="button.soundSrc" />
    </audio>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      difficulty: "easy",
      playing: false,
      playersTurn: false,
      intervals: [1500, 1000, 400],
      interval: undefined,
      buttonsToClick: [],
      buttonsClicked: 0,
      message: "",
      round: 0,
      buttons: [
        {
          id: "choice1",
          color: "#78bcff",
          normal: "#78bcff",
          pressed: "#4589cc",
          soundSrc: "./dist/1.mp3",
        },
        {
          id: "choice2",
          color: "#ff9a8e",
          normal: "#ff9a8e",
          pressed: "#cc675b",
          soundSrc: "./dist/2.mp3",
        },
        {
          id: "choice3",
          color: "#fef585",
          normal: "#fef585",
          pressed: "#cbc252",
          soundSrc: "./dist/3.mp3",
        },
        {
          id: "choice4",
          color: "#d8eb73",
          normal: "#d8eb73",
          pressed: "#a5b840",
          soundSrc: "./dist/4.mp3",
        },
      ],
    };
  },
  methods: {
    async clickButton(buttonIndex, clicker) {
      if (clicker === "player" && !this.playersTurn) {
        return;
      }

      this.buttons[buttonIndex].color = this.buttons[buttonIndex].pressed;
      this.$refs["choice" + (buttonIndex + 1)][0].currentTime = 0;
      this.$refs["choice" + (buttonIndex + 1)][0].play();
      await new Promise((resolve) => setTimeout(resolve, 200));
      this.buttons[buttonIndex].color = this.buttons[buttonIndex].normal;

      if (clicker === "player") {
        this.checkPlayersTurn(buttonIndex);
      }
    },
    checkPlayersTurn(buttonIndex) {
      if (buttonIndex !== this.buttonsToClick[this.buttonsClicked]) {
        this.message = `You lost after ${this.round} round${this.round !== 1 ? "s" : ""}`;
        this.endGame();
      } else if (++this.buttonsClicked === this.round) {
        this.buttonsClicked = 0;
        this.playersTurn = false;
        this.startRound();
      }
    },
    toggleState() {
      this.playing = !this.playing;
      if (this.playing) {
        this.message = "";
        this.startRound();
      } else {
        this.endGame();
      }
    },
    endGame() {
      if (this.interval !== undefined) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
      this.playersTurn = false;
      this.playing = false;
      this.buttonsClicked = 0;
      this.round = 0;
      this.buttonsToClick.splice(0, this.buttonsToClick.length);
    },
    startRound() {
      if (++this.round === 1) {
        this.buttonsToClick.splice(
          0,
          this.buttonsToClick.length,
          Math.floor(Math.random() * 4)
        );
      } else {
        this.buttonsToClick.splice(
          this.buttonsToClick.length,
          this.buttonsToClick.length,
          Math.floor(Math.random() * 4)
        );
      }

      this.interval = setInterval(
        () => this.nextComputerClick(),
        this.intervals[["easy", "medium", "difficult"].indexOf(this.difficulty)]
      );
    },
    nextComputerClick() {
      if (this.buttonsClicked < this.round) {
        this.clickButton(this.buttonsToClick[this.buttonsClicked++]);
      }
      if (this.buttonsClicked === this.round) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.playersTurn = true;
        this.buttonsClicked = 0;
      }
    },
  },
};
</script>
