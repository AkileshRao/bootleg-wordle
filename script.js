import { isValidCharacter } from "./utils.js";

const mainWord = "joint";
let currentCol = 1;
let currentRow = 1;
let currentWord = "";
let words = {
    "1": "",
    "2": "",
    "3": "",
    "4": "",
    "5": "",
    "6": ""
}

let wordsStatus = {
    "1": [],
    "2": [],
    "3": [],
    "4": [],
    "5": [],
    "6": []
}

const modeSwitch = document.querySelector('.toggle-switch');
const appContainer = document.querySelector('.app-container');
const restart = document.querySelector('.restart-game');

document.querySelector('.restart-btn').addEventListener('click', () => window.location.reload())

restart.addEventListener('click', () => window.location.reload())

modeSwitch.addEventListener('click', () => {
    if (modeSwitch.dataset.status == "light") {
        modeSwitch.dataset.status = "dark"
        appContainer.dataset.mode = "dark";
    } else {
        modeSwitch.dataset.status = "light";
        appContainer.dataset.mode = "light";
    }
})


let keypressEventListener = document.addEventListener("keydown", (e) => {
    if (isValidCharacter(e.key)) {
        if (e.key == "Enter") return checkWord();
        if (e.key == "Backspace") return removeLetter();
        setCharacter(e.key);
    }
})

const setCharacter = (keyVal) => {
    let cell = document.getElementById(`grid-cell-${currentRow}${currentCol}`);
    if (currentCol <= 5) {
        cell.dataset.animation = "pop";
        cell.dataset.state = "tbd"
        setTimeout(() => cell.dataset.animation = "idle", 100)
        cell.innerText = keyVal;
        currentWord += keyVal;
        currentCol++;
    }
}

const checkWord = () => {
    if (currentCol != 6) {
        let rowInQuestion = document.getElementById(`grid-row-${currentRow}`);
        rowInQuestion.dataset.status = "invalid";
        setTimeout(() => rowInQuestion.dataset.status = "valid", 1000)
        document.querySelector(".error-toast").dataset.status = 'true';
        setTimeout(() => document.querySelector(".error-toast").dataset.status = 'false', 3000)
        return;
    } else {
        words[currentRow.toString()] = currentWord;
        mapCorrectCharactersOfWord(currentWord);
    }
}


const removeLetter = () => {
    let cell = document.getElementById(`grid-cell-${currentRow}${currentCol - 1}`);
    if (currentCol > 1) {
        cell.innerText = "";
        cell.dataset.state = 'empty'
        currentWord = currentWord.slice(0, currentWord.length - 1)
        currentCol--;
    }
}

const mapCorrectCharactersOfWord = (word) => {
    for (let i = 0; i < word.length; i++) {
        if (word[i] == mainWord[i]) {
            wordsStatus[currentRow.toString()].push("correct");
        } else if (mainWord.includes(word[i])) {
            wordsStatus[currentRow.toString()].push("present");
        } else {
            wordsStatus[currentRow.toString()].push("absent");
        }
    }

    setBackgroundForRow(currentRow, wordsStatus);

    if (word == mainWord) {
        removeEventListener("keydown", keypressEventListener);
        document.querySelector('.victory-toast').dataset.visibilityStatus = "true"
    } else {
        currentRow++;
        currentCol = 1;
        currentWord = "";
    }
}

const setBackgroundForRow = (row, wordStatusArr) => {
    for (let i = 1; i <= 5; i++) {
        let cell = document.getElementById(`grid-cell-${row}${i}`);
        if (wordStatusArr[row.toString()][(i - 1).toString()] == "absent") {
            cell.dataset.state = "absent";
        }

        if (wordStatusArr[row.toString()][(i - 1).toString()] == "correct") {
            cell.dataset.state = "correct";
        }

        if (wordStatusArr[row.toString()][(i - 1).toString()] == "present") {
            cell.dataset.state = "present";
        }
    }
}