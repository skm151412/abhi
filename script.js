document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizStarted = false;
    const quizPassword = "1234boat"; // Default password for the quiz
    const authorPassword = "boat4567"; // New password for the author to show answers

    // Timer setup - 30 minutes
    let timeLeft = 1.5 * 60 * 60;  // 3 hours in seconds
    const timerElement = document.getElementById("timer");

    // Navigation buttons
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    const resultDiv = document.getElementById("result");

    // Question navigation panel
    const rightBox = document.querySelector(".right.box");

    // Correct answers
    const correctAnswers = {
        q1: "B", // Fixed land area
        q2: "B", // Well-developed irrigation system
        q3: "B", // Conversion of all wastelands to cultivable land
        q4: "C", // 75%
        q5: "B", // Jowar and bajra
        q6: "B", // Persian wheels
        q7: "B", // Tractors
        q8: "C", // Hectare
        q9: "C", // Deccan plateau
        q10: "A", // Less than 40%
        q11: "B", // One-third are landless, most land owned by upper castes
        q12: "B", // Soil fertility depletion
        q13: "B", // Early electrification
        q14: "A", // 1300 kg
        q15: "C", // Reusable over many years
        q16: "B", // One-third
        q17: "C", // Sugarcane
        q18: "C", // 200 hectares
        q19: "B", // Upper caste families
        q20: "B", // Multiple cropping
        q21: "C", // Human capital
        q22: "C", // 3200 kg
        q23: "C", // Chemical fertilizers
        q24: "B", // Small farmers and their families
        q25: "B", // Electric tubewells
        q26: "B", // Rabi
        q27: "B", // Raiganj market
        q28: "C", // Multiple cropping
        q29: "B", // Small plot sizes
        q30: "C", // Cow-dung manure
        q31: "B", // Tubewell irrigation
        q32: "B", // Haryana has larger irrigated areas
        q33: "B", // Multiple cropping with wheat
        q34: "B", // Soil fertility loss
        q35: "B", // Tamil Nadu relies on coastal systems
        q36: "B", // Low irrigation levels
        q37: "B", // Both use HYV seeds and tubewells
        q38: "B", // Water-table depletion
        q39: "A", // Gujarat relies on rainfall
        q40: "B", // Adoption of modern farming methods
        q41: "B", // Both A and R are true, but R does not explain A
        q42: "A", // Both A and R are true, and R explains A
        q43: "C", // A is true, but R is false
        q44: "A", // Both A and R are true, and R explains A
        q45: "C", // A is true, but R is false
        q46: "C", // A is true, but R is false
        q47: "C", // A is true, but R is false
        q48: "C", // A is true, but R is false
        q49: "C", // A is true, but R is false
        q50: "C", // A is true, but R is false
        
    };

    // Show answers control flag
    let showAnswersEnabled = false;

    // Create quiz prerequisites panel
    const quizContainer = document.querySelector(".container");
    const prerequisiteDiv = document.createElement("div");
    prerequisiteDiv.classList.add("prerequisite");
    prerequisiteDiv.innerHTML = `
        <div class="prerequisite-box">
            <h2>Quiz Prerequisites</h2>
            <p>Before starting the quiz, please ensure:</p>
            <ul>
                <li id="flightmode-check">✗ Device must be in flight/airplane mode</li>
            </ul>
            <div id="password-section" style="display: none;">
                <p>Enter Quiz Password:</p>
                <input type="password" id="quiz-password" placeholder="Enter password">
                <p id="password-feedback" style="color: red; display: none;">Incorrect password!</p>
            </div>
            <button id="startQuizBtn" disabled>Start Quiz</button>
            <p id="flightmode-instruction">Please enable flight/airplane mode on your device, then click below to confirm</p>
            <button id="checkFlightModeBtn">I've Enabled Flight Mode</button>
        </div>
    `;

    // Insert prerequisite div before the container
    document.body.insertBefore(prerequisiteDiv, quizContainer);
    quizContainer.style.display = "none";
    document.querySelector(".heading").style.display = "none";

    // Check flight mode button
    document.getElementById("checkFlightModeBtn").addEventListener("click", checkFlightMode);

    // Start quiz button
    document.getElementById("startQuizBtn").addEventListener("click", function () {
        const passwordInput = document.getElementById("quiz-password");
        if (passwordInput.value === quizPassword) {
            prerequisiteDiv.style.display = "none";
            quizContainer.style.display = "flex";
            document.querySelector(".heading").style.display = "flex";
            quizStarted = true;
            updateTimer(); // Start the timer only when quiz starts
        } else {
            const passwordFeedback = document.getElementById("password-feedback");
            passwordFeedback.style.display = "block";
            passwordInput.value = "";
        }
    });

    // Network status detection
    window.addEventListener("online", checkQuizViolation);

    function checkFlightMode() {
        const isOffline = !navigator.onLine;
        const flightmodeCheck = document.getElementById("flightmode-check");

        if (isOffline) {
            flightmodeCheck.innerHTML = "✓ Device is in flight/airplane mode";
            flightmodeCheck.style.color = "green";

            // Show password section when flight mode is enabled
            document.getElementById("password-section").style.display = "block";
        } else {
            flightmodeCheck.innerHTML = "✗ Device must be in flight/airplane mode";
            flightmodeCheck.style.color = "red";
        }

        updateStartButton();
    }

    function updateStartButton() {
        const startBtn = document.getElementById("startQuizBtn");
        const passwordSection = document.getElementById("password-section");

        if (!navigator.onLine) {
            passwordSection.style.display = "block";
            startBtn.disabled = false;
        } else {
            passwordSection.style.display = "none";
            startBtn.disabled = true;
        }
    }

    function checkQuizViolation() {
        if (quizStarted) {
            if (navigator.onLine) {
                // Auto-submit quiz due to violation
                submitQuiz(true);
            }
        }
    }

    // Initialize question navigation buttons
    for (let i = 1; i <= totalQuestions; i++) {
        let btn = document.createElement("button");
        btn.classList.add("btn");
        btn.textContent = i;
        btn.addEventListener("click", function () {
            showQuestion(i - 1);
        });
        rightBox.appendChild(btn);
    }

    // Track answer changes
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const questionName = this.name;
            const questionNumber = parseInt(questionName.substring(1)) - 1;
            userAnswers[questionName] = this.value;

            // Update the navigation button to show it's been answered
            document.querySelectorAll('.right.box .btn')[questionNumber].classList.add('answered');
        });
    });

    // Function to display a specific question
    function showQuestion(index) {
        questions.forEach((q, i) => {
            q.style.display = i === index ? "block" : "none";
        });

        // Update navigation buttons
        if (!resultDiv.style.display || resultDiv.style.display === "none") {
            prevBtn.style.display = index === 0 ? "none" : "inline-block";
            nextBtn.style.display = index === questions.length - 1 ? "none" : "inline-block";

            // Only show submit button on the last question
            if (index === questions.length - 1) {
                submitBtn.style.display = "block";
            } else {
                submitBtn.style.display = "none";
            }
        } else {
            // After quiz submission, always show navigation
            prevBtn.style.display = "inline-block";
            nextBtn.style.display = "inline-block";
            submitBtn.style.display = "none";
        }

        // Update the active question button
        document.querySelectorAll('.right.box .btn').forEach((btn, i) => {
            btn.classList.toggle('active', i === index);
        });

        currentQuestionIndex = index;
    }

    // Initialize timer
    function updateTimer() {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeLeft > 0) {
            timeLeft--;
            setTimeout(updateTimer, 1000);
        } else {
            // Time's up - auto submit
            submitQuiz();
        }
    }

    // Submit the quiz
    function submitQuiz(violation = false) {
        let score = 0;
        let answeredCount = 0;

        // Calculate score
        for (let key in correctAnswers) {
            if (userAnswers[key]) {
                answeredCount++;
                if (userAnswers[key] === correctAnswers[key]) {
                    score++;
                }
            }
        }

        // Display simplified result
        const timeExpired = timeLeft <= 0;
        resultDiv.innerHTML = `
            <h2>Quiz Results</h2>
            <p>Your Score: ${score}/${totalQuestions}</p>
            <p>Questions Answered: ${answeredCount}/${totalQuestions}</p>
            ${timeExpired ? '<p>Time Expired!</p>' : ''}
            ${violation ? '<p>Quiz rules violated! Quiz auto-submitted.</p>' : ''}
            <p>You can now navigate through the questions to see the correct answers.</p>
            <div id="author-controls" style="margin-top: 20px; padding: 10px; border: 1px dashed #ccc; background-color: #f9f9f9;">
                <p><strong>Author Controls:</strong></p>
                <input type="password" id="author-password" placeholder="Author Password">
                <button id="toggle-answers-btn">Show Answers</button>
                <p id="author-feedback" style="color: red; display: none;">Incorrect author password!</p>
            </div>
        `;

        resultDiv.style.display = "block";

        // Set up the toggle answers button
        document.getElementById("toggle-answers-btn").addEventListener("click", function() {
            const authorPasswordInput = document.getElementById("author-password");
            const authorFeedback = document.getElementById("author-feedback");
            
            if (authorPasswordInput.value === authorPassword) {
                showAnswersEnabled = !showAnswersEnabled;
                this.textContent = showAnswersEnabled ? "Hide Answers" : "Show Answers";
                authorFeedback.style.display = "none";
                
                if (showAnswersEnabled) {
                    showCorrectAnswers();
                } else {
                    hideCorrectAnswers();
                }
                
                // Update navigation button styles
                updateNavigationButtonStyles();
            } else {
                authorFeedback.style.display = "block";
                authorPasswordInput.value = "";
            }
        });

        // Disable all inputs but keep navigation enabled
        document.querySelectorAll("input[type=radio]").forEach(input => {
            input.disabled = true;
        });

        // Enable navigation buttons for review
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        submitBtn.disabled = true;

        // Show navigation buttons for review mode
        prevBtn.style.display = "inline-block";
        nextBtn.style.display = "inline-block";
        submitBtn.style.display = "none";

        // Update navigation button styles to show answer status
        updateNavigationButtonStyles();

        // Only show correct answers if enabled
        if (showAnswersEnabled) {
            showCorrectAnswers();
        }

        // End quiz state
        quizStarted = false;
    }

    // Show correct answers in each question
    function showCorrectAnswers() {
        questions.forEach((question, index) => {
            const questionKey = `q${index + 1}`;
            const correctAnswer = correctAnswers[questionKey];

            // Create or find the correct answer display element
            let answerDisplay = question.querySelector('.correct-answer-display');
            if (!answerDisplay) {
                answerDisplay = document.createElement('div');
                answerDisplay.className = 'correct-answer-display';
                answerDisplay.style.marginTop = '10px';
                answerDisplay.style.padding = '10px';
                answerDisplay.style.backgroundColor = '#e8f5e9';
                answerDisplay.style.border = '1px solid #4CAF50';
                answerDisplay.style.borderRadius = '5px';
                question.appendChild(answerDisplay);
            }

            // Show the correct answer
            answerDisplay.innerHTML = `<strong>Correct Answer:</strong> ${correctAnswer}`;
            answerDisplay.style.display = 'block';

            // Highlight the correct and user-selected options
            const options = question.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                const optionLabel = option.parentElement;

                // Reset styles
                optionLabel.style.fontWeight = 'normal';

                // Highlight correct answer
                if (option.value === correctAnswer) {
                    optionLabel.style.color = '#4CAF50';
                    optionLabel.style.fontWeight = 'bold';
                }

                // Highlight user's incorrect answer if applicable
                const userAnswer = userAnswers[questionKey];
                if (userAnswer && userAnswer !== correctAnswer && option.value === userAnswer) {
                    optionLabel.style.color = '#f44336';
                    optionLabel.style.fontWeight = 'bold';
                }
            });
        });
    }

    // Hide correct answers
    function hideCorrectAnswers() {
        questions.forEach((question) => {
            // Hide correct answer display
            const answerDisplay = question.querySelector('.correct-answer-display');
            if (answerDisplay) {
                answerDisplay.style.display = 'none';
            }

            // Reset option styles
            const options = question.querySelectorAll('input[type="radio"]');
            options.forEach(option => {
                const optionLabel = option.parentElement;
                optionLabel.style.color = '';
                optionLabel.style.fontWeight = 'normal';
            });
        });
    }

    // Update navigation button styles
    function updateNavigationButtonStyles() {
        document.querySelectorAll('.right.box .btn').forEach((btn, i) => {
            const qKey = `q${i + 1}`;
            btn.disabled = false;

            // Clear previous classes
            btn.classList.remove('answered', 'correct', 'incorrect', 'not-attempted');

            // If answers are enabled, show correct/incorrect status
            if (showAnswersEnabled) {
                if (userAnswers[qKey]) {
                    if (userAnswers[qKey] === correctAnswers[qKey]) {
                        btn.classList.add('correct');
                    } else {
                        btn.classList.add('incorrect');
                    }
                } else {
                    btn.classList.add('not-attempted');
                }
            } else {
                // If answers are disabled, just show which ones were answered
                if (userAnswers[qKey]) {
                    btn.classList.add('answered');
                }
            }
        });

        // Add CSS for colored buttons
        const styleEl = document.createElement("style");
        styleEl.textContent = `
            .right.box .btn.correct {
                background-color: #4CAF50;
                color: white;
            }
            .right.box .btn.incorrect {
                background-color: #f44336;
                color: white;
            }
            .right.box .btn.not-attempted {
                background-color: #ff9800;
                color: white;
            }
            .right.box .btn.active {
                border: 3px solid #2196F3;
            }
            .right.box .btn.answered {
                background-color: #2196F3;
                color: white;
            }
        `;
        document.head.appendChild(styleEl);
    }

    // Event listeners
    prevBtn.addEventListener("click", function () {
        if (currentQuestionIndex > 0) {
            showQuestion(currentQuestionIndex - 1);
        }
    });

    nextBtn.addEventListener("click", function () {
        if (currentQuestionIndex < questions.length - 1) {
            showQuestion(currentQuestionIndex + 1);
        }
    });

    submitBtn.addEventListener("click", function () { submitQuiz(false); });

    // Initialize the quiz - but don't start timer yet
    showQuestion(0);
    // updateTimer() is now only called when quiz actually starts
});
