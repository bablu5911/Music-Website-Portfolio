import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './index.css';

// Import Pages
import Home from './pages/Home';
import Releases from './pages/Releases';
import Snippets from './pages/Snippets';
import Teasers from './pages/Teasers';
import Projects from './pages/Projects';
import Posters from './pages/Posters';
import AboutArtist from './pages/AboutArtist';
import EPK from './pages/EPK';
import Streaming from './pages/Streaming';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Admin from './pages/Admin';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailingPosition, setTrailingPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch device on mount
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  // Update cursor coordinates
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isTouchDevice]);

  // Smooth lagging trailing ring (linear interpolation LERP)
  useEffect(() => {
    if (isTouchDevice) return;

    let animId;
    const updateTrailing = () => {
      setTrailingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15, // LERP speed coefficient
          y: prev.y + dy * 0.15
        };
      });
      animId = requestAnimationFrame(updateTrailing);
    };
    animId = requestAnimationFrame(updateTrailing);

    return () => cancelAnimationFrame(animId);
  }, [position, isTouchDevice]);

  // Track hover state across all interactive elements
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.classList.contains('track-row') ||
        target.closest('.track-row') ||
        target.classList.contains('play-btn') ||
        target.closest('.play-btn') ||
        target.classList.contains('profile-image-wrapper') ||
        target.closest('.profile-image-wrapper') ||
        target.classList.contains('platform-card') ||
        target.closest('.platform-card') ||
        target.classList.contains('poster-container') ||
        target.closest('.poster-container') ||
        target.classList.contains('trailer') ||
        target.closest('.trailer') ||
        target.classList.contains('timeline-node') ||
        target.closest('.timeline-node');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => window.removeEventListener('mouseover', handleMouseOver);
  }, [isTouchDevice]);

  // Global 3D Card Hover Tilts (GPU Accelerated)
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      const card = e.target.closest('.trailer, .audio-card, .poster-container, .project-card');
      if (!card) return;

      const box = card.getBoundingClientRect();
      const x = e.clientX - box.left - box.width / 2;
      const y = e.clientY - box.top - box.height / 2;

      const tiltX = (y / (box.height / 2)) * -6; // Moderate tilt
      const tiltY = (x / (box.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseOut = (e) => {
      const card = e.target.closest('.trailer, .audio-card, .poster-container, .project-card');
      if (!card) return;

      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouchDevice]);

  // Set default theme from localStorage on start
  useEffect(() => {
    const savedTheme = localStorage.getItem('siteTheme') || '';
    if (savedTheme) {
      document.documentElement.className = savedTheme;
    }
  }, []);

  return (
    <Router>
      <div className="app-main-wrapper">
        {/* Custom Interactive Cursor */}
        {!isTouchDevice && (
          <>
            <div 
              className="custom-cursor-dot" 
              style={{ left: `${position.x}px`, top: `${position.y}px` }}
            />
            <div 
              className={`custom-cursor-ring ${isHovered ? 'cursor-hover' : ''}`} 
              style={{ left: `${trailingPosition.x}px`, top: `${trailingPosition.y}px` }}
            />
          </>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/snippets" element={<Snippets />} />
          <Route path="/teasers" element={<Teasers />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/posters" element={<Posters />} />
          <Route path="/about" element={<AboutArtist />} />
          <Route path="/epk" element={<EPK />} />
          <Route path="/streaming" element={<Streaming />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          {/* Catch-all redirects to home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
