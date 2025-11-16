// Russian Roulette Game Logic
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
        
        this.init();
    }
    
    init() {
        this.spinBtn.addEventListener('click', () => this.spinCylinder());
        this.shootBtn.addEventListener('click', () => this.pullTrigger());
        this.resetBtn.addEventListener('click', () => this.resetGame());
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
        
        console.log(`Bullet in chamber: ${this.bulletPosition + 1}`); // Debug only
    }
    
    pullTrigger() {
        if (this.gameOver || this.bulletPosition === -1) return;
        
        this.shootBtn.disabled = true;
        this.spinBtn.disabled = true;
        
        // Check if bullet in current position
        if (this.currentPosition === this.bulletPosition) {
            // BANG! Game over
            this.gameOver = true;
            this.gameMessage.textContent = "💀 BANG! You're dead! Game Over! 💀";
            this.gameMessage.className = 'game-message dead';
            
            // Show bullet position
            const chambers = this.cylinder.querySelectorAll('.chamber');
            chambers[this.bulletPosition].classList.add('loaded');
            
            // Shake effect
            this.cylinder.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                this.cylinder.style.animation = '';
            }, 500);
            
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
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new RussianRouletteGame();
});

