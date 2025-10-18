// Modal Management
class ModalManager {
    constructor() {
        this.promoModal = null;
        this.promoButton = null;
        this.modalClose = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindElements();
            this.bindEvents();
        });
    }

    bindElements() {
        this.promoModal = document.getElementById('promoModal');
        this.promoButton = document.getElementById('promoButton');
        this.modalClose = document.getElementById('modalClose');
    }

    bindEvents() {
        // Promo button click
        if (this.promoButton) {
            this.promoButton.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Close button click
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Backdrop click to close
        if (this.promoModal) {
            this.promoModal.addEventListener('click', (e) => {
                if (e.target === this.promoModal) {
                    this.closeModal();
                }
            });
        }

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeModal();
            }
        });
    }

    openModal() {
        if (!this.promoModal) return;
        
        this.isOpen = true;
        this.promoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.trapFocus();
        
        // Focus the close button
        setTimeout(() => {
            if (this.modalClose) {
                this.modalClose.focus();
            }
        }, 100);
    }

    closeModal() {
        if (!this.promoModal) return;
        
        this.isOpen = false;
        this.promoModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the button that opened the modal
        if (this.promoButton) {
            this.promoButton.focus();
        }
    }

    trapFocus() {
        if (!this.promoModal) return;
        
        const focusableElements = this.promoModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        const handleTabKey = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        
        // Remove existing listener if any
        this.promoModal.removeEventListener('keydown', this.tabHandler);
        
        // Add new listener
        this.tabHandler = handleTabKey;
        this.promoModal.addEventListener('keydown', this.tabHandler);
    }

    isModalOpen() {
        return this.isOpen;
    }
}

// Create global modal manager instance
window.modalManager = new ModalManager();