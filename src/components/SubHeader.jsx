import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function SubHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sub-header">
      <h3 className="logo">Releases</h3>

      {/* Mobile Submenu toggle */}
      <button className="mobile-sub-toggle" onClick={toggleMenu} aria-label="Toggle releases menu">
        <span className="dots-icon">•••</span>
      </button>

      <nav className={`sub-nav-wrapper ${isOpen ? 'menu-active' : ''}`}>
        <ul>
          <li>
            <NavLink to="/releases" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Released Tracks
            </NavLink>
          </li>
          <li>
            <NavLink to="/snippets" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Future Snippets
            </NavLink>
          </li>
          <li>
            <NavLink to="/teasers" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Teasers
            </NavLink>
          </li>
          <li>
            <NavLink to="/projects" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Projects
            </NavLink>
          </li>
          <li>
            <NavLink to="/posters" onClick={closeMenu} className={({ isActive }) => isActive ? 'active-link' : ''}>
              Poster
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
