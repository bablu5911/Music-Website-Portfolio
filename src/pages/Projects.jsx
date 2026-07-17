import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import '../styles/StyleProjects.css';

const lyricsLoreDatabase = {
  "drippin": {
    lyrics: [
      { time: 0, text: "[Intro Instrumental]" },
      { time: 4, text: "Drippin in the studio, mechanical tracks," },
      { time: 9, text: "No turning back, straight lines on the map." },
      { time: 14, text: "[Chorus]" },
      { time: 19, text: "Pindawala boy making noise in the room," },
      { time: 24, text: "Heavy baseline cutting clear straight through the gloom." }
    ],
    lore: "Written entirely in Udaipur during late-night production sessions. Represents the bridge between traditional roots and modern dark trap frequencies."
  },
  "gods plan": {
    lyrics: [
      { time: 0, text: "[Guitar Loop Intro]" },
      { time: 5, text: "Everything aligned, tracing out the higher design." },
      { time: 11, text: "Patience in my hands, moving stones across the borderline." }
    ],
    lore: "Centers on resilience and finding peace within uncertainty. Features a prominent alternative rock guitar loop."
  },
  "attach": {
    lyrics: [
      { time: 0, text: "[Guitar Intro]" },
      { time: 6, text: "Ho pata ni kyu jaawan hoi attach tere nal" },
      { time: 11, text: "Pata naiyo kivein hoya match tere naal" },
      { time: 16, text: "Dil diyan gallan tainu khol ke sunawaan" },
      { time: 21, text: "Tere bina reh vi na hun pawaan" },
      { time: 26, text: "[Chorus]" },
      { time: 31, text: "Attach tere naal... attach tere naal..." },
      { time: 36, text: "Pindawala Putt created this" }
    ],
    lore: "Pindawala Putt Created this"
  }
};

const defaultProjectList = [
  {
    id: 'chapter-721',
    playlistId: 'PLX__0TZaFPq8diOGLMkBLSf-06XlEXhuQ',
    year: '2026',
    defaultTitle: 'Chapter 7/21',
    defaultType: 'Full Album',
    className: 'chapter-721-bg'
  },
  {
    id: 'nightmare',
    playlistId: 'PLX__0TZaFPq_rX_PNlpRpspFthUZ2sfIg',
    year: '2025',
    defaultTitle: 'Nightmare',
    defaultType: 'Full Album',
    className: 'nightmare-bg'
  },
  {
    id: 'eln',
    playlistId: 'PLX__0TZaFPq96dDbAaXrpT0inLKQDUxJ1',
    year: '2026',
    defaultTitle: 'Eternal Love Notes',
    defaultType: 'Full Album',
    className: 'eln-bg'
  },
  {
    id: 'singles',
    playlistId: 'OLAK5uy_kRElCwnSFRtCeSYCroExFv--QUOMBbRQ4',
    year: 'Continuous Release',
    defaultTitle: 'Singles',
    defaultType: 'Collection',
    className: 'singles-bg'
  }
];

