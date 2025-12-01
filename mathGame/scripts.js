const gameState = { 
    currentLevel: 'easy', 
    correctAnswers: 0, 
    wrongAnswers: 0, 
    questionCount: 0, 
    usedQuestions: [], 
    timeLeft: 300, 
    timerInterval: null, 
    isGameActive: true 
}; 

const elements = { 
    level: document.getElementById('level'), 
    correct: document.getElementById('correct'),
     wrong: document.getElementById('wrong'), 
     time: document.getElementById('time'), 
     question: document.getElementById('current-question'),
    questionCount: document.getElementById('question'), 
    userAnswer: document.getElementById('user-answer'), 
    submitBtn: document.getElementById('submit-btn'), 
    message: document.getElementById('message'), 
    exitBtn: document.getElementById('exit-btn'), 
    restartBtn: document.getElementById('restart-btn') 
};

const levelGenerators = {
    easy: function () { 
        const num1 = Math.floor(Math.random() * 15) + 1; 
        const num2 = Math.floor(Math.random() * 15) + 1; 
        const operators = ['+', '-', '*']; 
        const operator = operators[Math.floor(Math.random() * operators.length)]; 
        
        let question, answer; 
        
        if (operator === '-' && num1 < num2) { 
            question = `${ num2 } ${ operator } ${ num1 }`; 
            answer = eval(question); 
        } else { 
            question = `${ num1 } ${ operator } ${ num2 }`; 
            answer = eval(question); 
        } 
        return { 
            question, 
            answer: Number(answer), 
            type: 'arithmetic' 
        }; 
    }, 
    medium: function () { 
        const num1 = Math.floor(Math.random() * 20) + 1; 
        const num2 = Math.floor(Math.random() * 20) + 1; 
        const operators = ['>', '<', '=']; 
        const operator = operators[Math.floor(Math.random() * operators.length)]; 
        
        let question, answer; 
        
        if (operator === '=') { 
            question = `${ num1 } = ${ num2 }`; 
            if (num1 === num2) { 
                answer = true; 
            } else { 
                answer = false; 
            } 
        } else { 
            question = `${ num1 } ${ operator } ${ num2 }`; 
            if (operator === '>') { 
                if (num1 > num2) { 
                    answer = true; 
                } else { 
                    answer = false 
                } 
            } else if (operator === '<') { 
                if (num1 < num2) { 
                    answer = true; 
                } else { 
                    answer = false; 
                } 
            } 
        } 
        return { 
            question, 
            answer: Boolean(answer), 
            type: 'comparsion' 
        }; 
    }, 
    hard: function () { 
        if (Math.random() > 0.5) { 
            const values = [true, false]; 
            const val1 = values[Math.floor(Math.random() * values.length)]; 
            const val2 = values[Math.floor(Math.random() * values.length)]; 
            const operators = ['&&', '||']; 
            const operator = operators[Math.floor(Math.random() * operators.length)]; 
            
            const question = `${ val1 } ${ operator } ${ val2 }`; 
            const answer = eval(question); 
            
            return { 
                question, 
                answer: Boolean(answer), 
                type: 'logical' 
            }; 
        } else { 
            const decimal = Math.floor(Math.random() * 16) + 1; 
            const binary = decimal.toString(2); 
            const question = `Convert binary ${ binary } to decimal`; 
            return { question, answer: decimal, type: 'binary' 
                
            }; 
        } 
    } 
}; 
let currentQuestionData = null; 
function generateUniqueQuestion() { 
    if (!gameState.isGameActive) return null; 
    let newQuestion; 
    let attempts = 0;
     do { 
        newQuestion = levelGenerators[gameState.currentLevel](); 
        attempts++; 
    } while (gameState.usedQuestions.includes(newQuestion.question) && attempts < 50); 
    gameState.usedQuestions.push(newQuestion.question); 
    return newQuestion; 
} 
function normalizeUserAnswer(answer, questionType) { 
    if (!answer) return null; 
    const str = answer.toString().toLowerCase().trim(); 
    if (questionType === 'comparsion' || questionType === 'logical') { 
        const trueValues = ['true', 'правда', 'да', 'yes', '1', '+']; 
        const falseValues = ['false', 'ложь', 'нет', 'no', '0', '-']; 

        if (trueValues.includes(str)) return true; 
        if (falseValues.includes(str)) return false; 
        try { const parsed = JSON.parse(str); 
            if (typeof parsed === 'boolean') 
                return parsed; 
            } catch (e) { 

            } 
            return null; 
        } if (questionType === 'arithmetic' || questionType === 'binary') { 
            const num = Number(str); 
            return isNaN(num) ? null : num; 
        } 
        return null; 
} 
function checkAnswer(userAnswer, correctAnswer, questionType) { 
    const normalizedAnswer = normalizeUserAnswer(userAnswer, questionType); 
    if (normalizedAnswer === null) { 
        return false; 
    } 
    switch (questionType) { 
        case 'comparsion': 
        case 'logical': 
        return (typeof normalizedAnswer === 'boolean') && (Boolean(correctAnswer) === normalizedAnswer); 
        case 'binary': 
        case 'arithmetic': 
        return Number(normalizedAnswer) === Number(correctAnswer); 
        default: 
        return normalizedAnswer == correctAnswer; 
    } 
} 
function checkLevelProgress() { 
    if (gameState.questionCount >= 10) { 
        const successRate = (gameState.correctAnswers / 10) * 100;

        if (successRate >= 80) { 
            const levels = ['easy', 'medium', 'hard']; 
            const currentIndex = levels.indexOf(gameState.currentLevel);

            if (currentIndex < levels.length - 1) { 
                gameState.currentLevel = levels[currentIndex + 1]; 
                console.log(`Next level: ${ gameState.currentLevel }`); 

                gameState.questionCount = 0; 
                gameState.usedQuestions = []; 
                gameState.correctAnswers = 0; 
                gameState.wrongAnswers = 0; 
                
                return true; 
            } else { 
                console.log("Congratulations! You've completed all the levels"); 
                stopTimer(); 
                gameState.isGameActive = false; 
                return 'completed'; 
            } 
        } else { 
            console.log("Not enough correct answers"); 
            stopTimer(); 
            gameState.isGameActive = false; 
            return 'failed'; 
        } 
    } return false; 
} 
function updateStats() { 
    if (elements.level) elements.level.textContent = gameState.currentLevel; 
    if (elements.correct) elements.correct.textContent = gameState.correctAnswers; 
    if (elements.wrong) elements.wrong.textContent = gameState.wrongAnswers; 
    if (elements.questionCount) elements.questionCount.textContent = gameState.questionCount; 
    
    const minutes = Math.floor(gameState.timeLeft / 60); 
    const seconds = gameState.timeLeft % 60; 
    const timeString = `${ minutes }: ${ seconds.toString().padStart(2, '0') }`; 
    if (elements.time) elements.time.textContent = timeString; 

    console.log(`Level: ${ gameState.currentLevel }`); 
    console.log(`Right: ${ gameState.correctAnswers }`); 
    console.log(`Wrong: ${ gameState.wrongAnswers }`); 
    console.log(`Questions: ${ gameState.questionCount } / 10`); 
    console.log(`Time: ${ timeString }`); 
} 

