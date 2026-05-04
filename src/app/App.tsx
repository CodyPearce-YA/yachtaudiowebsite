import { HeroCarousel } from './components/HeroCarousel';
import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import logoImage from 'figma:asset/627b243c133f57164f5fbced833a197efa97830d.png';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}