import React, { useState } from 'react';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import '../styles/StylePosters.css';

const postersList = [
  { title: 'Eternal Love Notes', src: '/Posters/Eternal love notes Poster.png' },
  { title: 'Another Dream', src: '/Posters/Another Dream Poster.jpg' },
  { title: 'Both Worlds', src: '/Posters/Both Worlds Poster.jpg' },
  { title: 'Broken Wings', src: '/Posters/Broken Wings Poster.jpg' },
  { title: 'Come Back', src: '/Posters/Come Back Poster.jpg' },
  { title: 'Ditcher', src: '/Posters/Ditcher Poster.jpg' },
  { title: 'Evil', src: '/Posters/Evil Poster.jpg' },
  { title: 'For You', src: '/Posters/For You Poster.jpg' },
  { title: 'Legacy Of A Legend', src: '/Posters/Legacy Of A Legend Poster.jpg' },
  { title: 'Let It Go', src: '/Posters/Let It Go Poster.jpg' },
  { title: 'Memories', src: '/Posters/Memories Poster.jpg' },
  { title: 'Nothing Inside', src: '/Posters/Nothing Inside.jpg' },
  { title: 'Only One', src: '/Posters/Only One Poster.jpg' },
  { title: 'Precious', src: '/Posters/Precious Poster.jpg' },
  { title: 'Right & Wrong', src: '/Posters/Right & Wrong Poster.jpg' },
  { title: 'Sunset Whispers', src: '/Posters/Sunset Whispers Poster.jpg' },
  { title: 'The End', src: '/Posters/The End Poster.jpg' },
  { title: 'When I\'m Gone', src: '/Posters/When I\'m Gone Poster.jpg' },
  { title: 'Will You Stay', src: '/Posters/Will You Stay Poster.jpg' },
  { title: 'Worth More', src: '/Posters/Worth More Poster.jpg' }
];

export default function Posters() {
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const openLightbox = (src) => {
    setLightboxSrc(src);
  };

  const closeLightbox = () => {
    setLightboxSrc(null);
  };

  return (
    <div className="posters-page-wrapper">
      <Header />
      <SubHeader />

      <main className="poster-gallery-grid">
        {postersList.map((poster, index) => (
          <div 
            className="poster-container" 
            key={index}
            onClick={() => openLightbox(poster.src)}
          >
            <div className="poster-card">
              <img src={poster.src} alt={`${poster.title} Promo Poster`} />
              <div className="poster-hover-veil">
                <span>View Art 🔍</span>
              </div>
            </div>
            <p className="poster-title">{poster.title}</p>
          </div>
        ))}
      </main>

      {/* IMMERSIVE LIGHTBOX MODAL */}
      {lightboxSrc && (
        <div 
          id="galleryLightbox" 
          className="lightbox-modal display-active"
          onClick={(e) => {
            if (e.target.id === 'galleryLightbox') closeLightbox();
          }}
        >
          <span className="close-lightbox" onClick={closeLightbox}>&times;</span>
          <img id="lightboxTargetImage" src={lightboxSrc} alt="Enlarged Promotional View" />
        </div>
      )}

      <Footer />
    </div>
  );
}
