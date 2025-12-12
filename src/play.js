import { letters, wordPuzzles } from "./letters.js"
import { config } from "./config.js"



// Configuration - Update this date in config.js
let START_DATE = new Date(config.startDate);

let currentDay = 1;
let selectedLetter = null;
let unlockedLetters = loadProgress();
let currentGuess = '';
let attempts = 0;
let maxAttempts = config.maxAttempts;
let guesses = [];
let keyboardState = {};
let currentPuzzle = null;

// Load progress from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem('lettersProgress');
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        console.error('Error loading progress:', e);
        return {};
    }
}

// Save progress to localStorage
function saveProgress() {
    try {
        localStorage.setItem('lettersProgress', JSON.stringify(unlockedLetters));
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

let keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

function calculateCurrentDay() {
    const now = new Date();

    if (now < START_DATE) {
        currentDay = 1;
        return;
    }

    const diffTime = now - START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    currentDay = Math.min(diffDays + 1, config.totalDays);
}


function isUnlocked(day) {
    return day <= currentDay && unlockedLetters[day];
}

function renderEnvelopes() {
    let container = document.getElementById('envelopes');
    container.innerHTML = '';

    letters.forEach(function (letter) {
        let isAvailable = letter.day <= currentDay;
        let isLetterUnlocked = unlockedLetters[letter.day] && isAvailable;

        let envelope = document.createElement('div');
        // Fix: Only add 'locked' class if NOT available (future day)
        // Available but not solved should just have the gradient class
        let stateClass = '';
        if (isLetterUnlocked) {
            stateClass = 'unlocked';
        } else if (!isAvailable) {
            stateClass = 'locked';
        }
        // Available but not unlocked = just gradient (clickable, colorful)
        envelope.className = 'envelope ' + stateClass + ' ' + letter.color;

        if (isAvailable && !isLetterUnlocked) {
            envelope.onclick = function () {
                startGame(letter);
            };
            envelope.style.cursor = 'pointer';
        } else if (isLetterUnlocked) {
            envelope.onclick = function () {
                openLetter(letter);
            };
        }

        let icon = isLetterUnlocked ? '✉️' : (isAvailable ? '💗' : '🔒');
        let iconClass = isAvailable && !isLetterUnlocked ? 'envelope-icon beating-heart' : 'envelope-icon';
        let subtitle = isLetterUnlocked ? 'Click to read' : (isAvailable ? 'Click to unlock' : 'Available on day ' + letter.day);

        envelope.innerHTML = '<div class="envelope-left"><div class="' + iconClass + '">' +
            icon +
            '</div><div><div class="envelope-title">Day ' + letter.day +
            '</div><div class="envelope-subtitle">' + subtitle +
            '</div></div></div>' +
            (isLetterUnlocked ? '<div class="heart-small">❤️</div>' : '');

        container.appendChild(envelope);
    });

    let unlockedCount = Object.keys(unlockedLetters).length;
    document.getElementById('dayCounter').textContent = unlockedCount + ' of ' + config.totalDays + ' letters unlocked';
}

function startGame(letter) {
    selectedLetter = letter;
    currentPuzzle = wordPuzzles[letter.day];
    currentGuess = '';
    attempts = 0;
    guesses = [];
    keyboardState = {};

    document.getElementById('gameDay').textContent = letter.day;
    document.getElementById('hintSection').textContent = currentPuzzle.hint;
    document.getElementById('gameCard').className = 'game-card ' + letter.color;
    document.getElementById('attemptCount').textContent = '0';
    document.getElementById('gameMessage').textContent = '';
    document.getElementById('gameMessage').className = 'message';

    renderKeyboard();
    renderGuesses();

    document.getElementById('mainView').style.display = 'none';
    document.getElementById('gameView').classList.add('active');
}

function renderKeyboard() {
    let container = document.getElementById('keyboard');
    container.innerHTML = '';

    keyboard.forEach(function (row) {
        let rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';

        row.forEach(function (key) {
            let keyBtn = document.createElement('button');
            keyBtn.className = 'key' + (key.length > 1 ? ' wide' : '');
            keyBtn.textContent = key;
            keyBtn.onclick = function () { handleKeyPress(key); };

            if (keyboardState[key]) {
                keyBtn.classList.add(keyboardState[key]);
            }

            rowDiv.appendChild(keyBtn);
        });

        container.appendChild(rowDiv);
    });
}

function renderGuesses() {
    let container = document.getElementById('guessesContainer');
    container.innerHTML = '';

    for (let i = 0; i < maxAttempts; i++) {
        let guessDiv = document.createElement('div');
        guessDiv.className = 'word-display';

        let wordLength = currentPuzzle.word.length;
        for (let j = 0; j < wordLength; j++) {
            let box = document.createElement('div');
            box.className = 'letter-box';

            if (guesses[i]) {
                box.textContent = guesses[i].letters[j];
                box.classList.add(guesses[i].states[j]);
            } else if (i === attempts && currentGuess[j]) {
                box.textContent = currentGuess[j];
            }

            guessDiv.appendChild(box);
        }

        container.appendChild(guessDiv);
    }
}

function handleKeyPress(key) {
    if (attempts >= maxAttempts) return;

    let msg = document.getElementById('gameMessage');
    msg.textContent = '';

    if (key === '⌫') {
        currentGuess = currentGuess.slice(0, -1);
    } else if (key === 'ENTER') {
        if (currentGuess.length === currentPuzzle.word.length) {
            submitGuess();
        } else {
            msg.textContent = 'Not enough letters!';
            msg.className = 'message error';
        }
    } else if (currentGuess.length < currentPuzzle.word.length) {
        currentGuess += key;
    }

    renderGuesses();
}

function submitGuess() {
    let target = currentPuzzle.word;
    let states = [];
    let letterCount = {};

    for (let i = 0; i < target.length; i++) {
        letterCount[target[i]] = (letterCount[target[i]] || 0) + 1;
    }

    for (let i = 0; i < currentGuess.length; i++) {
        if (currentGuess[i] === target[i]) {
            states[i] = 'correct';
            letterCount[currentGuess[i]]--;
        } else {
            states[i] = 'absent';
        }
    }

    for (let i = 0; i < currentGuess.length; i++) {
        if (states[i] === 'absent' && letterCount[currentGuess[i]] > 0) {
            states[i] = 'present';
            letterCount[currentGuess[i]]--;
        }
    }

    guesses.push({
        letters: currentGuess.split(''),
        states: states
    });

    for (let i = 0; i < currentGuess.length; i++) {
        let letter = currentGuess[i];
        let state = states[i];

        if (!keyboardState[letter] ||
            (state === 'correct') ||
            (state === 'present' && keyboardState[letter] !== 'correct')) {
            keyboardState[letter] = state;
        }
    }

    attempts++;
    document.getElementById('attemptCount').textContent = attempts;

    let msg = document.getElementById('gameMessage');

    if (currentGuess === target) {
        msg.textContent = '🎉 Correct! Letter unlocked!';
        msg.className = 'message success';
        unlockedLetters[selectedLetter.day] = true;
        saveProgress(); // Save to localStorage

        setTimeout(function () {
            closeGame();
            openLetter(selectedLetter);
        }, 1500);
    } else if (attempts >= maxAttempts) {
        msg.textContent = 'The word was: ' + target + '. Try again!';
        msg.className = 'message error';

        setTimeout(function () {
            closeGame();
        }, 2500);
    }

    currentGuess = '';
    renderKeyboard();
    renderGuesses();
}

export function closeGame() {
    document.getElementById('mainView').style.display = 'block';
    document.getElementById('gameView').classList.remove('active');
    renderEnvelopes();
}

export function openLetter(letter) {
    document.getElementById('letterTitle').textContent = letter.title;
    document.getElementById('letterDay').textContent = 'Day ' + letter.day + ' of 8';
    document.getElementById('letterText').textContent = letter.content;
    document.getElementById('letterCard').className = 'letter-card ' + letter.color;

    document.getElementById('mainView').style.display = 'none';
    document.getElementById('letterView').classList.add('active');
}

export function closeLetter() {
    document.getElementById('mainView').style.display = 'block';
    document.getElementById('letterView').classList.remove('active');
}

calculateCurrentDay();
renderEnvelopes();

document.addEventListener('keydown', function (e) {
    if (document.getElementById('gameView').classList.contains('active')) {
        let key = e.key.toUpperCase();

        if (key === 'BACKSPACE') {
            handleKeyPress('⌫');
        } else if (key === 'ENTER') {
            handleKeyPress('ENTER');
        } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
            handleKeyPress(key);
        }
    }
});

window.closeGame = closeGame
window.openLetter = openLetter
window.closeLetter = closeLetter