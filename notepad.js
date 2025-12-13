// Notepad Page Navigation
class AnimatedNotepad {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 5;
        this.isAnimating = false;
        
        this.pages = document.querySelectorAll('.page');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentPageDisplay = document.querySelector('.current-page');
        
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousPage();
            if (e.key === 'ArrowRight') this.nextPage();
        });
        
        // Touch swipe support
        this.setupTouchEvents();
        
        // Initialize first page
        this.updateNavigation();
        
        console.log(' Animated Notepad initialized!');
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages && !this.isAnimating) {
            this.animatePageTurn('next');
        }
    }
    
    previousPage() {
        if (this.currentPage > 1 && !this.isAnimating) {
            this.animatePageTurn('prev');
        }
    }
    
    animatePageTurn(direction) {
        this.isAnimating = true;
        
        const currentPageEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
        
        if (direction === 'next') {
            currentPageEl.classList.add('turning-next');
            
            setTimeout(() => {
                currentPageEl.classList.remove('active', 'turning-next');
                this.currentPage++;
                
                const nextPageEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
                nextPageEl.classList.add('active');
                
                this.updateNavigation();
                this.isAnimating = false;
                
                this.playPageTurnSound();
            }, 600);
        } else {
            this.currentPage--;
            const prevPageEl = document.querySelector(`.page[data-page="${this.currentPage}"]`);
            
            currentPageEl.classList.remove('active');
            prevPageEl.classList.add('turning-prev');
            
            setTimeout(() => {
                prevPageEl.classList.remove('turning-prev');
                prevPageEl.classList.add('active');
                
                this.updateNavigation();
                this.isAnimating = false;
                
                this.playPageTurnSound();
            }, 600);
        }
    }
    
    updateNavigation() {
        this.currentPageDisplay.textContent = this.currentPage;
        
        this.prevBtn.disabled = this.currentPage === 1;
        this.nextBtn.disabled = this.currentPage === this.totalPages;
        
        this.animatePageIndicator();
    }
    
    animatePageIndicator() {
        this.currentPageDisplay.style.transform = 'scale(1.3)';
        this.currentPageDisplay.style.color = '#fff';
        
        setTimeout(() => {
            this.currentPageDisplay.style.transform = 'scale(1)';
        }, 200);
    }
    
    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        const notepad = document.querySelector('.notepad');
        
        notepad.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        notepad.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next page
                    this.nextPage();
                } else {
                    // Swipe right - previous page
                    this.previousPage();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    playPageTurnSound() {
        const notepad = document.querySelector('.notepad');
        notepad.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            notepad.style.transform = 'scale(1)';
        }, 100);
    }
    
    goToPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.currentPage) {
            const direction = pageNumber > this.currentPage ? 'next' : 'prev';
            this.currentPage = pageNumber - (direction === 'next' ? 1 : -1);
            this.animatePageTurn(direction);
        }
    }
}

function setupChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const label = e.target.nextElementSibling;
            
            if (e.target.checked) {
                label.style.textDecoration = 'line-through';
                label.style.opacity = '0.6';
                label.style.color = '#999';
                
                createConfetti(e.target);
            } else {
                label.style.textDecoration = 'none';
                label.style.opacity = '1';
                label.style.color = '#555';
            }
        });
        
        if (checkbox.checked) {
            const label = checkbox.nextElementSibling;
            label.style.textDecoration = 'line-through';
            label.style.opacity = '0.6';
            label.style.color = '#999';
        }
    });
}

function createConfetti(element) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 10; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = rect.left + 'px';
        confetti.style.top = rect.top + 'px';
        confetti.style.width = '6px';
        confetti.style.height = '6px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0;
        let y = 0;
        let opacity = 1;
        
        const animate = () => {
            x += vx * 0.016;
            y += vy * 0.016 + 2;
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${x}px, ${y}px)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

function animateDecorations() {
    const decorations = document.querySelectorAll('.page-decoration > div');
    
    decorations.forEach((decoration, index) => {
        decoration.style.animation = `decorationFloat 3s ease-in-out infinite`;
        decoration.style.animationDelay = `${index * 0.5}s`;
    });
}

// Add hover effects to goal cards
function setupGoalCards() {
    const goalCards = document.querySelectorAll('.goal-card');
    
    goalCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function setupNotepadTransition() {
    const notepad = document.querySelector('.notepad');
    notepad.style.transition = 'transform 0.1s ease';
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize notepad
    const notepad = new AnimatedNotepad();
    
    // Setup interactive elements
    setupChecklist();
    animateDecorations();
    setupGoalCards();
    setupNotepadTransition();
    
    // Add keyboard shortcut hints
    console.log('⌨️ Keyboard shortcuts:');
    console.log('  ← Previous page');
    console.log('  → Next page');
    console.log('📱 Touch: Swipe left/right to navigate');
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimatedNotepad;
}
