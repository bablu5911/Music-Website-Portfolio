import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import '../styles/style 2.css';

export default function Releases() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(null);

  // Read config from local storage dynamically
  const apiKey = localStorage.getItem('ytApiKey') || "AIzaSyACKQKFM8C_1itHgHRjyfqeGFVVBJq94Z4";
  const playlistId = localStorage.getItem('ytReleasesPlaylistId') || "PLWovZqDAlR1E";

  useEffect(() => {
    async function fetchPlaylist() {
      const apiTarget = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}`;
      try {
        const response = await fetch(apiTarget);
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const validTracks = data.items.filter(item => {
            const title = item.snippet.title;
            return title !== "Private video" && title !== "Deleted video";
          });
          setTracks(validTracks);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error("API Fetch execution failure:", err);
        setError("Error loading releases. Check your configuration.");
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylist();
  }, []);

  return (
    <div className="releases-page-wrapper">
      <Header />
      <SubHeader />

      <main className="trailer-container" id="playlist-grid">
        {loading && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            Loading your portfolio releases...
          </p>
        )}
        {error && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            {error}
          </p>
        )}
        {!loading && !error && tracks.length === 0 && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            No public items returned. Ensure playlist target is set to Public.
          </p>
        )}
        {!loading && !error && tracks.map(track => {
          const videoId = track.snippet.resourceId.videoId;
          const title = track.snippet.title;
          const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

          return (
            <div className="trailer" key={videoId}>
              <span className="status-badge release">Released</span>
              <div 
                className="video-wrapper" 
                style={{ position: 'relative', width: '100%', height: '180px', cursor: 'pointer', background: '#000' }}
                onClick={() => setPlayingVideoId(videoId)}
              >
                {playingVideoId === videoId ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`} 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                    style={{ display: 'block', width: '100%', height: '100%', border: 'none' }}
                    title={title}
                  />
                ) : (
                  <>
                    <img 
                      src={thumbnailUrl} 
                      alt={title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="play-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.15)', transition: 'background 0.3s' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.5))' }}>
                        <path d="M8 5V19L19 12L8 5Z" fill="white"/>
                      </svg>
                    </div>
                  </>
                )}
              </div>
              <h3>{title}</h3>
              <p>Official Upload</p>
            </div>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