function startTimer() { 
    if (gameState.timerInterval) { 
        clearInterval(gameState.timerInterval); 
    } 
    gameState.timerInterval = setInterval(() => { 
        gameState.timeLeft--; 
        updateStats(); 
        if (gameState.timeLeft <= 0) { 
            endGame('time'); 
        } 
    }, 1000); 
} 

function stopTimer() { 
    if (gameState.timerInterval) { 
        clearInterval(gameState.timerInterval); 
        gameState.timerInterval = null; 
    } 
} 

function endGame(reason) { 
    stopTimer(); 
    gameState.isGameActive = false; 
    console.log("\nGame Over"); 
    if (reason === "time") { 
        console.log("Time's up"); 
        showMessage("Time's up! ⏰", false); 
    } 
} 

function displayQuestion(questionData) { 
    currentQuestionData = questionData; 
    if (elements.question) { 
        elements.question.textContent = questionData.question; 
    } 
    if (elements.userAnswer) { 
        elements.userAnswer.value = ''; 
        if (questionData.type === 'comparison' || questionData.type === 'logical') { 
            elements.userAnswer.placeholder = "Enter: yes/no or true/false..."; 
        } else { 
            elements.userAnswer.placeholder = "Enter answer"; 
        } 
        elements.userAnswer.focus(); 
    } 
} 

