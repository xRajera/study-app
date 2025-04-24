// script.js

let questions = [];
let answers = {};
let seen = new Set();
let current = null;
let score = 0;
let total = 0;

fetch('answers.json')
    .then(res => res.json())
    .then(data => {
        answers = data;
        questions = Object.keys(data);
        loadRandomQuestion();
    });

document.querySelectorAll('.option').forEach(btn => {
    btn.addEventListener('click', () => checkAnswer(btn.dataset.option));
});

document.getElementById('nextBtn').addEventListener('click', loadRandomQuestion);
document.getElementById('endBtn').addEventListener('click', confirmEnd);

function loadRandomQuestion() {
    const available = questions.filter(q => !seen.has(q));
    if (available.length === 0) return showFinalScore();

    const q = available[Math.floor(Math.random() * available.length)];
    current = q;
    seen.add(q);

    document.getElementById('questionImage').src = `questions/${q}`;
    document.getElementById('result').textContent = "";
    document.querySelectorAll('.option').forEach(btn => btn.disabled = false);
    document.getElementById('nextBtn').disabled = true;
}

function checkAnswer(selected) {
    total++;
    const correct = answers[current];
    if (selected === correct) {
        score++;
        document.getElementById('result').textContent = 'Correct!';
        document.getElementById('result').style.color = 'green';
    } else {
        document.getElementById('result').textContent = `Wrong. Correct answer: ${correct}`;
        document.getElementById('result').style.color = 'red';
    }
    document.querySelectorAll('.option').forEach(btn => btn.disabled = true);
    document.getElementById('nextBtn').disabled = false;
}

function confirmEnd() {
    if (confirm("Are you sure you want to end the session?")) {
        showFinalScore();
    }
}

function showFinalScore() {
    alert(`Final Score: ${score}/${total}`);
    location.reload();
}