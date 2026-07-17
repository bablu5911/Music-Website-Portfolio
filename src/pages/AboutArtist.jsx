import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Styleaboutartist.css';

const timelineData = [
  {
    year: "2024",
    title: "Tribute Launch",
    desc: "First creative production releases and initial tribute skits building Udaipur's alternative scene."
  },
  {
    year: "2025",
    title: "Nightmare Era",
    desc: "Deep alternative rock influences meet heavy dark synth melodies and trap-influenced Punjabi hooks."
  },
  {
    year: "2026",
    title: "Chapter 7/21 Part 1",
    desc: "The milestone album drop, defining themes of survival, evolution, and independent lyricism."
  },
  {
    year: "July 2026",
    title: "Chapter 7/21 Part 2",
    desc: "The anticipated continuation album, taking production values and dynamic songwriting to the next level."
  }
];

export default function AboutArtist() {
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(2); // Default to 2026

  const navigate = useNavigate();

  const handleImageClick = () => {
    const currentTime = Date.now();
    
    if (currentTime - lastClickTime < 5000) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      if (newCount >= 10) {
        setShowLogin(true);
        setClickCount(0);
        setError('');
      }
    } else {
      setClickCount(1);
    }
    
    setLastClickTime(currentTime);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');

    const storedUsers = localStorage.getItem('adminUsers');
    let users = [{ username: 'admin', password: 'putt', role: 'Super Admin' }];

    if (storedUsers) {
      users = JSON.parse(storedUsers);
    } else {
      localStorage.setItem('adminUsers', JSON.stringify(users));
    }

    const matchedUser = users.find(
      u => u.username === username.trim().toLowerCase() && u.password === password
    );

    if (matchedUser) {
      sessionStorage.setItem('isAdmin', 'true');
      sessionStorage.setItem('currentUser', JSON.stringify(matchedUser));
      navigate('/admin');
    } else {
      setError('Invalid administrative credentials.');
    }
  };

  const handleCancel = () => {
    setShowLogin(false);
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="about-page-wrapper">
      <Header />

      <main className="about-grid-layout">
        {/* COLUMN 1: VISUAL PROFILE CONTAINER */}
        <div className="visual-profile-card" onClick={handleImageClick}>
          <div className="profile-image-wrapper">
            <img
              src="https://bofdvterflbvozuxkfws.supabase.co/storage/v1/object/public/portfolio-media/Profile-Image/Pindawala%20Putt%20cover%20art.jpg"
              alt="Pindawala Putt Profile"
            />
            <div className="profile-card-badge">
              <span>⚡ Independent catalog • Udaipur</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: BIO NARRATIVE */}
        <div className="about-col bio-story-card">
          <h2>The Narrative</h2>
          <div className="bio-text-content">
            <p className="highlight-paragraph">
              Pindawala Putt is an independent singer-songwriter and lyricist
              pushing boundaries out of Udaipur, Rajasthan.
            </p>
            <p>
              Merging the raw acoustic energy of Alternative Rock, Emo, and
              Pop-Punk with heavy dark melodies, the project brings an entirely
              unique narrative style into modern Punjabi music. Managing
              everything from initial songwriting and audio production to
              cinematic video creation and distribution.
            </p>
            <p>
              From the structured chapters and narrative skits of the dedicated
              <em>Justice</em> tribute project to the moody, alternative tracks
              layered over dark emotional beats, the discography explores themes
              of overthinking, survival, and endless evolution.
            </p>
          </div>
        </div>

        {/* COLUMN 3: FAST MILESTONES & DISCOGRAPHY DATA */}
        <div className="about-col metrics-stats-card">
          <h2>Project Intel</h2>

          <div className="stats-list">
            <div className="stat-item">
              <span className="stat-label">Origin</span>
              <span className="stat-value">Udaipur, RJ (India)</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Core Genres</span>
              <span className="stat-value">Punjabi, Emo, Pop-Punk</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Key Releases</span>
              <span className="stat-value">Chapter 7/21, Nightmare</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Work Ethics</span>
              <span className="stat-value">Lyrics, Production, Visuals</span>
            </div>
          </div>

          {/* DIGITAL PRESS HUB REDIRECTS */}
          <div className="press-hub-actions">
            <Link to="/releases" className="press-btn releases-btn">
              Browse Catalog
            </Link>
            <a
              href="https://www.google.com/search?q=Pindawala+Putt"
              target="_blank"
              rel="noopener noreferrer"
              className="press-btn google-btn"
            >
              Verify on Google Search ↗
            </a>
          </div>
        </div>

        {/* FULL-WIDTH INTERACTIVE TIMELINE */}
        <section className="timeline-section">
          <h2 className="timeline-title">Project Milestones</h2>
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            <div className="timeline-nodes-row">
              {timelineData.map((node, index) => (
                <div 
                  className={`timeline-node ${activeTimelineIndex === index ? 'active' : ''}`}
                  key={index}
                  onClick={() => setActiveTimelineIndex(index)}
                  onMouseEnter={() => setActiveTimelineIndex(index)}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-year">{node.year}</div>
                  <div className="timeline-popover">
                    <h4>{node.title}</h4>
                    <p>{node.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* HIDDEN ADMIN LOGIN MODAL */}
      {showLogin && (
        <div className="admin-login-modal">
          <div className="admin-login-card">
            <h2>Developer Portal</h2>
            <p>Enter administrative credentials to gain access</p>
            <form onSubmit={handleLoginSubmit}>
              {error && <div className="admin-login-error">{error}</div>}
              <input
                type="text"
                placeholder="Admin ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="admin-login-btn-group">
                <button type="button" className="admin-login-btn cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="admin-login-btn submit">
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
