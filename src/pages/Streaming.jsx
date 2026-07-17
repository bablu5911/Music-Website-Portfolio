import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/StyleStreamingplatforms.css';

const platforms = [
  { name: '7 Digitals', href: '', img: '/Resource/Streaming Platform Logo/7 digitals logo.jpeg' },
  { name: 'AllSaints', href: '', img: '/Resource/Streaming Platform Logo/Allsaints.jpg' },
  { name: 'Prime Music', href: 'https://music.amazon.in/artists/B0CJX6CKFS/pindawala-putt', img: '/Resource/Streaming Platform Logo/Amazon music logo.jpeg', external: true },
  { name: 'Anghami', href: 'https://play.anghami.com/artist/19003781', img: '/Resource/Streaming Platform Logo/Anghami logo.jpeg', external: true },
  { name: 'Awa', href: '', img: '/Resource/Streaming Platform Logo/Awa Logo.jpg' },
  { name: 'Boomplay', href: 'https://www.boomplay.com/artists/77592325?from=#google_vignette', img: '/Resource/Streaming Platform Logo/boomlay logo.png', external: true },
  { name: 'Bugs', href: 'https://music.bugs.co.kr/artist/13442056', img: '/Resource/Streaming Platform Logo/Bugs logo.png', external: true },
  { name: 'Capcut', href: '', img: '/Resource/Streaming Platform Logo/Capcut logo.jpg' },
  { name: 'Claro Musica', href: '', img: '/Resource/Streaming Platform Logo/Claro musica logo.jpeg' },
  { name: 'Deezer', href: '', img: '/Resource/Streaming Platform Logo/Deezer  logo.jpg' },
  { name: 'Emusic', href: '', img: '/Resource/Streaming Platform Logo/Emusic logo.jpg' },
  { name: 'FLO', href: 'https://www.music-flo.com/search/all?keyword=Pindawala%20Putt', img: '/Resource/Streaming Platform Logo/flo logo.png', external: true },
  { name: 'Genie', href: '', img: '/Resource/Streaming Platform Logo/genie logo.png' },
  { name: 'Iheart Radio', href: '', img: '/Resource/Streaming Platform Logo/iheartradio logo.png' },
  { name: 'Itunes', href: 'https://music.apple.com/us/artist/pindawala-putt/1709211567', img: '/Resource/Streaming Platform Logo/itunes logo.jpg', external: true },
  { name: 'Joox', href: '', img: '/Resource/Streaming Platform Logo/joox logo.png' },
  { name: 'Kanjian', href: '', img: '/Resource/Streaming Platform Logo/kanjian logo.png' },
  { name: 'KK Box', href: '', img: '/Resource/Streaming Platform Logo/kk box logo.webp' },
  { name: 'Kuack', href: '', img: '/Resource/Streaming Platform Logo/kuack logo.png' },
  { name: 'Line Music', href: '', img: '/Resource/Streaming Platform Logo/Line Music.jpeg' },
  { name: 'Melon', href: '', img: '/Resource/Streaming Platform Logo/melon logo.png' },
  { name: 'Napster', href: '', img: '/Resource/Streaming Platform Logo/napster  logo.jpg' },
  { name: 'Netease', href: '', img: '/Resource/Streaming Platform Logo/NetEase logo.png' },
  { name: 'Pandora', href: '', img: '/Resource/Streaming Platform Logo/pandora logo.jpg' },
  { name: 'Qobuz', href: '', img: '/Resource/Streaming Platform Logo/qobuz logo.png' },
  { name: 'Jio Saavan', href: 'https://www.jiosaavn.com/artist/pindawala-putt-songs/6cUIuD,aHnc_?autoplay=enabled', img: '/Resource/Streaming Platform Logo/Saavan logo.png', external: true },
  { name: 'Soundcloud', href: '', img: '/Resource/Streaming Platform Logo/soundcloud logo.png' },
  { name: 'Spotify', href: 'https://open.spotify.com/artist/5r4ftTe0eIzfniTHnyYSCM?si=YKTNLpbuR12CkqkMGLGXjQ', img: '/Resource/Streaming Platform Logo/Spotify logo.png', external: true },
  { name: 'Tencent Music', href: '', img: '/Resource/Streaming Platform Logo/Tencent music entertainment logo.png' },
  { name: 'Tidal', href: '', img: '/Resource/Streaming Platform Logo/Tidal logo.png' },
  { name: 'Tik Tok Music', href: '', img: '/Resource/Streaming Platform Logo/tik tok music logo.png' },
  { name: 'Vibe', href: '', img: '/Resource/Streaming Platform Logo/vibe logo.png' },
  { name: 'Youtube', href: 'https://www.youtube.com/channel/UCGwhCqkyAi5QZqxCdwab4LA', img: '/Resource/Streaming Platform Logo/Youtube logo.webp', external: true },
  { name: 'YT Music', href: 'https://music.youtube.com/channel/UCX1KzkBv0LArk0JCHkbBxWQ', img: '/Resource/Streaming Platform Logo/youtube music logo.png', external: true },
  { name: 'Zing', href: '', img: '/Resource/Streaming Platform Logo/zing logo.png' }
];

export default function Streaming() {
  return (
    <div className="streaming-hub-wrapper">
      <Header />

      <div className="hub-intro-heading">
        <h2>Select Your Platform</h2>
        <p>Listen to official discography catalogs, albums, and singles worldwide.</p>
      </div>

      <main className="streaming-matrix-grid">
        {platforms.map((platform, index) => {
          const isLink = platform.href !== '';
          const cardContent = (
            <>
              <img src={platform.img} alt={platform.name} />
              <span className="platform-name">{platform.name}</span>
            </>
          );

          if (isLink) {
            return (
              <a 
                href={platform.href} 
                className="platform-card" 
                key={index}
                target={platform.external ? '_blank' : '_self'}
                rel={platform.external ? 'noopener noreferrer' : ''}
              >
                {cardContent}
              </a>
            );
          } else {
            return (
              <div className="platform-card disabled" key={index}>
                {cardContent}
              </div>
            );
          }
        })}
      </main>

      <Footer tickerText="Secure Streaming Gateways Connected • Select any music icon block to stream verified discography sets..." />
    </div>
  );
}
