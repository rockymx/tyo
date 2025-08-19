import React from 'react';
import Modal from './Modal';

interface PromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PromoModal({ isOpen, onClose }: PromoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="modal-image">
        <div className="promo-image">
          <img 
            src="/img/promo.webp" 
            alt="Promoción TyO - +500 libros PDF" 
            className="promo-img"
          />
        </div>
        <div className="books-preview">
          <div className="book-covers">
            {/* Medical book covers grid */}
            <div className="book-cover book-1"></div>
            <div className="book-cover book-2"></div>
            <div className="book-cover book-3"></div>
            <div className="book-cover book-4"></div>
            <div className="book-cover book-5"></div>
            <div className="book-cover book-6"></div>
            <div className="book-cover book-7"></div>
            <div className="book-cover book-8"></div>
            <div className="book-cover book-9"></div>
          </div>
        </div>
        <div className="phone-mockup">
          <div className="phone-screen">
            <div className="app-header">TyO</div>
            <div className="app-list">
              <div className="list-item">📚 Anatomía</div>
              <div className="list-item">🔧 AO Foundation</div>
              <div className="list-item">⚙️ Artroplastia</div>
              <div className="list-item">🔍 Artroscopia</div>
              <div className="list-item">📖 Campbell</div>
              <div className="list-item">🏥 Clínica</div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-text">
        <h2 className="modal-title" id="modal-title">¡Oferta Especial!</h2>
        <p className="modal-description">
          Acceso completo a toda nuestra biblioteca médica con descuento exclusivo.
        </p>
        <a 
          href="https://wa.link/s5xddq" 
          target="_blank" 
          rel="noopener noreferrer"
          className="modal-cta"
        >
          <i className="fab fa-whatsapp"></i>
          Contactar
        </a>
      </div>
    </Modal>
  );
}