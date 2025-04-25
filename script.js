// script.js

let questions = [];
let answers = {};
let usedQuestions = new Set();
let currentQuestion = "";
let score = 0;

// DOM elements
const questionImage = document.getElementById('questionImage');
const result = document.getElementById('result');
const nextBtn = document.getElementById('nextBtn');
const endBtn = document.getElementById('endBtn');
const optionButtons = Array.from(document.getElementsByClassName('option'));

// Load the answers.json
fetch('answers.json')
  .then(response => response.json())
  .then(data => {
    answers = data;
    questions = Object.keys(answers);
    loadRandomQuestion();
  })
  .catch(error => console.error('Error loading answers.json:', error));

function loadRandomQuestion() {
  if (usedQuestions.size === questions.length) {
    alert("You've answered all the questions!");
    showFinalScore();
    return;
  }

  // Pick a random unused question
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * questions.length);
  } while (usedQuestions.has(questions[randomIndex]));

  currentQuestion = questions[randomIndex];
  usedQuestions.add(currentQuestion);

  // Set the image source
  questionImage.src = `questions/${currentQuestion}`;
  questionImage.alt = `Question ${currentQuestion}`;

  // Reset button styles
  optionButtons.forEach(button => {
    button.disabled = false;
    button.style.backgroundColor = '#007bff';
    button.style.color = 'white';
  });

  result.textContent = "";
  nextBtn.style.display = 'none';
}

// Handle answer click
optionButtons.forEach(button => {
  button.addEventListener('click', () => {
    checkAnswer(button.id);
  });
});

function checkAnswer(selected) {
  const correct = answers[currentQuestion];

  optionButtons.forEach(button => {
    button.disabled = true;
    if (button.id === correct) {
      button.style.backgroundColor = '#28a745'; // Green for correct
    } else if (button.id === selected) {
      button.style.backgroundColor = '#dc3545'; // Red for wrong
    }
  });

  if (selected === correct) {
    result.textContent = "Correct!";
    score++;
  } else {
    result.textContent = `Wrong! Correct answer: ${correct}`;
  }

  nextBtn.style.display = 'inline-block';
}

// Load next question
nextBtn.addEventListener('click', loadRandomQuestion);

// Confirm before ending session
endBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to end the session?")) {
    showFinalScore();
  }
});

// Catch page closing (X button)
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  e.returnValue = '';
});

function showFinalScore() {
  alert(`Session Ended.\nYour Score: ${score}/${usedQuestions.size}`);
  location.reload();
}
