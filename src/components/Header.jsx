import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="global-main-header">
      <h3 className="logo">Pindawala Putt</h3>
      
      {/* Hamburger Icon for Mobile */}
      <button className="mobile-nav-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
        <svg viewBox="0 0 24 24" width="24" height="24">
          {isOpen ? (
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          ) : (
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          )}
        </svg>
      </button>

      {/* Navigation List */}
      <nav className={`header-nav ${isOpen ? 'menu-active' : ''}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/releases" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Releases
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              About Artist
            </NavLink>
          </li>
          <li>
            <NavLink to="/epk" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              EPK
            </NavLink>
          </li>
          <li>
            <a href="https://www.youtube.com/@pindawalaputt" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              Youtube
            </a>
          </li>
          <li>
            <NavLink to="/streaming" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Streaming Platforms
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Contact Us
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
