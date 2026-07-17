import React, { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import { getConfig } from '../utils/config';
import '../styles/stylesnippet.css';

const defaultSnippetTracks = [
  { id: 'armed-dangerous', title: 'Armed and Dangerous', src: '/Resource/Audio/ARMED AND DANGEROUS.mp3' },
  { id: 'asla', title: 'Asla', src: '/Resource/Audio/Asla.mp3' },
  { id: 'dont-cry', title: 'Dont Cry', src: '/Resource/Audio/DONT CRY.mp3' },
  { id: 'ego-trip', title: 'Ego Trip Mastered', src: '/Resource/Audio/EGO TRIP MASTERED.wav', isWav: true },
  { id: 'evil', title: 'Evil', src: '/Resource/Audio/Evil.mp3' },
  { id: 'game-of-fate', title: 'Game Of Fate', src: '/Resource/Audio/GAME OF FATE.mp3' },
  { id: 'let-it-go-final', title: 'Let It Go Final', src: '/Resource/Audio/LET IT GO FINAL.mp3' },
  { id: 'let-it-go-sr', title: 'Let It Go Slowed and Reverbed', src: '/Resource/Audio/LET IT GO SLOWED AND REVERBED.mp3' },
  { id: 'let-it-go', title: 'Let It Go', src: '/Resource/Audio/LET IT GO.mp3' },
  { id: 'memories-nbd', title: 'Memories No Bass Drums', src: '/Resource/Audio/MEMORIES NO BASS DRUMS.mp3' },
  { id: 'memories-nd', title: 'Memories No Drums', src: '/Resource/Audio/MEMORIES NO DRUMS.mp3' },
  { id: 'memories-sr', title: 'Memories Slowed and Reverbed', src: '/Resource/Audio/MEMORIES SLOWED AND REVERBED.mp3' },
  { id: 'nothing-inside', title: 'Nothing Inside', src: '/Resource/Audio/NOTHING INSIDE.mp3' },
  { id: 'sad-starlight', title: 'Sad Starlight Mastered', src: '/Resource/Audio/SAD STARLIGHT MASTERED.MP3' },
  { id: 'stay-with-me', title: 'Stay With Me', src: '/Resource/Audio/STAY WITH ME.mp3' },
  { id: 'sunset-whispers', title: 'Sunset Whispers', src: '/Resource/Audio/Sunset Whispers.mp3' },
  { id: 'attach', title: 'Attach', src: '/Resource/Audio/attach.mp3' },
  { id: 'broken-wings', title: 'Broken Wings', src: '/Resource/Audio/broken wings.mp3' },
  { id: 'justice-old', title: 'Justice Old Version', src: '/Resource/Audio/justice old version.mp3' },
  { id: 'only-one', title: 'Only One', src: '/Resource/Audio/only one.mp3' },
  { id: 'right-wrong', title: 'Right & Wrong', src: '/Resource/Audio/right & wrong.mp3' },
  { id: 'still-in-touch', title: 'Still In Touch', src: '/Resource/Audio/still in touch.mp3' },
  { id: 'the-end', title: 'The End', src: '/Resource/Audio/the end.mp3' },
  { id: 'time', title: 'Time', src: '/Resource/Audio/time.mp3' }
];

function CanvasVisualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Handle high DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    let animationId;
    let phase = 0;

    // Fetch theme accent color variables dynamically
    const getAccentColor = () => {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#E3A5C7';
    };

    const draw = () => {
      ctx.clearRect(0, 0, rect.width, rect.height);
      const accent = getAccentColor();

      // Render 3 layered overlapping frequency sine waves
      const waves = [
        { amplitude: 22, frequency: 0.025, speed: 0.05, color: accent, opacity: 0.5 },
        { amplitude: 14, frequency: 0.045, speed: 0.08, color: accent, opacity: 0.3 },
        { amplitude: 28, frequency: 0.012, speed: 0.02, color: accent, opacity: 0.25 }
      ];

      waves.forEach(w => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = w.opacity;

        const centerY = rect.height / 2;
        ctx.moveTo(0, centerY);

        for (let x = 0; x < rect.width; x++) {
          const y = centerY + Math.sin(x * w.frequency + phase * (w.speed / 0.05)) * w.amplitude;
          ctx.lineTo(x, y);
        }

        ctx.stroke();
      });

      phase += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100%', height: '100%', display: 'block', background: 'rgba(0,0,0,0.1)' }} 
    />
  );
}

export default function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [playingTrackId, setPlayingTrackId] = useState(null);
  const [tickerText, setTickerText] = useState("Select a snippet track above to begin playback...");
  const audioRefs = useRef({});

  // Sync config helper
  useEffect(() => {
    async function loadSnippets() {
      const list = await getConfig('snippetTracks', defaultSnippetTracks);
      setSnippets(list);
    }
    loadSnippets();
  }, []);

  const handlePlay = (id, title) => {
    setPlayingTrackId(id);
    setTickerText(`Now Playing: ${title} (Exclusive Snippet Draft loop)`);

    // Pause all other audio elements
    Object.keys(audioRefs.current).forEach(trackId => {
      if (trackId !== id && audioRefs.current[trackId]) {
        audioRefs.current[trackId].pause();
      }
    });
  };

  const handlePause = (id, title) => {
    if (playingTrackId === id) {
      setPlayingTrackId(null);
      setTickerText(`Paused: ${title}`);
    }
  };

  return (
    <div className="snippets-page-wrapper">
      <Header />
      <SubHeader />

      <main className="audio-container-grid">
        {snippets.map(track => {
          const isPlaying = playingTrackId === track.id;

          return (
            <div className="audio-card" key={track.id}>
              <span className="status-badge snippet-tag">Unreleased</span>
              
              <div className="audio-card-cover">
                {isPlaying ? (
                  <CanvasVisualizer />
                ) : (
                  <div className="waveform-bars">
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                  </div>
                )}
              </div>

              <h3>{track.title}</h3>
              <p>Unreleased Snippet</p>

              <audio 
                className="snippet-player" 
                controls
                ref={el => audioRefs.current[track.id] = el}
                onPlay={() => handlePlay(track.id, track.title)}
                onPause={() => handlePause(track.id, track.title)}
              >
                <source src={track.src} type={track.isWav ? "audio/wav" : "audio/mpeg"} />
                Your browser does not support the audio element.
              </audio>
            </div>
          );
        })}
      </main>

      <Footer tickerText={tickerText} />
    </div>
  );
}
