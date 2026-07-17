import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import '../styles/styleteaser.css';

export default function Teasers() {
  const [teasers, setTeasers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read config from local storage dynamically
  const apiKey = localStorage.getItem('ytApiKey') || "AIzaSyACKQKFM8C_1itHgHRjyfqeGFVVBJq94Z4";
  const playlistId = localStorage.getItem('ytTeasersPlaylistId') || "PLB8c1VAP6Hx8";

  useEffect(() => {
    async function loadTeasers() {
      try {
        const listTarget = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
        const response = await fetch(listTarget);
        const listData = await response.json();
        
        if (listData.items && listData.items.length > 0) {
          const videoIds = listData.items
            .map(item => item.snippet.resourceId.videoId)
            .join(',');
          
          const videoTarget = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${apiKey}`;
          const videoResponse = await fetch(videoTarget);
          const videoData = await videoResponse.json();
          
          const videoStatusMap = {};
          if (videoData.items) {
            videoData.items.forEach(v => {
              videoStatusMap[v.id] = v.snippet.liveBroadcastContent;
            });
          }

          const validTeasers = listData.items.filter(item => {
            const title = item.snippet.title;
            return title !== "Private video" && title !== "Deleted video";
          }).map(item => {
            const videoId = item.snippet.resourceId.videoId;
            return {
              id: videoId,
              title: item.snippet.title,
              broadcastStatus: videoStatusMap[videoId] || 'none'
            };
          });

          setTeasers(validTeasers);
        } else {
          setTeasers([]);
        }
      } catch (err) {
        console.error("API Fetch execution failure:", err);
        setError("Error loading teasers. Check your configuration.");
      } finally {
        setLoading(false);
      }
    }

    loadTeasers();
  }, []);

  return (
    <div className="teasers-page-wrapper">
      <Header />
      <SubHeader />

      <main className="trailer-container" id="playlist-grid">
        {loading && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            Loading your teasers and trailers...
          </p>
        )}
        {error && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            {error}
          </p>
        )}
        {!loading && !error && teasers.length === 0 && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            No public items returned. Ensure teaser playlist target is set to Public.
          </p>
        )}
        {!loading && !error && teasers.map(teaser => {
          const isUpcoming = teaser.broadcastStatus === 'upcoming';
          const badgeText = isUpcoming ? 'Next Up' : 'Released';
          const badgeClass = isUpcoming ? 'status-badge' : 'status-badge release';
          const videoLink = `https://www.youtube.com/watch?v=${teaser.id}`;
          const thumbnailUrl = `https://img.youtube.com/vi/${teaser.id}/maxresdefault.jpg`;

          return (
            <div className={`trailer ${isUpcoming ? 'upcoming' : 'past'}`} key={teaser.id}>
              <span className={badgeClass}>{badgeText}</span>
              <a 
                href={videoLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-wrapper" 
                style={{ position: 'relative', width: '100%', height: '180px', display: 'block', background: '#000', overflow: 'hidden' }}
              >
                <img 
                  src={thumbnailUrl} 
                  alt={teaser.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  onError={(e) => {
                    e.target.src = `https://img.youtube.com/vi/${teaser.id}/hqdefault.jpg`;
                  }}
                />
                <div className="play-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', transition: 'background 0.3s' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.5))', margin: 'auto' }}>
                    <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                  </svg>
                </div>
              </a>
              <h3>{teaser.title}</h3>
              <p>{isUpcoming ? 'Scheduled Premiere' : 'Official Trailer'}</p>
            </div>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
