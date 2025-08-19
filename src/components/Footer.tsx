import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <a 
          href="https://wa.link/s5xddq" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-whatsapp" 
          title="Contactar por WhatsApp"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
        <span className="footer-text">Solicita acceso a todos los libros</span>
      </div>
    </footer>
  );
}