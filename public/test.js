let textToType = '';
let currentIndex = 0;
let startTime;
let timer;
let countdown;
let countdownTime = 60;
let targetWordCount = 100;
const wordMargin = 10;
let isFinished = false;
let totalKeystrokes = 0;
let correctKeystrokes = 0;

function startTest() {
    // Lire les cookies pour obtenir les paramètres
    const savedDuration = getCookie('testDuration');
    const savedParagraphSize = getCookie('paragraphSize');

    // Utiliser les valeurs sauvegardées ou les valeurs par défaut
    countdownTime = savedDuration ? parseInt(savedDuration, 10) : 60;
    targetWordCount = savedParagraphSize ? parseInt(savedParagraphSize, 10) : 100;

    clearInterval(timer);
    clearTimeout(countdown);
    isFinished = false;
    totalKeystrokes = 0;
    correctKeystrokes = 0;
    fetch('/api/random-text')
        .then(response => response.json())
        .then(data => {
            textToType = getRandomTextPortion(data.text, targetWordCount, wordMargin);
            currentIndex = 0;
            updateDisplay();
            document.getElementById('text-input').value = '';
            document.getElementById('time').innerText = '';
            document.getElementById('accuracy').innerText = '';
            document.getElementById('key-accuracy').innerText = '';
            startTime = new Date();
            document.getElementById('text-input').focus();
            timer = setInterval(updateTime, 1000);
            countdown = setTimeout(endTest, countdownTime * 1000);
            document.getElementById('start-button').innerText = 'Recommencer le test';
            document.getElementById('text-input').disabled = false;
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
    if (isFinished) { return; }
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
    if (isFinished) { return; }
    const input = document.getElementById('text-input').value;
    const currentChar = textToType[currentIndex];

    if (input.length > 0) {
        const typedChar = input[input.length - 1];
        totalKeystrokes++;

        if (typedChar === currentChar) {
            currentIndex++;
            correctKeystrokes++;
        }
        document.getElementById('text-input').value = '';
        updateDisplay();

        if (currentIndex === textToType.length) {
            clearInterval(timer);
            clearTimeout(countdown);
            const endTime = new Date();
            const timeTaken = (endTime - startTime) / 1000;
            const textAccuracy = calculateTextAccuracy();
            const keyAccuracy = calculateKeyAccuracy();
            document.getElementById('time').innerText = `Temps final: ${timeTaken} secondes`;
            document.getElementById('accuracy').innerText = `Précision du texte: ${textAccuracy}%`;
            document.getElementById('key-accuracy').innerText = `Précision des touches: ${keyAccuracy}%`;
            isFinished = true;
        }
    }
}

function calculateTextAccuracy() {
    let correctChars = currentIndex;
    return ((correctChars / textToType.length) * 100).toFixed(2);
}

function calculateKeyAccuracy() {
    if (totalKeystrokes === 0) return "0.00"; // Evite la division par zéro
    return ((correctKeystrokes / totalKeystrokes) * 100).toFixed(2);
}

function updateTime() {
    if (isFinished) { return; }
    const currentTime = new Date();
    const timeElapsed = ((currentTime - startTime) / 1000).toFixed(0);
    const timeLeft = countdownTime - timeElapsed;
    document.getElementById('time').innerText = `Temps restant: ${timeLeft} secondes`;
    const textAccuracy = calculateTextAccuracy();
    const keyAccuracy = calculateKeyAccuracy();
    document.getElementById('accuracy').innerText = `Précision du texte: ${textAccuracy}%`;
    document.getElementById('key-accuracy').innerText = `Précision des touches: ${keyAccuracy}%`;
    if (timeLeft <= 0) {
        endTest();
    }
}

function endTest() {
    clearInterval(timer);
    isFinished = true;
    document.getElementById('text-input').disabled = true;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
