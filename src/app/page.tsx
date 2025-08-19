'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CardsGrid from '@/components/CardsGrid';
import PromoModal from '@/components/PromoModal';
import Footer from '@/components/Footer';
import SkeletonLoader from '@/components/SkeletonLoader';
import { LinksConfig } from '@/types';
import linksData from '@/data/links.json';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [showingFavorites, setShowingFavorites] = useState(false);
  const [linksConfig] = useState<LinksConfig>(linksData);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === '/')) {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePromoClick = () => {
    setIsPromoModalOpen(true);
  };

  const handlePromoClose = () => {
    setIsPromoModalOpen(false);
  };

  return (
    <>
      <Header onPromoClick={handlePromoClick} />
      
      <div className="container">
        <div className="content-header">
          <p className="subtitle">Directorio de Enlaces Especializados</p>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <CardsGrid 
            linksConfig={linksConfig} 
            showingFavorites={showingFavorites}
          />
        )}
      </div>

      <Footer />
      
      <PromoModal 
        isOpen={isPromoModalOpen} 
        onClose={handlePromoClose} 
      />
    </>
  );
}