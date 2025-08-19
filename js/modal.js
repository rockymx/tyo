/**
 * Modal management for the TyO Directory
 */

import { handleError, trapFocus } from './utils.js';

class ModalManager {
  constructor() {
    this.activeModal = null;
    this.previousFocus = null;
    this.modals = new Map();
    
    this.init();
  }
  
  init() {
    try {
      this.bindElements();
      this.bindEvents();
    } catch (error) {
      handleError(error, 'ModalManager.init');
    }
  }
  
  bindElements() {
    // Register promotion modal
    const promoModal = document.getElementById('promoModal');
    const promoButton = document.getElementById('promoButton');
    const modalClose = document.getElementById('modalClose');
    
    if (promoModal && promoButton && modalClose) {
      this.registerModal('promo', {
        modal: promoModal,
        trigger: promoButton,
        closeButton: modalClose
      });
    }
  }
  
  bindEvents() {
    // Global escape key handler
    document.addEventListener('keydown', this.handleGlobalKeydown.bind(this));
    
    // Prevent scroll when modal is open
    document.addEventListener('modal:opened', () => {
      document.body.style.overflow = 'hidden';
    });
    
    document.addEventListener('modal:closed', () => {
      document.body.style.overflow = '';
    });
  }
  
  registerModal(id, elements) {
    try {
      const { modal, trigger, closeButton } = elements;
      
      if (!modal) {
        throw new Error(`Modal element not found for ${id}`);
      }
      
      this.modals.set(id, {
        modal,
        trigger,
        closeButton,
        isOpen: false
      });
      
      // Bind events for this modal
      if (trigger) {
        trigger.addEventListener('click', () => this.openModal(id));
      }
      
      if (closeButton) {
        closeButton.addEventListener('click', () => this.closeModal(id));
      }
      
      // Close on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(id);
        }
      });
      
      // Set up ARIA attributes
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'true');
      
      if (trigger) {
        const modalTitle = modal.querySelector('.modal-title');
        if (modalTitle) {
          const titleId = `modal-title-${id}`;
          modalTitle.id = titleId;
          modal.setAttribute('aria-labelledby', titleId);
        }
      }
      
    } catch (error) {
      handleError(error, `ModalManager.registerModal(${id})`);
    }
  }
  
  openModal(id) {
    try {
      const modalData = this.modals.get(id);
      
      if (!modalData) {
        throw new Error(`Modal ${id} not found`);
      }
      
      const { modal } = modalData;
      
      // Close any currently open modal
      if (this.activeModal) {
        this.closeModal(this.activeModal);
      }
      
      // Store current focus
      this.previousFocus = document.activeElement;
      
      // Open modal
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      modalData.isOpen = true;
      this.activeModal = id;
      
      // Trap focus within modal
      trapFocus(modal);
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('modal:opened', {
        detail: { modalId: id, modal }
      }));
      
    } catch (error) {
      handleError(error, `ModalManager.openModal(${id})`);
    }
  }
  
  closeModal(id) {
    try {
      const modalData = this.modals.get(id);
      
      if (!modalData) {
        throw new Error(`Modal ${id} not found`);
      }
      
      const { modal } = modalData;
      
      // Close modal
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      modalData.isOpen = false;
      
      if (this.activeModal === id) {
        this.activeModal = null;
      }
      
      // Restore focus
      if (this.previousFocus) {
        this.previousFocus.focus();
        this.previousFocus = null;
      }
      
      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('modal:closed', {
        detail: { modalId: id, modal }
      }));
      
    } catch (error) {
      handleError(error, `ModalManager.closeModal(${id})`);
    }
  }
  
  closeActiveModal() {
    if (this.activeModal) {
      this.closeModal(this.activeModal);
    }
  }
  
  handleGlobalKeydown(e) {
    if (e.key === 'Escape' && this.activeModal) {
      e.preventDefault();
      this.closeActiveModal();
    }
  }
  
  // Public API
  isModalOpen(id) {
    const modalData = this.modals.get(id);
    return modalData ? modalData.isOpen : false;
  }
  
  getActiveModal() {
    return this.activeModal;
  }
  
  hasActiveModal() {
    return this.activeModal !== null;
  }
  
  toggleModal(id) {
    const modalData = this.modals.get(id);
    if (modalData) {
      if (modalData.isOpen) {
        this.closeModal(id);
      } else {
        this.openModal(id);
      }
    }
  }
}

export default ModalManager;