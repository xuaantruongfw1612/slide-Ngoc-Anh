// Russian Roulette Game Logic with Multiple Choice Questions
class RussianRouletteGame {
    constructor() {
        this.chambers = 6;
        this.bulletPosition = -1;
        this.currentPosition = 0;
        this.attempts = 6;
        this.gameOver = false;
        this.shotsFired = 0;
        this.cylinder = document.getElementById('cylinder');
        this.spinBtn = document.getElementById('spinBtn');
        this.shootBtn = document.getElementById('shootBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.gameMessage = document.getElementById('gameMessage');
        this.attemptsLeft = document.getElementById('attemptsLeft');
        
        // Bộ câu hỏi trắc nghiệm về Urbanisation
        this.questions = [
            {
                question: "What is urbanisation?",
                options: [
                    "The process of cities growing and people moving from rural to urban areas",
                    "The process of building more farms",
                    "The process of returning to villages"
                ],
                correct: 0
            },
            {
                question: "Which is a positive effect of urbanisation?",
                options: [
                    "Loss of farmland",
                    "Better job opportunities and modern housing",
                    "Traffic congestion"
                ],
                correct: 1
            },
            {
                question: "Which is a negative effect of urbanisation?",
                options: [
                    "Improved infrastructure",
                    "Better healthcare",
                    "High housing prices and pollution"
                ],
                correct: 2
            },
            {
                question: "What was Hanoi like before urbanisation?",
                options: [
                    "Full of skyscrapers and modern buildings",
                    "Mostly farmland and small villages",
                    "A desert with no people"
                ],
                correct: 1
            },
            {
                question: "Which is an example of modern development in Hanoi?",
                options: [
                    "Times City and Vinhomes Smart City",
                    "Traditional rice fields",
                    "Ancient temples only"
                ],
                correct: 0
            },
            {
                question: "Why is sustainable urbanisation important?",
                options: [
                    "To make cities as big as possible",
                    "To balance development with quality of life and environment",
                    "To remove all traditional culture"
                ],
                correct: 1
            },
            {
                question: "How has infrastructure improved in Hanoi?",
                options: [
                    "Roads became narrower",
                    "Wider roads, bridges, and metro system",
                    "All transportation was removed"
                ],
                correct: 1
            },
            {
                question: "What challenge does rapid urbanisation create?",
                options: [
                    "Too much fresh air",
                    "Traffic congestion and environmental pollution",
                    "Too many trees"
                ],
                correct: 1
            },
            {
                question: "What job opportunities has urbanisation created?",
                options: [
                    "Only farming jobs",
                    "Jobs in services, commerce, education, and technology",
                    "No new jobs were created"
                ],
                correct: 1
            },
            {
                question: "How has urbanisation affected traditional villages?",
                options: [
                    "Villages have grown bigger",
                    "Many villages and farmlands were replaced by urban development",
                    "Villages remained exactly the same"
                ],
                correct: 1
            },
            {
                question: "What is gentrification?",
                options: [
                    "When poor areas become expensive and force residents to leave",
                    "Building more parks",
                    "Making cities smaller"
                ],
                correct: 0
            },
            {
                question: "Which public facility has improved due to urbanisation?",
                options: [
                    "Hospitals, schools, and parks",
                    "Only entertainment centers",
                    "Nothing has improved"
                ],
                correct: 0
            }
        ];
        
        this.usedQuestions = [];
        this.init();
    }
    
    init() {
        this.spinBtn.addEventListener('click', () => this.spinCylinder());
        this.shootBtn.addEventListener('click', () => this.pullTrigger());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        // Đặt viên đạn ngay từ đầu
        this.placeBullet();
    }
    
    placeBullet() {
        // Đặt viên đạn ở vị trí ngẫu nhiên từ 0-5
        this.bulletPosition = Math.floor(Math.random() * this.chambers);
        console.log(`Bullet placed at position: ${this.bulletPosition + 1}`); // Debug
    }
    
    getRandomQuestion() {
        // Lọc các câu hỏi chưa dùng
        let availableQuestions = this.questions.filter(
            (q, index) => !this.usedQuestions.includes(index)
        );
        
        // Nếu đã hết câu hỏi, reset lại
        if (availableQuestions.length === 0) {
            this.usedQuestions = [];
            availableQuestions = this.questions;
        }
        
        // Chọn câu hỏi ngẫu nhiên
        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const selectedQuestion = availableQuestions[randomIndex];
        
        // Đánh dấu câu hỏi đã dùng
        const originalIndex = this.questions.indexOf(selectedQuestion);
        this.usedQuestions.push(originalIndex);
        
        return selectedQuestion;
    }
    
    showQuestion(questionData) {
        // Tạo modal hiển thị câu hỏi
        const modal = document.createElement('div');
        modal.className = 'question-modal';
        
        const optionsHTML = questionData.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C
            return `
                <button class="option-btn" data-index="${index}">
                    <span class="option-letter">${letter}.</span> ${option}
                </button>
            `;
        }).join('');
        
