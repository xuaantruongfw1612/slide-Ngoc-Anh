// Russian Roulette Game Logic with Questions
class RussianRouletteGame {
    constructor() {
        this.chambers = 6;
        this.bulletPosition = -1;
        this.currentPosition = 0;
        this.attempts = 6;
        this.gameOver = false;
        this.cylinder = document.getElementById('cylinder');
        this.spinBtn = document.getElementById('spinBtn');
        this.shootBtn = document.getElementById('shootBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.gameMessage = document.getElementById('gameMessage');
        this.attemptsLeft = document.getElementById('attemptsLeft');
        
        // Bộ câu hỏi về Urbanisation
        this.questions = [
            {
                question: "What is urbanisation?",
                answer: "Urbanisation is the process of cities growing and changing, with more people moving from rural areas to live and work in cities."
            },
            {
                question: "Name one positive effect of urbanisation in Hanoi.",
                answer: "Better living standards, modern housing, more job opportunities, improved infrastructure (roads, metro), better public facilities (hospitals, schools, parks)."
            },
            {
                question: "Name one negative effect of urbanisation in Hanoi.",
                answer: "High housing prices, loss of farmland, traffic congestion, air pollution, environmental challenges from rapid construction."
            },
            {
                question: "What was Hanoi like before urbanisation?",
                answer: "Many areas were farmland and small villages. People depended mainly on agriculture. There were fewer roads, buildings, and modern facilities."
            },
            {
                question: "Give an example of modern development in Hanoi.",
                answer: "Times City, Vinhomes Smart City, modern apartment complexes, shopping centers, metro system, wider roads and bridges."
            },
            {
                question: "Why is sustainable urbanisation important?",
                answer: "To balance economic development with quality of life, protect the environment, and ensure the city remains livable for future generations."
            },
            {
                question: "How has infrastructure changed in Hanoi?",
                answer: "Wider roads, new bridges, metro system development, improved public transportation, and better connectivity between districts."
            },
            {
                question: "What challenges does rapid urbanisation create?",
                answer: "Traffic congestion, environmental pollution, high housing costs, loss of green spaces, strain on public services, and gentrification."
            },
            {
                question: "What job opportunities has urbanisation created in Hanoi?",
                answer: "More jobs in services, commerce, education, technology, construction, entertainment, and business sectors."
            },
            {
                question: "How has urbanisation affected traditional villages?",
                answer: "Many traditional villages and farmlands have been replaced by urban development, leading to loss of cultural heritage and agricultural land."
            }
        ];
        
        this.usedQuestions = [];
        this.init();
    }
    
    init() {
        this.spinBtn.addEventListener('click', () => this.spinCylinder());
        this.shootBtn.addEventListener('click', () => this.pullTrigger());
        this.resetBtn.addEventListener('click', () => this.resetGame());
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
        modal.innerHTML = `
            <div class="question-content">
                <h2>💀 You're Hit! Answer This Question:</h2>
                <div class="question-text">${questionData.question}</div>
                <button class="show-answer-btn" id="showAnswerBtn">Show Answer</button>
                <div class="answer-text" id="answerText" style="display: none;">
                    <strong>Answer:</strong><br>${questionData.answer}
                </div>
                <button class="close-modal-btn" id="closeModalBtn">Continue</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('showAnswerBtn').addEventListener('click', () => {
            document.getElementById('answerText').style.display = 'block';
            document.getElementById('showAnswerBtn').style.display = 'none';
        });
        
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            modal.remove();
        });
    }
    
    spinCylinder() {
        if (this.gameOver) return;
        
        // Disable buttons during spin
        this.spinBtn.disabled = true;
        this.shootBtn.disabled = true;
        
        // Random bullet position
        this.bulletPosition = Math.floor(Math.random() * this.chambers);
        
        // Visual effect
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
                // Win!
                this.gameOver = true;
                this.gameMessage.textContent = "🎉 You survived! You're incredibly lucky! 🎉";
                this.gameMessage.className = 'game-message win';
            } else {
                this.gameMessage.textContent = `✅ Click! You're safe... for now. (${this.attempts} left)`;
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
        this.bulletPosition = -1;
        this.currentPosition = 0;
        this.attempts = 6;
        this.gameOver = false;
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
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new RussianRouletteGame();
});

