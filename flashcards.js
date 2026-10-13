const Flashcards = {
    init: function() {
        this.setupFlashcards();
    },

    setupFlashcards: function() {
        const optionButtons = document.querySelectorAll('.option-btn');
        const breakdown = document.getElementById('solutionBreakdown');
        const srsButtons = document.querySelectorAll('.srs-btn');
        const nextBtn = document.getElementById('nextCardBtn');

        // Handle Option Selection (Multiple Choice UI)
        optionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                optionButtons.forEach(b => {
                    b.classList.remove('bg-primary-container', 'text-on-primary-container', 'bg-error-container', 'text-on-error-container');
                    b.classList.add('bg-surface-container-high', 'text-on-surface');
                    const icon = b.querySelector('.feedback-icon');
                    if (icon) icon.classList.add('hidden');
                });

                const isCorrect = btn.getAttribute('data-correct') === 'true';
                const icon = btn.querySelector('.feedback-icon');

                if (isCorrect) {
                    btn.classList.remove('bg-surface-container-high', 'text-on-surface');
                    btn.classList.add('bg-primary-container', 'text-on-primary-container');
                    if (icon) {
                        icon.textContent = 'check_circle';
                        icon.classList.remove('hidden', 'text-error');
                        icon.classList.add('text-on-primary-container');
                    }
                } else {
                    btn.classList.remove('bg-surface-container-high', 'text-on-surface');
                    btn.classList.add('bg-error-container', 'text-on-error-container');
                    if (icon) {
                        icon.textContent = 'cancel';
                        icon.classList.remove('hidden');
                        icon.classList.add('text-error');
                    }
                }
                
                // Show breakdown if hidden (assuming it was hidden in some designs)
                if (breakdown) {
                    breakdown.classList.remove('hidden');
                    breakdown.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });

        // Simple SRS Spaced Rating selection logic
        srsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rating = e.currentTarget.querySelector('.font-title-md').textContent.trim().toLowerCase();
                // Store SRS logic here
                const flashcards = Storage.get(Storage.KEYS.FLASHCARDS) || [];
                // Simple mock logic for spacing
                let nextReviewDays = 1;
                if (rating === 'easy') nextReviewDays = 4;
                else if (rating === 'good') nextReviewDays = 2;
                else if (rating === 'hard') nextReviewDays = 1;
                else if (rating === 'again') nextReviewDays = 0; // today
                
                const nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + nextReviewDays);
                
                flashcards.push({
                    id: App.generateId(),
                    reviewedAt: new Date().toISOString(),
                    nextReview: nextDate.toISOString(),
                    rating: rating
                });
                Storage.set(Storage.KEYS.FLASHCARDS, flashcards);
                
                // Visual feedback
                srsButtons.forEach(b => {
                    b.classList.remove('border-primary', 'bg-primary/10');
                    b.classList.add('border-outline-variant');
                });
                e.currentTarget.classList.remove('border-outline-variant');
                e.currentTarget.classList.add('border-primary', 'bg-primary/10');
                
                // Auto-advance after short delay
                setTimeout(() => {
                    alert('Rating saved! Moving to next card...');
                    // In a real app we would load the next card here. 
                    // For static HTML, we reload or reset state.
                }, 500);
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                // Next card logic
                alert('Loading next flashcard...');
            });
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Flashcards.init();
});
