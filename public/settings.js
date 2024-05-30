document.addEventListener('DOMContentLoaded', function() {
    // Lire les cookies pour obtenir les paramètres
    const savedDuration = getCookie('testDuration');
    const savedParagraphSize = getCookie('paragraphSize');

    // Définir les valeurs par défaut des select
    const durationSelect = document.getElementById('test-duration');
    const paragraphSizeSelect = document.getElementById('paragraph-size');

    if (savedDuration) {
        durationSelect.value = savedDuration;
    } else {
        durationSelect.value = durationSelect.options[0].value;
    }

    if (savedParagraphSize) {
        paragraphSizeSelect.value = savedParagraphSize;
    } else {
        paragraphSizeSelect.value = paragraphSizeSelect.options[0].value;
    }
});

document.getElementById('settings-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const duration = document.getElementById('test-duration').value;
    const paragraphSize = document.getElementById('paragraph-size').value;

    document.cookie = `testDuration=${duration}; path=/`;
    document.cookie = `paragraphSize=${paragraphSize}; path=/`;

    window.location.href = 'test.html';
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
