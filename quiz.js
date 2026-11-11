// Cybersecurity Quiz - IT 3203 Project Milestone 2

// Select the quiz elements from the HTML page.
const quizForm = document.getElementById("quiz-form");
const timerDisplay = document.getElementById("timer");
const resultsSection = document.getElementById("quiz-results");
const resultsContent = document.getElementById("results-content");

// Quiz settings.
const timeLimit = 10 * 60;
const passingScore = 7;
let timeRemaining = timeLimit;
let timerInterval;
let quizSubmitted = false;

// Correct answers and explanations for all ten questions.
const answers = {
    q1: {
        correct: "phishing",
        answer: "Phishing",
        explanation: "Phishing uses fake emails or messages to trick people into sharing personal information."
    },
    q2: {
        correct: "B",
        answer: "Malicious software designed to harm or access systems",
        explanation: "Malware is software created to damage, disrupt, or gain unauthorized access to systems."
    },
    q3: {
        correct: "C",
        answer: "Unauthorized access to private information",
        explanation: "A data breach occurs when private or sensitive information is accessed or disclosed without authorization."
    },
    q4: {
        correct: "multifactor authentication",
        answer: "Multifactor authentication (MFA)",
        explanation: "MFA requires two or more forms of verification to confirm a user's identity."
    },
    q5: {
        correct: "A",
        answer: "An encrypted connection",
        explanation: "HTTPS uses encryption to help protect information exchanged between a browser and website."
    },
    q6: {
        correct: ["A", "B", "D"],
        answer: "Using strong, unique passwords; enabling multifactor authentication; and keeping software updated",
        explanation: "Strong passwords, MFA, and updates help protect accounts and systems. Clicking suspicious links is unsafe."
    },
    q7: {
        correct: "C",
        answer: "To monitor and control network traffic",
        explanation: "A firewall monitors and filters network traffic according to security rules."
    },
    q8: {
        correct: "B",
        answer: "It prevents one stolen password from unlocking multiple accounts",
        explanation: "Unique passwords limit the damage if one account's password is compromised."
    },
    q9: {
        correct: "D",
        answer: "They can fix security weaknesses and bugs",
        explanation: "Software updates often include security patches that address known vulnerabilities."
    },
    q10: {
        correct: "C",
        answer: "Avoid the link and verify the message through an official source",
        explanation: "Unexpected requests for passwords may be phishing attempts. Verify them through an official source."
    }
};

// Start the ten-minute countdown.
function startTimer() {
    clearInterval(timerInterval);

    timerInterval = setInterval(function () {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerDisplay.textContent =
            minutes + ":" + String(seconds).padStart(2, "0");

        // Warn users when one minute remains.
        timerDisplay.style.color =
            timeRemaining <= 60 ? "#c0392b" : "";

        // Automatically submit when time runs out.
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
    }, 1000);
}

// Format typed answers for comparison.
function normalizeAnswer(value) {
    return value.trim().toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

// Check the user's answers.
function checkAnswers() {
    let score = 0;
    resultsContent.replaceChildren();

    for (let i = 1; i <= 10; i++) {
        const questionName = "q" + i;
        const question = answers[questionName];
        let userAnswer = "";
        let isCorrect = false;

        if (questionName === "q1" || questionName === "q4") {
            // Check fill-in-the-blank answers.
            userAnswer = document.getElementById(questionName).value;

            const normalizedUserAnswer = normalizeAnswer(userAnswer);

isCorrect = questionName === "q1"
    ? normalizedUserAnswer === "phishing"
    : ["multifactorauthentication", "mfa"]
        .includes(normalizedUserAnswer);

        } else if (questionName === "q6") {
            // Check that every correct checkbox is selected
            // and no incorrect checkbox is selected.
            const selected = Array.from(
                document.querySelectorAll(
                    'input[name="q6"]:checked'
                )
            ).map(input => input.value);

            userAnswer = selected.length > 0
                ? selected.join(", ")
                : "No answer selected";

            isCorrect =
                selected.length === question.correct.length &&
                question.correct.every(value => selected.includes(value));
        } else {
            // Check multiple-choice answers.
            const selected = document.querySelector(
                'input[name="' + questionName + '"]:checked'
            );

            userAnswer = selected ? selected.value : "No answer selected";
            isCorrect = selected !== null &&
                selected.value === question.correct;
        }

        if (isCorrect) {
            score++;
        }

        // Create a result for each question.
        const resultCard = document.createElement("div");
        resultCard.className = "question-result";

        const heading = document.createElement("h3");
        heading.textContent =
            "Question " + i + ": " +
            (isCorrect ? "Correct" : "Incorrect");

        heading.style.color = isCorrect ? "#218838" : "#c0392b";

        const submitted = document.createElement("p");
        submitted.textContent = "Your answer: " + userAnswer;

        const correctAnswer = document.createElement("p");
        correctAnswer.textContent =
            "Correct answer: " + question.answer;

        const explanation = document.createElement("p");
        explanation.textContent = question.explanation;

        resultCard.append(
            heading,
            submitted,
            correctAnswer,
            explanation
        );

        resultsContent.appendChild(resultCard);
    }

    return score;
}

// Calculate and display the final quiz results.
function submitQuiz() {
    if (quizSubmitted) {
        return;
    }

    quizSubmitted = true;
    clearInterval(timerInterval);

    const score = checkAnswers();
    const passed = score >= passingScore;
    const timeSpent = timeLimit - timeRemaining;

    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    // Display the overall result.
    const summary = document.createElement("div");
    summary.className = "quiz-summary";

    const status = document.createElement("h3");
    status.textContent = passed ? "Congratulations! You Passed!" :
        "You Did Not Pass. Keep Practicing!";

    status.style.color = passed ? "#218838" : "#c0392b";

    const totalScore = document.createElement("p");
    totalScore.textContent = "Total Score: " + score + " / 10";

    const percentage = document.createElement("p");
    percentage.textContent = "Percentage: " + (score * 10) + "%";

    const completionTime = document.createElement("p");
    completionTime.textContent =
        "Time Spent: " + minutes + " minute(s) and " +
        seconds + " second(s)";

    summary.append(status, totalScore, percentage, completionTime);

    resultsContent.prepend(summary);
    resultsSection.hidden = false;

    // Prevent additional submissions until the quiz is reset.
    quizForm.querySelectorAll('input, button[type="submit"]').forEach(function (element) {
    element.disabled = true;
    });

    resultsSection.scrollIntoView({ behavior: "smooth" });
}

// Handle quiz submission.
quizForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitQuiz();
});

// Reset answers, results, and timer when the user retakes the quiz.
quizForm.addEventListener("reset", function () {
    clearInterval(timerInterval);

    setTimeout(function () {
        quizSubmitted = false;
        timeRemaining = timeLimit;

        timerDisplay.textContent = "10:00";
        timerDisplay.style.color = "";

        resultsContent.replaceChildren();
        resultsSection.hidden = true;

        quizForm.querySelectorAll("input, button").forEach(function (element) {
            element.disabled = false;
        });

        startTimer();
    }, 0);
});

// Start the timer when the quiz page loads.
startTimer();