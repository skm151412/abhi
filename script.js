document.addEventListener("DOMContentLoaded", function () {
    // Setup variables
    const questions = document.querySelectorAll(".question");
    const totalQuestions = questions.length;
    let currentQuestionIndex = 0;
    let userAnswers = {};
    let quizStarted = false;
    const quizPassword = "abhishek36"; // Default password for the quiz

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
        q1: "A", // Excessive spending by the monarchy
        q2: "C", // Third Estate
        q3: "B", // Pledging to draft a new constitution
        q4: "C", // Louis XVI
        q5: "B", // To address the financial crisis
        q6: "B", // First and Second Estates
        q7: "B", // The Storming of the Bastille
        q8: "B", // Limit the king’s authority
        q9: "B", // Men over 25 paying certain taxes
        q10: "A", // Declaration of the Rights of Man
        q11: "B", // One member, one vote
        q12: "B", // Mirabeau and Abbé Sieyès
        q13: "B", // Treason
        q14: "A", // Public executions
        q15: "A", // La Marseillaise
        q16: "B", // Roget de L’Isle
        q17: "B", // Workers without breeches
        q18: "B", // Liberty
        q19: "B", // Robespierre
        q20: "C", // Shopkeepers and workers
        q21: "B", // 1804
        q22: "C", // Ideas of liberty and democracy
        q23: "B", // 1946
        q24: "C", // Both A and B
        q25: "C", // 60
        q26: "B", // It denied them voting rights
        q27: "C", // Seventeenth
        q28: "B", // 1848
        q29: "B", // Nantes and Bordeaux
        q30: "C", // Both A and B
        q31: "B", // Enlightenment principles
        q32: "B", // Absolute monarchy
        q33: "B", // To protect revolutionary ideals
        q34: "B", // Particles are constantly moving
        q35: "C", // Light
        q36: "B", // It has large spaces between particles
        q37: "C", // Gas
        q38: "B", // They gain kinetic energy
        q39: "B", // Solid to gas
        q40: "B", // Its particles have high kinetic energy
        q41: "B", // Surface area of the liquid
        q42: "B", // Milk
        q43: "B", // Particles absorb heat from surroundings
        q44: "B", // It increases with increasing pressure
        q45: "B", // Increase in temperature
        q46: "D", // Plasma
        q47: "B", // It increases
        q48: "B", // Particles have strong intermolecular forces
        q49: "C", // Food coloring
        q50: "B", // Condensation
        q51: "B", // Sugar particles occupy spaces between water particles
        q52: "C", // They are highly compressible
        q53: "B", // They decrease
        q54: "B", // It absorbs sweat and aids evaporation
        q55: "B", // Low humidity and high temperature
        q56: "C", // Both liquid and gas
        q57: "B", // It has a larger surface area
        q58: "B", // Dry ice
        q59: "B", // Particles have large spaces between them
        q60: "C", // It remains constant
        q61: "C", // Evaporation
        q62: "C", // It is a surface phenomenon
        q63: "B", // It increases the rate
        q64: "A", // Nitrogen, water, iron
        q65: "B", // Particles have moderate intermolecular forces
        q66: "B", // Heat energy
        q67: "C", // Rational number is 5/9
        q68: "B", // 0.45̅ = 45/99
        q69: "B", // Irrational number is √10
        q70: "B", // Sum of rational and irrational is always irrational
        q71: "A", // Rationalized form is 3√5/5
        q72: "B", // Rational number between 2/3 and 3/4 is 17/24
        q73: "A", // 1.6̅ = 5/3
        q74: "C", // Non-terminating decimal is 5/12
        q75: "A", // a = -7
        q76: "C", // Product of two irrational numbers can be rational or irrational
        q77: "B", // 0.32̅ = 29/90
        q78: "B", // Irrational number is √8
        q79: "B", // Difference between rational and irrational is always irrational
        q80: "A", // Rationalized form is 4 - 2√2
        q81: "B", // Rational number between 1/5 and 2/5 is 3/10
        q82: "D", // 2.45̅ = 223/99
        q83: "C", // Terminating decimal is 5/16
        q84: "A", // b = -10/23
        q85: "B", // Quotient of non-zero rational and irrational is always irrational
        q86: "B", // 0.18̅ = 18/99
        q87: "B", // Irrational number is √12
        q88: "A", // Sum of two rational numbers is always rational
        q89: "A", // Rationalized form is 6(√3 + √2)
        q90: "B", // Rational number between 3/8 and 5/8 is 1/2
        q91: "A", // 3.27̅ = 327/99
        q92: "B", // Non-terminating repeating decimal is 4/15
        q93: "B", // a = 21/11
        q94: "D", // Product of rational and zero is always zero
        q95: "A", // 0.123̅ = 123/999
        q96: "B", // Irrational number is √15
        q97: "C", // Difference between two irrational numbers can be rational or irrational
        q98: "B", // Rationalized form is 2(√7 - √3)/4
        q99: "B", // Rational number between 4/7 and 6/7 is 5/7
        q100: "C" // 4.18̅ = 418/99
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
            const qKey = `q${i+1}`;
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