export default function Projects() {
  const [projectList, setProjectList] = useState([]);
  const [projectData, setProjectData] = useState({});
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [modalActive, setModalActive] = useState(false);
  const [tickerText, setTickerText] = useState("Select a track above to launch the interactive dual media player...");

  const playerRef = useRef(null);
  const apiKey = localStorage.getItem('ytApiKey') || "AIzaSyACKQKFM8C_1itHgHRjyfqeGFVVBJq94Z4";

  // Load project playlists list
  useEffect(() => {
    const stored = localStorage.getItem('projectPlaylists');
    if (stored) {
      setProjectList(JSON.parse(stored));
    } else {
      setProjectList(defaultProjectList);
      localStorage.setItem('projectPlaylists', JSON.stringify(defaultProjectList));
    }
  }, []);

  // Fetch playlist content from YouTube when the playlist changes
  useEffect(() => {
    if (projectList.length === 0) return;

    async function loadAllProjects() {
      const dataStore = {};

      for (let proj of projectList) {
        dataStore[proj.id] = {
          title: proj.defaultTitle,
          type: proj.defaultType,
          backgroundImage: null,
          tracks: [],
          loading: true
        };

        try {
          const playlistApi = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${proj.playlistId}&key=${apiKey}`;
          const playlistRes = await fetch(playlistApi);
          const playlistJson = await playlistRes.json();

          let bgImage = null;
          if (playlistJson.items && playlistJson.items.length > 0) {
            const snippet = playlistJson.items[0].snippet;
            if (snippet.title) dataStore[proj.id].title = snippet.title;
            
            const thumbnails = snippet.thumbnails;
            if (thumbnails) {
              bgImage = thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.standard?.url || thumbnails.default?.url;
            }
          }
          dataStore[proj.id].backgroundImage = bgImage;

          const tracksApi = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${proj.playlistId}&key=${apiKey}`;
          const tracksRes = await fetch(tracksApi);
          const tracksJson = await tracksRes.json();

          if (tracksJson.items && tracksJson.items.length > 0) {
            const validTracks = tracksJson.items.filter(item => {
              const t = item.snippet.title;
              return t !== "Private video" && t !== "Deleted video";
            });

            const totalTracks = validTracks.length;
            let typeLabel = "Collection";
            if (totalTracks > 20) {
              typeLabel = "MixTape";
            } else if (totalTracks >= 5) {
              typeLabel = "Full Album";
            } else if (totalTracks < 5 && totalTracks > 0) {
              typeLabel = "Extended Play";
            }
            dataStore[proj.id].type = typeLabel;
            dataStore[proj.id].tracks = validTracks;
          }
        } catch (err) {
          console.error(`Failed to sync playlist ${proj.id}:`, err);
        } finally {
          dataStore[proj.id].loading = false;
        }

        setProjectData({ ...dataStore });
      }
    }

    loadAllProjects();
  }, [projectList, apiKey]);

  // YouTube Iframe Player API Loader & Binder
  useEffect(() => {
    if (!selectedTrack || !modalActive) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let player;
    const initPlayer = () => {
      player = new window.YT.Player('theater-yt-player', {
        videoId: selectedTrack.videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          origin: window.location.origin
        },
        events: {
          onReady: (event) => {
            playerRef.current = event.target;
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // API script callback
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        initPlayer();
      };
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        try {
          player.destroy();
        } catch (e) {
          console.warn("Error destroying player:", e);
        }
      }
      playerRef.current = null;
    };
  }, [selectedTrack, modalActive]);

  const openTrack = (track) => {
    const videoId = track.snippet.resourceId.videoId;
    const title = track.snippet.title;
    const cleanKey = title.toLowerCase().trim();

    const lyricsData = lyricsLoreDatabase[cleanKey]?.lyrics || "<em>Lyrics layout configuration update coming soon.</em>";
    const loreText = lyricsLoreDatabase[cleanKey]?.lore || "Backstory pending studio deployment tracking notes.";

    setSelectedTrack({
      videoId,
      title,
      lyrics: lyricsData,
      lore: loreText
    });
    setModalActive(true);
    setTickerText(`Streaming Track: ${title} (Click lyrics to seek timeline)`);
  };

  const closeModal = () => {
    setModalActive(false);
    setSelectedTrack(null);
    setTickerText("Select a track above to launch the interactive dual media player...");
  };

  return (
    <div className="projects-page-wrapper">
      <Header />
      <SubHeader />

      <main className="projects-container">
        {projectList.map(proj => {
          const info = projectData[proj.id] || {
            title: proj.defaultTitle,
            type: proj.defaultType,
            backgroundImage: null,
            tracks: [],
            loading: true
          };

          const cardStyle = info.backgroundImage 
            ? { backgroundImage: `url('${info.backgroundImage}')` } 
            : {};

          return (
            <div className="project-card" key={proj.id}>
              <div 
                className={`project-hero ${proj.className || 'singles-bg'}`}
                style={cardStyle}
              >
                <div className="hero-overlay">
                  <span className="project-type">
                    {info.loading ? "Loading Type..." : info.type}
                  </span>
                  <h2>{info.loading ? "Loading Title..." : info.title}</h2>
                  <p className="project-year">{proj.year}</p>
                </div>

                {/* 3D Spinning Vinyl Record Disc */}
                {!info.loading && (
                  <div className="vinyl-disc-wrapper">
                    <div className="vinyl-disc-grooves" />
                    <div 
                      className="vinyl-center-label" 
                      style={info.backgroundImage ? { backgroundImage: `url('${info.backgroundImage}')` } : {}}
                    />
                  </div>
                )}
              </div>
              <div className="project-tracklist">
                {info.loading ? (
                  <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                    Syncing tracklist elements...
                  </p>
                ) : info.tracks.length === 0 ? (
                  <p style={{ color: '#666', padding: '20px', textAlign: 'center' }}>
                    No public items discovered inside this playlist layer.
                  </p>
                ) : (
                  info.tracks.map((track, idx) => {
                    const trackNum = String(idx + 1).padStart(2, '0');
                    return (
                      <div 
                        className="track-row" 
                        key={track.id}
                        onClick={() => openTrack(track)}
                      >
                        <div className="track-num">{trackNum}</div>
                        <div className="track-info">
                          <h4>{track.snippet.title}</h4>
                          <p>Official Upload</p>
                        </div>
                        <div className="play-icon-cell">▶</div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </main>

      {/* DUAL THEATER MODAL */}
      {modalActive && selectedTrack && (
        <div 
          className="theater-modal active"
          onClick={(e) => {
            if (e.target.classList.contains('theater-modal')) closeModal();
          }}
        >
          <span className="close-theater" onClick={closeModal}>&times;</span>
          <div className="theater-split-content">
            <div className="theater-video-pane" style={{ width: '100%', height: '100%', background: '#000' }}>
              <div id="theater-yt-player" style={{ width: '100%', height: '100%', display: 'block' }}></div>
            </div>

            <div className="theater-lyrics-pane">
              <h3>{selectedTrack.title}</h3>
              <span className="pane-divider-tag">Lyrics</span>
              <div className="modal-lyrics-scroll">
                {Array.isArray(selectedTrack.lyrics) ? (
                  selectedTrack.lyrics.map((line, idx) => {
                    const isTime = line.time !== undefined;
                    return (
                      <div 
                        key={idx}
                        className={`lyric-sync-line ${isTime ? 'interactive' : ''}`}
                        onClick={() => {
                          if (isTime && playerRef.current) {
                            playerRef.current.seekTo(line.time, true);
                            setTickerText(`Seeking timeline to: ${Math.floor(line.time / 60)}:${String(line.time % 60).padStart(2, '0')}`);
                          }
                        }}
                      >
                        <span className="lyric-line-text">{line.text}</span>
                        {isTime && (
                          <span className="lyric-time-badge">
                            {Math.floor(line.time / 60)}:${String(line.time % 60).padStart(2, '0')}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: selectedTrack.lyrics }} />
                )}
              </div>

              <span className="pane-divider-tag lore-tag">Behind The Lore</span>
              <p className="modal-lore-scroll">{selectedTrack.lore}</p>
            </div>
          </div>
        </div>
      )}

      <Footer tickerText={tickerText} />
    </div>
  );
}
