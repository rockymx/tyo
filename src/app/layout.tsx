import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { SearchProvider } from '@/contexts/SearchContext';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TyO - Directorio de Enlaces Especializados',
  description: 'TyO - Directorio especializado de enlaces médicos y recursos ortopédicos. Accede a libros, guías y material educativo de alta calidad.',
  keywords: 'ortopedia, traumatología, medicina, libros médicos, recursos educativos, AO, Campbell, Rockwood',
  authors: [{ name: 'TyO Directory' }],
  openGraph: {
    title: 'TyO - Directorio de Enlaces Especializados',
    description: 'Accede a recursos médicos especializados en ortopedia y traumatología',
    type: 'website',
    url: 'https://tyo-directory.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TyO - Directorio de Enlaces Especializados',
    description: 'Accede a recursos médicos especializados en ortopedia y traumatología',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
        />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <FavoritesProvider>
            <SearchProvider>
              {children}
            </SearchProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}