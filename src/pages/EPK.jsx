import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/StyleEpk.css';

export default function EPK() {
  return (
    <div className="epk-page-wrapper">
      <Header />

      {/* SUB-NAVIGATION HEADER */}
      <header className="sub-header">
        <h3 className="logo">Business Hub</h3>
        <nav>
          <ul>
            <li><Link to="/epk">Press Kit (EPK)</Link></li>
            <li><Link to="/contact">Fan Mail</Link></li>
            <li><Link to="/posters">Promotional Art</Link></li>
          </ul>
        </nav>
      </header>

      {/* MAIN THREE-COLUMN EPK DASHBOARD */}
      <main className="epk-dashboard-layout">
        {/* PANE 1: VISUAL PRESS ASSETS */}
        <div className="epk-column visual-pane">
          <div className="press-photo-box">
            <img 
              src="https://bofdvterflbvozuxkfws.supabase.co/storage/v1/object/public/portfolio-media/Profile-Image/Pindawala%20Putt%20cover%20art.jpg" 
              alt="Pindawala Putt Press Asset"
            />
            <div className="photo-gradient-overlay">
              <span className="asset-tag">Official Press Shot</span>
            </div>
          </div>
          
          <a 
            href="https://bofdvterflbvozuxkfws.supabase.co/storage/v1/object/public/portfolio-media/Media-Asset-Zip-File/Pindawala_Putt_Media_Kit.zip?download" 
            className="download-assets-btn"
          >
            <span>Download Media Assets (.ZIP)</span>
            <small>Includes High-Res Posters, Logos & Photos</small>
          </a>
        </div>

        {/* PANE 2: ARTIST STATEMENT & SONIC IDENTITY */}
        <div className="epk-column statement-pane">
          <span className="section-badge">Artist Profile</span>
          <h2>The Sonic Blueprint</h2>

          <div className="statement-content">
            <p className="pitch-lead">
              Pindawala Putt is a self-contained independent powerhouse managing songwriting,
              music production, cinematic visuals, and worldwide distribution.
            </p>

            <p>
              Rooted out of Udaipur, Rajasthan, the project delivers a ground-breaking musical direction by
              blending raw alternative elements—like <strong>Pop-Punk, Emo, and Post-Hardcore structures</strong>—directly into
              modern <strong>Punjabi narrative flows</strong> and emotional lyrics.
            </p>

            <p>
              Whether weaving multi-layered concepts through multi-chapter tribute records (like the 3 chapters and
              8 skits dedicated to the legacy of <em>Justice</em>) or crafting vulnerable, atmospheric tracks over
              heavy dark beats, Pindawala Putt systematically codes a unique story of survival and continuous
              creative evolution.
            </p>
          </div>
        </div>

        {/* PANE 3: INDUSTRY STATS & BOOKING TERMINAL */}
        <div className="epk-column booking-pane">
          <span className="section-badge">Industry Stats</span>

          {/* Quick Verification Data List */}
          <div className="epk-stats-list">
            <div className="epk-stat-row">
              <span className="label">Operation Base</span>
              <span className="val">Udaipur, India</span>
            </div>
            <div className="epk-stat-row">
              <span className="label">Discography Layout</span>
              <span className="val">Chapter 7/21, Nightmare, ELN</span>
            </div>
            <div className="epk-stat-row">
              <span className="label">Catalog Status</span>
              <span className="val">100% Independently Owned</span>
            </div>
          </div>

          {/* Professional Booking Portal */}
          <div className="secure-booking-box">
            <h3>Booking & Clearance Inquiries</h3>
            <form action="https://api.web3forms.com/submit" method="POST">
              <input 
                type="hidden" 
                name="access_key" 
                value={localStorage.getItem('web3FormsKey') || "b4263795-34f5-4b04-8878-fdcd197270c0"} 
              />
              <input type="hidden" name="from_name" value="Pindawala Putt EPK Hub" />

              <input type="text" name="Company/Promoter Name" placeholder="Company / Promoter Name" required />
              <input type="email" name="email" placeholder="Professional Email Address" required />

              <select name="Inquiry Type" required defaultValue="">
                <option value="" disabled>-- Select Inquiry Nature --</option>
                <option value="Live Concert Booking">Live Festival / Concert Booking</option>
                <option value="Label / Distribution Pitch">Label / Distribution Pitch</option>
                <option value="Feature / Sample Clearance">Vocal Feature & Sample Clearance</option>
                <option value="Press / Interview Request">Press & Media Interview Request</option>
              </select>

              <textarea 
                name="Inquiry Details" 
                rows="4"
                placeholder="Provide event dates, venue specs, or project details..." 
                required
              />

              <button type="submit" className="submit-booking-btn">Submit Proposal</button>
            </form>
          </div>
        </div>
      </main>

      <Footer tickerText="EPK Secure Terminal Active • Verified Industry Portal..." />
    </div>
  );
}
