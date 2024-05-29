let textToType = '';
let currentIndex = 0;
let startTime;
let timer;
let countdown;
const countdownTime = 60; // 60 seconds countdown
const targetWordCount = 100; // Target number of words
const wordMargin = 10; // +/- 10 words

function startTest() {
    fetch('/api/random-text')
        .then(response => response.json())
        .then(data => {
            textToType = getRandomTextPortion(data.text, targetWordCount, wordMargin);
            currentIndex = 0;
            updateDisplay();
            document.getElementById('text-input').value = '';
            document.getElementById('result').innerText = '';
            startTime = new Date();
            document.getElementById('text-input').focus();
            timer = setInterval(updateTime, 1000);
            countdown = setTimeout(endTest, countdownTime * 1000); // end test after 60 seconds
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
            document.getElementById('result').innerText = `Temps: ${timeTaken} secondes, Précision: ${accuracy}%`;
        }
    }
}

function calculateAccuracy() {
    let correctChars = currentIndex;
    return ((correctChars / textToType.length) * 100).toFixed(2);
}

function updateTime() {
    const currentTime = new Date();
    const timeElapsed = ((currentTime - startTime) / 1000).toFixed(0);
    const timeLeft = countdownTime - timeElapsed;
    document.getElementById('result').innerText = `Temps restant: ${timeLeft} secondes`;
    if (timeLeft <= 0) {
        endTest();
    }
}

function endTest() {
    clearInterval(timer);
    const accuracy = calculateAccuracy();
    document.getElementById('result').innerText = `Temps écoulé! Précision: ${accuracy}%`;
}
