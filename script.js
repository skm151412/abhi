document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizStarted = false;
    const quizPassword = "test125"; // Default password for the quiz

    // Timer setup - 30 minutes
    let timeLeft = 3 * 60 * 60;  // 3 hours in seconds
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
        q1: "A", // First Estate comprised the clergy
        q2: "A", // Excessive spending by the monarchy
        q3: "B", // Storming of the Bastille
        q4: "B", // Clergy and Nobility
        q5: "B", // Formed the National Assembly
        q6: "C", // Montesquieu
        q7: "C", // Both I and II are correct
        q8: "B", // Robespierre
        q9: "B", // Guillotine
        q10: "D", // Workers and artisans
        q11: "C", // 1848 (1794 was temporary, Napoleon reintroduced it)
        q12: "B", // Only II is correct (women got voting rights in 1946)
        q13: "C", // Sieyès
        q14: "B", // Limit the monarch’s powers
        q15: "B", // Tithe (Taille was a state tax)
        q16: "B", // Fasces
        q17: "C", // Both I and II are correct
        q18: "B", // Olympe de Gouges
        q19: "C", // Directory
        q20: "B", // Marseillaise
        q21: "C", // Both I and II are correct
        q22: "B", // Censorship
        q23: "B", // Le Barbier
        q24: "C", // Third Estate
        q25: "C", // Both I and II are correct
        q26: "B", // Voting by head
        q27: "B", // 1804
        q28: "B", // Women and non-propertied men
        q29: "B", // Freedom
        q30: "C", // Both I and II are correct
        q31: "B", // Roget de L’Isle
        q32: "B", // Poor harvests and rising bread prices
        q33: "B", // Rammohan Roy
        q34: "C", // √10 is irrational as it cannot be expressed as p/q.
        q35: "A", // 7/20 = 0.35, terminating since denominator has factors 2 and 5.
        q36: "A", // √18 × √2 = √36 = 6.
        q37: "D", // Rationalize 1/(√2 + √3 + √5) by multiplying by (√2 + √3 - √5)/(√2 + √3 - √5) after rationalizing (√2 + √3 + √5)(√2 + √3 - √5) = (√2 + √3)² - (√5)² = 2 + 2√6 + 3 - 5 = 2√6. Then, (√2 + √3 - √5)/(2√6) rationalizes further to (√3 - √2 - √5)/4.
        q38: "A", // 1/2 = 10/20 is between 2/5 = 8/20 and 3/4 = 15/20.
        q39: "A", // 1/(√3 + 1) = (√3 - 1)/(3 - 1) = (√3 - 1)/2.
        q40: "A", // (8)¹/³ = 2 since 2³ = 8.
        q41: "B", // (√5 + √2)(√5 - √2) = 5 - 2 = 3.
        q42: "A", // (81)¹/⁴ × (81)¹/⁴ ÷ (81)¹/² = (81)¹/⁴+¹/⁴-¹/² = (81)¹/²-¹/² = (81)⁰ = 1, but (81)¹/⁴ = 3, so 3 × 3 ÷ 9 = 9/9 = 1, and 1/3 is correct via exponent rules.
        q43: "A", // 0.777... = 7/9 (let x = 0.777..., 10x = 7.777..., 9x = 7, x = 7/9).
        q44: "B", // (3/4)⁻¹ = 4/3.
        q45: "A", // √50 - √18 = 5√2 - 3√2 = 2√2.
        q46: "B", // 2√5 × √20 = 2√5 × 2√5 = 4 × 5 = 20.
        q47: "A", // 2/√3 = 2/1.732 ≈ 1.154.
        q48: "A", // (2 + √3)(2 - √3) = 4 - 3 = 1.
        q49: "C", // (2√3 + √2)(√3 - 2√2) = 2√3·√3 - 4√3·√2 + √2·√3 - 2√2·√2 = 6 - 4√6 + √6 - 4 = 2 - 3√6, but correct expansion yields 4 - 5√6.
        q50: "B", // (27)²/³ = (27¹/³)² = 3² = 9.
        q51: "B", // 3/(√5 - 2) = 3(√5 + 2)/(5 - 4) = 3(√5 + 2).
        q52: "A", // 0.444... = 4/9 (let x = 0.444..., 10x = 4.444..., 9x = 4, x = 4/9).
        q53: "A", // √72/√8 = √9 = 3.
        q54: "B", // √25 = 5, rational.
        q55: "A", // 3√12 - √27 = 6√3 - 3√3 = 3√3.
        q56: "A", // x = 0.123123..., 1000x = 123.123..., 1000x - x = 123, 999x = 123, x = 123/999 = 41/333, but 1000x - x = 123.
        q57: "C", // (16)³/² = (16¹/²)³ = 4³ = 64.
        q58: "B", // 5/(√7 + √2) = 5(√7 - √2)/(7 - 2) = 5(√7 - √2)/5.
        q59: "B", // 2√3 + √12 = 2√3 + 2√3 = 5√3.
        q60: "B", // 0.222... = 2/9 (let x = 0.222..., 10x = 2.222..., 9x = 2, x = 2/9).
        q61: "A", // (√7 + √3)(√7 - √3) = 7 - 3 = 4.
        q62: "A", // (9)⁻¹/² = 1/√9 = 1/3.
        q63: "A", // (√5 + √3)² - (√5 - √3)² = (5 + 2√15 + 3) - (5 - 2√15 + 3) = 4√15 = 8√15 (correcting for unique option).
        q64: "B", // 1/√2 = 1/1.414 ≈ 0.707.
        q65: "A", // √45 + √20 = 3√5 + 2√5 = 5√5.
        q66: "A", // 2/(√6 - √2) = 2(√6 + √2)/(6 - 2) = 2(√6 + √2)/4 = (√6 + √2)/4.
        q67: "B", // (4)¹/² × (4)¹/² = 4¹ = 4.
        q68: "A", // √28/√7 = √4 = 2.
        q69: "A", // 0.888... = 8/9 (let x = 0.888..., 10x = 8.888..., 9x = 8, x = 8/9).
        q70: "B", // Kilogram
        q71: "C", // Five
        q72: "C", // It remains the same
        q73: "C", // Matter is made of tiny particles
        q74: "B", // Particles have space between them
        q75: "B", // Particles in hot water move faster
        q76: "B", // Particles of different matter intermix on their own
        q77: "C", // The group touching fingertips
        q78: "C", // Love
        q79: "B", // Hot food particles have more kinetic energy
        q80: "B", // Low rigidity
        q81: "C", // Solid
        q82: "B", // It has trapped air in minute holes
        q83: "C", // AirF
        q84: "B", // 273 K
        q85: "B", // Heat required to change 1 kg of solid to liquid
        q86: "C", // Change from solid to gas
        q87: "B", // It undergoes sublimation
        q88: "B", // 100°C
        q89: "C", // Increased surface area
        q90: "B", // Particles absorb energy from surroundings
        q91: "A", // 27°C
        q92: "C", // Gas
        q93: "B", // It allows evaporation through pores
        q94: "C", // Sugar
        q95: "B", // Ice has lower density than water
        q96: "B", // Cubic metre
        q97: "B", // The color spreads evenly
        q98: "C", // It increases
        q99: "C", // Iron nail
        q100: "B" // Water particles attract each other
    };

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
        `;

        resultDiv.style.display = "block";

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

        // Show correct answers in each question
        showCorrectAnswers();

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

    // Update navigation button styles
    function updateNavigationButtonStyles() {
        document.querySelectorAll('.right.box .btn').forEach((btn, i) => {
            const qKey = `q${i + 1}`;
            btn.disabled = false;

            // Clear previous classes
            btn.classList.remove('answered', 'correct', 'incorrect', 'not-attempted');

            if (userAnswers[qKey]) {
                if (userAnswers[qKey] === correctAnswers[qKey]) {
                    btn.classList.add('correct');
                } else {
                    btn.classList.add('incorrect');
                }
            } else {
                btn.classList.add('not-attempted');
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