        modal.innerHTML = `
            <div class="question-content">
                <h2>💀 You're Hit! Answer This Question:</h2>
                <div class="question-text">${questionData.question}</div>
                <div class="options-container">
                    ${optionsHTML}
                </div>
                <div class="result-message" id="resultMessage"></div>
                <button class="close-modal-btn" id="closeModalBtn" style="display: none;">Continue</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners cho các nút đáp án
        const optionBtns = modal.querySelectorAll('.option-btn');
        const resultMessage = document.getElementById('resultMessage');
        const closeBtn = document.getElementById('closeModalBtn');
        
        optionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedIndex = parseInt(btn.getAttribute('data-index'));
                
                // Disable tất cả các nút
                optionBtns.forEach(b => b.disabled = true);
                
                // Check đáp án
                if (selectedIndex === questionData.correct) {
                    // Đúng!
                    btn.classList.add('correct');
                    resultMessage.innerHTML = '🎉 <strong>Correct!</strong> Well done!';
                    resultMessage.className = 'result-message correct-answer';
                } else {
                    // Sai!
                    btn.classList.add('wrong');
                    optionBtns[questionData.correct].classList.add('correct');
                    resultMessage.innerHTML = '❌ <strong>Wrong!</strong> The correct answer is highlighted.';
                    resultMessage.className = 'result-message wrong-answer';
                }
                
                // Hiển thị nút continue
                closeBtn.style.display = 'inline-block';
            });
        });
        
        // Event listener cho nút close
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    spinCylinder() {
        if (this.gameOver) return;
        
        // Disable buttons during spin
        this.spinBtn.disabled = true;
        this.shootBtn.disabled = true;
        
        // Visual effect only - bullet position is already set
        this.cylinder.classList.add('spinning');
        
        // Update chamber display
        const chambers = this.cylinder.querySelectorAll('.chamber');
        chambers.forEach((chamber, index) => {
            chamber.classList.remove('loaded');
        });
        
        setTimeout(() => {
            this.cylinder.classList.remove('spinning');
            this.spinBtn.disabled = false;
            this.shootBtn.disabled = false;
            this.gameMessage.textContent = "Cylinder spun! Ready to pull the trigger?";
            this.gameMessage.className = 'game-message';
        }, 800);
    }
    
    pullTrigger() {
        if (this.gameOver || this.bulletPosition === -1) return;
        
        this.shootBtn.disabled = true;
        this.spinBtn.disabled = true;
        this.shotsFired++;
        
        // Check if bullet in current position
        if (this.currentPosition === this.bulletPosition) {
            // BANG! Game over - Show question
            this.gameOver = true;
            this.gameMessage.textContent = "💀 BANG! You're hit! Answer the question!";
            this.gameMessage.className = 'game-message dead';
            
            // Show bullet position
            const chambers = this.cylinder.querySelectorAll('.chamber');
            chambers[this.bulletPosition].classList.add('loaded');
            
            // Shake effect
            this.cylinder.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                this.cylinder.style.animation = '';
            }, 500);
            
            // Show random question after delay
            setTimeout(() => {
                const questionData = this.getRandomQuestion();
                this.showQuestion(questionData);
            }, 1500);
            
        } else {
            // Safe!
            this.attempts--;
            this.attemptsLeft.textContent = this.attempts;
            
            // Update bullet icon
            const bulletIcon = document.getElementById(`bullet${6 - this.attempts}`);
            if (bulletIcon) {
                bulletIcon.classList.add('used');
            }
            
            if (this.attempts === 0) {
                // Win! (This should never happen now since bullet is guaranteed)
                this.gameOver = true;
                this.gameMessage.textContent = "🎉 You survived! You're incredibly lucky! 🎉";
                this.gameMessage.className = 'game-message win';
            } else {
                this.gameMessage.textContent = `Click! You're safe... for now. (${this.attempts} left)`;
                this.gameMessage.className = 'game-message safe';
                
                setTimeout(() => {
                    this.spinBtn.disabled = false;
                }, 1000);
            }
        }
        
        // Move to next position
        this.currentPosition = (this.currentPosition + 1) % this.chambers;
    }
    
    resetGame() {
        this.currentPosition = 0;
        this.attempts = 6;
        this.gameOver = false;
        this.shotsFired = 0;
        this.usedQuestions = [];
        
        this.spinBtn.disabled = false;
        this.shootBtn.disabled = true;
        this.attemptsLeft.textContent = this.attempts;
        this.gameMessage.textContent = '';
        this.gameMessage.className = 'game-message';
        
        // Reset chambers
        const chambers = this.cylinder.querySelectorAll('.chamber');
        chambers.forEach(chamber => {
            chamber.classList.remove('loaded');
        });
        
        // Reset bullet icons
        for (let i = 1; i <= 6; i++) {
            const bulletIcon = document.getElementById(`bullet${i}`);
            if (bulletIcon) {
                bulletIcon.classList.remove('used');
            }
        }
        
        // Remove any existing modals
        const existingModal = document.querySelector('.question-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Đặt lại viên đạn ở vị trí mới
        this.placeBullet();
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new RussianRouletteGame();
});

