let textToType = '';
let currentIndex = 0;
let startTime;
let timer;
let countdown;
const countdownTime = 60;
const targetWordCount = 100;
const wordMargin = 10;
let isFinished = false;

function startTest() {
    isFinished = false;
    fetch('/api/random-text')
        .then(response => response.json())
        .then(data => {
            textToType = getRandomTextPortion(data.text, targetWordCount, wordMargin);
            currentIndex = 0;
            updateDisplay();
            document.getElementById('text-input').value = '';
            document.getElementById('time').innerText = '';
            startTime = new Date();
            document.getElementById('text-input').focus();
            timer = setInterval(updateTime, 1000);
            countdown = setTimeout(endTest, countdownTime * 1000);
        })
        .catch(err => console.error('Erreur:', err));
}

function getRandomTextPortion(text, targetWordCount, wordMargin) {
    const words = text.split(/\s+/);
    const totalWords = words.length;
    const minWords = targetWordCount - wordMargin;
    const maxWords = targetWordCount + wordMargin;
    const randomStartIndex = Math.floor(Math.random() * (totalWords - maxWords));
    const randomEndIndex = randomStartIndex + Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;

    return words.slice(randomStartIndex, randomEndIndex).join(' ');
}

function updateDisplay() {
    if (isFinished) {return;}
    const textDisplay = document.getElementById('text-display');
    textDisplay.innerHTML = '';

    for (let i = 0; i < textToType.length; i++) {
        const span = document.createElement('span');
        span.innerText = textToType[i];

        if (i < currentIndex) {
            span.classList.add('correct');
        } else if (i === currentIndex) {
            span.classList.add('current');
        } else {
            span.classList.add('incorrect');
        }

        textDisplay.appendChild(span);
    }
}

function checkInput() {
    if (isFinished) {return;}
    const input = document.getElementById('text-input').value;
    const currentChar = textToType[currentIndex];

    if (input.length > 0) {
        const typedChar = input[input.length - 1];

        if (typedChar === currentChar) {
            currentIndex++;
        }
        document.getElementById('text-input').value = '';
        updateDisplay();

        if (currentIndex === textToType.length) {
            clearInterval(timer);
            clearTimeout(countdown);
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;
            const accuracy = calculateAccuracy();
            document.getElementById('time').innerText = `Temps: ${timeTaken} secondes, Précision: ${accuracy}%`;
        }
    }
}

function calculateAccuracy() {
    let correctChars = currentIndex;
    return ((correctChars / textToType.length) * 100).toFixed(2);
}

function updateTime() {
    if (isFinished) {return;}
    const currentTime = new Date();
    const timeElapsed = ((currentTime - startTime) / 1000).toFixed(0);
    const timeLeft = countdownTime - timeElapsed;
    document.getElementById('time').innerText = `Temps restant: ${timeLeft} secondes`;
    const accuracy = calculateAccuracy();
    document.getElementById('accuracy').innerText = `Précision: ${accuracy}%`;
    if (timeLeft <= 0) {
        endTest();
    }
}

function endTest() {
    clearInterval(timer);
    isFinished = true;
}
