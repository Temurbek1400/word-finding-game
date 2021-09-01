document.addEventListener("DOMContentLoaded", () => {
  const page_1 = document.querySelector('.page_1');
  const page_2 = document.querySelector('.page_2');
  page_2.style.display = "none";
  //! Words
  const words = [
    "BOOK",
    "POP",
    "RACE",
    "SOCIAL",
    "PROOF",
    "FARE",
    "ROOF",
    "CHECK",
    "TEA",
    "BEAT",
    "EAT",
    "GUITAR",
    "BUG",
    "CUP",
    "FAR",
    "SON",
    "PRO",
    "FAB",
  ];
  //! DOM elements
  const buttonsContainer = document.querySelector(".buttons_container");
  const allLetters = Array.from(document.querySelectorAll(".letter"));
  const check = document.querySelector(".btn-check");
  const wordsContent = document.querySelector(".words_content");
  const counter = document.querySelector(".counter");
  const timer = document.querySelector(".timer");
  //! Variables
  let firstChoosenLetter = undefined;
  let choosenLetters = [];
  let xLine = true;
  let yLine = true;

  let trueAnswered = [];
  let selectedDifficulty;
  //! Events
  buttonsContainer.addEventListener("click", startGame, true);
  allLetters.forEach((letter) => {
    letter.addEventListener("click", toChoose);
  });
  check.addEventListener("click", sortChoosenWord);
  //! Functions

  async function startGame(event) {
    page_1.style.display = "none";
    page_2.style.display = "block";
    let difficulty = event.target;
    selectedDifficulty = difficulty.dataset.difficulty;
    counter.innerText = trueAnswered.length + "/" + selectedDifficulty;
    +selectedDifficulty;
    if (difficulty.dataset.difficulty == 6) {
      const EASY_TIME = 1000 * 60 * 3;
      await gameTime(1, 59);
      endGame();
    } else if (difficulty.dataset.difficulty == 12) {
      const NORMAL_TIME = 1000 * 60 * 5;
      await gameTime(2, 59);
      endGame();
    } else if (difficulty.dataset.difficulty == 18) {
      const HARD_TIME = 1000 * 60 * 6.5;
      await gameTime(3, 59);
      endGame();
    }
  }
  function toCheck() {
    let letters = choosenLetters;
    let choosenWord = "";
    letters.forEach((letter) => {
      choosenWord += letter.innerText;
    });
    console.log(choosenWord);
    if (words.includes(choosenWord) && !trueAnswered.includes(choosenWord)) {
      console.log(true);
      trueAnswered.push(choosenWord);
      counter.innerText = trueAnswered.length + "/" + selectedDifficulty;
      // add to true answered content
      const h3 = document.createElement("h3");
      h3.innerText = choosenWord + "👍";
      wordsContent.appendChild(h3);
      // style the true answer
      letters.forEach((letter) => {
        letter.classList.remove("chosing");
        letter.classList.add("true-answered");
        setTimeout(() => {
          letter.classList.remove("true-answered");
        }, 2000);
      });
    } else {
      console.log(false);
      letters.forEach((letter) => {
        letter.classList.remove("chosing");
        if (!letter.classList.contains("chosing")) {
          letter.classList.add("notChoose");
          setTimeout(() => {
            letter.classList.remove("notChoose");
          }, 600);
        }
      });
    }
    firstChoosenLetter = undefined;
    choosenLetters = [];
    xLine = true;
    yLine = true;
  }
  function toChoose(event) {
    if (firstChoosenLetter === undefined) {
      firstChoosenLetter = coords(+event.target.dataset.value);
      if (!event.target.classList.contains("chosing")) {
        choosenLetters.push(event.target);
        event.target.classList.add("chosing");
      }
    } else {
      let [xCur, yCur] = coords(+event.target.dataset.value);
      let [xLast, yLast] = firstChoosenLetter;
      if (xLast === xCur && xLine) {
        if (!event.target.classList.contains("chosing")) {
          choosenLetters.push(event.target);
          event.target.classList.add("chosing");
          yLine = false; //* y qatoriga kirmaydi
        }
      }
      if (yLast === yCur && yLine) {
        if (!event.target.classList.contains("chosing")) {
          choosenLetters.push(event.target);
          event.target.classList.add("chosing");
          xLine = false; //* x qatoriga kirmaydi
        }
      }
      if (!event.target.classList.contains("chosing")) {
        event.target.classList.add("notChoose");
        setTimeout(() => {
          event.target.classList.remove("notChoose");
        }, 600);
      }
    }
  }
  function sortChoosenWord() {
    let sorted = [];
    choosenLetters
      .sort((a, b) => a.dataset.value - b.dataset.value)
      .map((letter) => sorted.push(letter));
    console.log("after", choosenLetters);
    toCheck(sorted);
  }
  function gameTime(min, sec) {
    return new Promise((res) => {
      let gameTimeInt = setInterval(() => {
        sec -= 1;
        if (sec === 0 && min - 1 !== -1) {
          min -= 1;
          sec = 59;
        } else if (sec === 0 && min === 0) {
          timer.innerText = `Time is out`;
          clearInterval(gameTimeInt);
          console.log("clearInterval(gameTimeInt);");
          res(true);
        }
        timer.innerText = `${min}:${sec > 9 ? sec : `0${sec}`}`;
      }, 1000);
    });
  }
  function endGame() {
    const checking_buttons = document.querySelector(".checking_buttons");
    checking_buttons.removeChild(check);
    checking_buttons.removeChild(timer);
    const result = document.createElement("h2");
    result.innerText =
      trueAnswered.length >= selectedDifficulty
        ? "You won the game! Keep it up!"
        : "Sorry, time is out. Try it again";
    checking_buttons.appendChild(result);
  }
  function coords(num) {
    let row = parseInt((num - 0.001) / 8) + 1;
    let col = num % 8 === 0 ? 8 : num % 8;
    return [col, row];
  }
});