function showMessage(text, isSuccess = true) { 
    if (elements.message) { 
        elements.message.textContent = text; 
        elements.message.className = isSuccess ? 'message-correct' : 'message-incorrect'; 
    } 
    console.log(isSuccess ? "✅ " : "❌ ", text); 
} 

function handleAnswer() { 
    if (!gameState.isGameActive || !currentQuestionData) return; 
    const userAnswer = elements.userAnswer ? elements.userAnswer.value.trim() : ''; 
    if (!userAnswer) { 
        showMessage("Please enter your answer", false); 
        return; 
    } 
    const isCorrect = checkAnswer(userAnswer, currentQuestionData.answer, currentQuestionData.type); 
    if (isCorrect) { 
        gameState.correctAnswers++; showMessage("Correct! ✅", true); 
    } else { 
        gameState.wrongAnswers++; 
        let correctAnswerText; 
        if (currentQuestionData.type === 'comparison' || currentQuestionData.type === 'logical') { 
            correctAnswerText = currentQuestionData.answer ? 'true/yes/правда' : 'false/no/ложь'; 
        } else { 
            correctAnswerText = currentQuestionData.answer; 
        } 
        showMessage(`Wrong! Correct answer: ${ correctAnswerText }`, false); 
    } 
    gameState.questionCount++; 
    updateStats(); 
    setTimeout(() => { const progress = checkLevelProgress(); 
        if (progress === true) { 
            showMessage(`Level completed! Moving to ${ gameState.currentLevel }`, true); 
            setTimeout(() => { currentQuestionData = generateUniqueQuestion(); 
                if (currentQuestionData) { 
                    displayQuestion(currentQuestionData); 
                    showMessage(""); 
                } 
            }, 1500); 
        } else if (progress === 'completed') { 
            showMessage("🎉 Congratulations! You completed all levels!", true); 
        } else if (progress === 'failed') { 
            showMessage("😞 Try again! Not enough correct answers.", false); 
        } else { currentQuestionData = generateUniqueQuestion(); 
            if (currentQuestionData) { 
                displayQuestion(currentQuestionData); 
                showMessage(""); 
            } 
        } 
    }, 2000); 
} 

function initEventListeners() { 
    if (elements.submitBtn) { 
        elements.submitBtn.addEventListener('click', handleAnswer); 
    } if (elements.userAnswer) { 
        elements.userAnswer.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') { 
                handleAnswer(); 
            } 
        }); 
    } 
    if (elements.restartBtn) { 
        elements.restartBtn.addEventListener('click', restartGame); 
    } 
} 
function restartGame() { 
    stopTimer(); 
    gameState.currentLevel = 'easy'; 
    gameState.correctAnswers = 0; 
    gameState.wrongAnswers = 0; 
    gameState.questionCount = 0; 
    gameState.usedQuestions = []; 
    gameState.timeLeft = 300; 
    gameState.isGameActive = true; 
    updateStats(); 
    if (elements.question) elements.question.textContent = 'Get ready...'; 
    if (elements.message) elements.message.textContent = ''; 
    if (elements.restartBtn) elements.restartBtn.style.display = 'block'; 
    if (elements.exitBtn) elements.exitBtn.style.display = 'block'; 
    startTimer(); 
    setTimeout(() => { const questionData = generateUniqueQuestion(); 
        if (questionData) { 
            displayQuestion(questionData); 
        } 
    }, 1000);

    console.log("\nGame restarted"); 
    console.log("START GAME"); 
} 
document.addEventListener('DOMContentLoaded', function () {  
    initEventListeners(); 

    const startBtn = document.getElementById("start-btn");
    const startMenu = document.getElementById("start-menu");
    const gameContainer = document.querySelector(".game-container");

    startBtn.addEventListener("click", ()=> {
        const selectedLevel = document.querySelector('input[name="level"]:checked').value;

        gameState.currentLevel = selectedLevel;
        gameState.timeLeft = 300;
        gameState.isGameActive = true;

        startMenu.classList.add("hide");

        setTimeout(() => {
            startMenu.style.display = "none";

            gameContainer.style.display = "block";
            restartGame();
        }, 300);
    });
});