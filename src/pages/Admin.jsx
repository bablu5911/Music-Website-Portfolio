import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/StyleAdmin.css';

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

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: '', role: 'Viewer' });
  const [activeTab, setActiveTab] = useState('snippets');
  const [snippets, setSnippets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddProjModal, setShowAddProjModal] = useState(false);

  // Snippet Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Unreleased Snippet');
  const [newFile, setNewFile] = useState(null);
  const [newLocalPath, setNewLocalPath] = useState('');
  const [uploadMode, setUploadMode] = useState('local');

  // Project Form states
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjPlaylistId, setNewProjPlaylistId] = useState('');
  const [newProjYear, setNewProjYear] = useState('');
  const [newProjClass, setNewProjClass] = useState('singles-bg');

  // Supabase Settings states
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [supabaseBucket, setSupabaseBucket] = useState('');

  // User Management states
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Viewer');
  const [currentPasswordConfirm, setCurrentPasswordConfirm] = useState('');
  const [myNewPassword, setMyNewPassword] = useState('');

  // Site Configuration API Key / Playlist states
  const [web3Key, setWeb3Key] = useState('');
  const [ytKey, setYtKey] = useState('');
  const [defaultTickerText, setDefaultTickerText] = useState('');

  // Status indicators
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [userSuccess, setUserSuccess] = useState(false);
  const [configSuccess, setConfigSuccess] = useState(false);

  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const adminSession = sessionStorage.getItem('isAdmin');
    const userSession = sessionStorage.getItem('currentUser');
    
    if (adminSession !== 'true' || !userSession) {
      navigate('/about');
    } else {
      setIsAdmin(true);
      setCurrentUser(JSON.parse(userSession));
    }
  }, [navigate]);

  // Load configuration databases
  useEffect(() => {
    if (!isAdmin) return;

    // Load snippet tracks
    const storedSnippets = localStorage.getItem('snippetTracks');
    if (storedSnippets) {
      setSnippets(JSON.parse(storedSnippets));
    } else {
      setSnippets(defaultSnippetTracks);
      localStorage.setItem('snippetTracks', JSON.stringify(defaultSnippetTracks));
    }

    // Load project playlists
    const storedProjects = localStorage.getItem('projectPlaylists');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    } else {
      setProjects(defaultProjectList);
      localStorage.setItem('projectPlaylists', JSON.stringify(defaultProjectList));
    }

    // Load registered user database
    const storedUsers = localStorage.getItem('adminUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    // Load Cloud credentials
    setSupabaseUrl(localStorage.getItem('supabaseUrl') || 'https://bofdvterflbvozuxkfws.supabase.co');
    setSupabaseKey(localStorage.getItem('supabaseKey') || '');
    setSupabaseBucket(localStorage.getItem('supabaseBucket') || 'portfolio-media');

    // Load Site Configurations
    setWeb3Key(localStorage.getItem('web3FormsKey') || 'b4263795-34f5-4b04-8878-fdcd197270c0');
    setYtKey(localStorage.getItem('ytApiKey') || 'AIzaSyACKQKFM8C_1itHgHRjyfqeGFVVBJq94Z4');
    setDefaultTickerText(localStorage.getItem('defaultTickerText') || "Welcome to the Official Pindawala Putt Portal • Chapter 7/21 Part 2 Arriving July 21st...");
  }, [isAdmin]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    sessionStorage.removeItem('currentUser');
    navigate('/about');
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('supabaseUrl', supabaseUrl);
    localStorage.setItem('supabaseKey', supabaseKey);
    localStorage.setItem('supabaseBucket', supabaseBucket);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    localStorage.setItem('web3FormsKey', web3Key);
    localStorage.setItem('ytApiKey', ytKey);
    localStorage.setItem('defaultTickerText', defaultTickerText);
    setConfigSuccess(true);
    setTimeout(() => setConfigSuccess(false), 3000);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword) return;

    const formattedUsername = newUsername.trim().toLowerCase();
    const storedUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');

    if (storedUsers.some(u => u.username === formattedUsername)) {
      alert('Username already exists!');
      return;
    }

    const newUser = {
      username: formattedUsername,
      password: newPassword,
      role: newRole
    };

    const updated = [...storedUsers, newUser];
    setUsers(updated);
    localStorage.setItem('adminUsers', JSON.stringify(updated));

    setNewUsername('');
    setNewPassword('');
    setNewRole('Viewer');
    setUserSuccess(true);
    setTimeout(() => setUserSuccess(false), 3000);
  };

  const handleDeleteUser = (usernameToDelete) => {
    if (usernameToDelete === 'admin') {
      alert('Cannot delete the primary system Super Admin account.');
      return;
    }
    if (usernameToDelete === currentUser.username) {
      alert('Cannot delete your own active account while logged in.');
      return;
    }

    if (window.confirm(`Delete developer account: "${usernameToDelete}"?`)) {
      const updated = users.filter(u => u.username !== usernameToDelete);
      setUsers(updated);
      localStorage.setItem('adminUsers', JSON.stringify(updated));
    }
  };

  const handleChangeMyPassword = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('adminUsers') || '[]');
    const userIndex = storedUsers.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) return;

    if (storedUsers[userIndex].password !== currentPasswordConfirm) {
      alert('Current password confirmation failed.');
      return;
    }

    storedUsers[userIndex].password = myNewPassword;
    setUsers(storedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(storedUsers));
    
    setCurrentPasswordConfirm('');
    setMyNewPassword('');
    alert('Your credentials have been successfully updated!');
  };

  const handleDownloadConfig = () => {
    const configData = {
      siteConfigs: {
        web3FormsKey: localStorage.getItem('web3FormsKey') || 'b4263795-34f5-4b04-8878-fdcd197270c0',
        ytApiKey: localStorage.getItem('ytApiKey') || 'AIzaSyACKQKFM8C_1itHgHRjyfqeGFVVBJq94Z4',
        defaultTickerText: localStorage.getItem('defaultTickerText') || "Welcome to the Official Pindawala Putt Portal • Chapter 7/21 Part 2 Arriving July 21st..."
      },
      projectPlaylists: JSON.parse(localStorage.getItem('projectPlaylists') || JSON.stringify(defaultProjectList)),
      snippetTracks: JSON.parse(localStorage.getItem('snippetTracks') || JSON.stringify(defaultSnippetTracks))
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteSnippet = (id) => {
    if (currentUser.role !== 'Super Admin') return;
    if (window.confirm('Are you sure you want to delete this track?')) {
      const updated = snippets.filter(track => track.id !== id);
      setSnippets(updated);
      localStorage.setItem('snippetTracks', JSON.stringify(updated));
    }
  };

  const handleAddSnippet = async (e) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') return;
    if (!newTitle) {
      setError('Please provide a title.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      let finalSrc = '';

      if (uploadMode === 'cloud') {
        if (!newFile) {
          throw new Error('Please select an audio file to upload.');
        }

        const savedUrl = localStorage.getItem('supabaseUrl') || 'https://bofdvterflbvozuxkfws.supabase.co';
        const savedKey = localStorage.getItem('supabaseKey');

        if (!savedKey) {
          throw new Error('Supabase Anon Key is missing. Go to Settings tab to enter it first.');
        }

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(savedUrl, savedKey);

        const bucket = localStorage.getItem('supabaseBucket') || 'portfolio-media';
        const fileExt = newFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `Audio/${fileName}`;

        const { data, error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, newFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        finalSrc = publicUrl;
      } else {
        if (!newLocalPath) {
          throw new Error('Please enter a local file path relative to your public directory.');
        }
        finalSrc = newLocalPath.startsWith('/') ? newLocalPath : `/${newLocalPath}`;
      }

      const isWav = finalSrc.toLowerCase().endsWith('.wav');
      const newTrack = {
        id: `track-${Date.now()}`,
        title: newTitle,
        src: finalSrc,
        isCloud: uploadMode === 'cloud',
        isWav
      };

      const updated = [...snippets, newTrack];
      setSnippets(updated);
      localStorage.setItem('snippetTracks', JSON.stringify(updated));

      setShowAddModal(false);
      setNewTitle('');
      setNewFile(null);
      setNewLocalPath('');
      setUploading(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'An error occurred during save.');
      setUploading(false);
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') return;
    if (!newProjTitle || !newProjPlaylistId || !newProjYear) {
      alert('Please fill out all fields.');
      return;
    }

    const newProject = {
      id: `project-${Date.now()}`,
      playlistId: newProjPlaylistId.trim(),
      year: newProjYear.trim(),
      defaultTitle: newProjTitle,
      defaultType: 'Full Album',
      className: newProjClass
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('projectPlaylists', JSON.stringify(updated));

    // Reset Form
    setShowAddProjModal(false);
    setNewProjTitle('');
    setNewProjPlaylistId('');
    setNewProjYear('');
    setNewProjClass('singles-bg');
  };

  const handleDeleteProject = (id) => {
    if (currentUser.role !== 'Super Admin') return;
    if (window.confirm('Are you sure you want to delete this album playlist from your discography?')) {
      const updated = projects.filter(proj => proj.id !== id);
      setProjects(updated);
      localStorage.setItem('projectPlaylists', JSON.stringify(updated));
    }
  };

  const getRoleBadgeClass = (role) => {
    if (role === 'Super Admin') return 'badge-role-super';
    if (role === 'Editor') return 'badge-role-editor';
    return 'badge-role-viewer';
  };

  return (
    <div className="admin-page-wrapper">
      <Header />

      <div className="admin-header-row">
        <div>
          <h1>Developer Portal</h1>
          <p style={{ margin: '5px 0 0 0', color: '#888888', fontSize: '13px' }}>
            Logged in as: <strong>{currentUser.username}</strong> ({currentUser.role})
          </p>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>Lock Dashboard</button>
      </div>

      <nav className="admin-tabs-nav">
        <button 
          className={`admin-tab-btn ${activeTab === 'snippets' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippets')}
        >
          Manage Snippets
        </button>

        <button 
          className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Manage Projects
        </button>

        {currentUser.role === 'Super Admin' && (
          <>
            <button 
              className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              User Management
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'configs' ? 'active' : ''}`}
              onClick={() => setActiveTab('configs')}
            >
              Site Configs
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Cloud Storage
            </button>
          </>
        )}
      </nav>

      {/* TAB 1: SNIPPETS MANAGEMENT */}
      {activeTab === 'snippets' && (
        <div>
          <div className="admin-list-header">
            <h3>Snippet Tracks</h3>
            {currentUser.role !== 'Viewer' && (
              <button className="admin-add-trigger-btn" onClick={() => setShowAddModal(true)}>
                + Add Snippet
              </button>
            )}
          </div>

          <div className="admin-snippets-grid">
            {snippets.map((track) => (
              <div className="admin-snippet-row" key={track.id}>
                <div className="admin-snippet-meta">
                  <h4>{track.title}</h4>
                  <span>
                    {track.isCloud ? (
                      <span className="status-badge-cloud">Cloud Source</span>
                    ) : (
                      <span className="status-badge-local">Local File</span>
                    )}
                  </span>
                </div>
                <div className="admin-snippet-path">{track.src}</div>
                {currentUser.role === 'Super Admin' && (
                  <button 
                    className="admin-delete-row-btn"
                    onClick={() => handleDeleteSnippet(track.id)}
                    aria-label="Delete snippet"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div>
          <div className="admin-list-header">
            <h3>Discography Playlists</h3>
            {currentUser.role !== 'Viewer' && (
              <button className="admin-add-trigger-btn" onClick={() => setShowAddProjModal(true)}>
                + Add Project Playlist
              </button>
            )}
          </div>

          <div className="admin-snippets-grid">
            {projects.map((proj) => (
              <div className="admin-snippet-row" key={proj.id}>
                <div className="admin-snippet-meta">
                  <h4>{proj.defaultTitle}</h4>
                  <span style={{ fontSize: '12px', color: '#888888' }}>
                    Year: <strong>{proj.year}</strong> | Theme: <code>{proj.className}</code>
                  </span>
                </div>
                <div className="admin-snippet-path">Playlist ID: {proj.playlistId}</div>
                {currentUser.role === 'Super Admin' && (
                  <button 
                    className="admin-delete-row-btn"
                    onClick={() => handleDeleteProject(proj.id)}
                    aria-label="Delete project"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT */}
      {activeTab === 'users' && currentUser.role === 'Super Admin' && (
        <div className="admin-split-layout">
          {/* USER TABLE LIST */}
          <div className="admin-settings-card" style={{ maxWidth: 'none' }}>
            <h3>Registered Developer Accounts</h3>
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Access Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.username}>
                      <td style={{ fontWeight: 'bold' }}>{u.username}</td>
                      <td><code>{u.password}</code></td>
                      <td>
                        <span className={getRoleBadgeClass(u.role)}>{u.role}</span>
                      </td>
                      <td>
                        {u.username !== 'admin' && u.username !== currentUser.username ? (
                          <button 
                            className="admin-logout-btn" 
                            style={{ padding: '4px 10px', fontSize: '11px', margin: 0 }}
                            onClick={() => handleDeleteUser(u.username)}
                          >
                            Revoke
                          </button>
                        ) : (
                          <span style={{ fontSize: '12px', color: '#555555', fontStyle: 'italic' }}>Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADD USER / CREDENTIAL CONTROL FORMS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-settings-card" style={{ width: '100%' }}>
              <h3>Create User Login</h3>
              <form onSubmit={handleAddUser}>
                {userSuccess && (
                  <div className="upload-status-indicator" style={{ background: 'rgba(74, 169, 108, 0.1)', color: '#4aa96c', borderColor: 'rgba(74, 169, 108, 0.2)' }}>
                    User Added Successfully!
                  </div>
                )}
                <div className="admin-form-group">
                  <label>Username / ID</label>
                  <input 
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="e.g. editor1"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Temporary Password</label>
                  <input 
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="e.g. editpass123"
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Access Level Role</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    <option value="Super Admin">Super Admin (Full Access)</option>
                    <option value="Editor">Editor (Add Snippets, No Configs)</option>
                    <option value="Viewer">Viewer (Read Only)</option>
                  </select>
                </div>
                <button type="submit" className="admin-save-btn" style={{ width: '100%' }}>Create Account</button>
              </form>
            </div>

            <div className="admin-settings-card" style={{ width: '100%' }}>
              <h3>Change My Password</h3>
              <form onSubmit={handleChangeMyPassword}>
                <div className="admin-form-group">
                  <label>Current Password</label>
                  <input 
                    type="password"
                    value={currentPasswordConfirm}
                    onChange={(e) => setCurrentPasswordConfirm(e.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>New Password</label>
                  <input 
                    type="password"
                    value={myNewPassword}
                    onChange={(e) => setMyNewPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="admin-save-btn" style={{ width: '100%', background: '#ffffff', color: '#111111' }}>
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SITE CONFIGURATIONS */}
      {activeTab === 'configs' && currentUser.role === 'Super Admin' && (
        <form onSubmit={handleSaveConfig} className="admin-settings-grid">
          {/* APIS SECTION */}
          <div className="admin-settings-card" style={{ width: '100%' }}>
            <h3>Global API Identifiers</h3>
            {configSuccess && (
              <div className="upload-status-indicator" style={{ background: 'rgba(74, 169, 108, 0.1)', color: '#4aa96c', borderColor: 'rgba(74, 169, 108, 0.2)', marginBottom: '15px' }}>
                Configurations Saved Successfully!
              </div>
            )}
            <div className="admin-form-group">
              <label>Web3Forms Access Key</label>
              <input 
                type="text" 
                value={web3Key}
                onChange={(e) => setWeb3Key(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>YouTube Data API Key</label>
              <input 
                type="text" 
                value={ytKey}
                onChange={(e) => setYtKey(e.target.value)}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Footer Default Ticker text</label>
              <input 
                type="text" 
                value={defaultTickerText}
                onChange={(e) => setDefaultTickerText(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="admin-save-btn">Save Configurations</button>
          </div>

          {/* DEPLOYMENT & PUBLISHING SECTION */}
          <div className="admin-settings-card" style={{ width: '100%' }}>
            <h3>Deployment & Publishing</h3>
            <p style={{ fontSize: '13px', color: '#888888', marginBottom: '20px', lineHeight: '1.5' }}>
              To make your new playlists, custom ticker, and snippets permanent for <strong>all visitors</strong> on your live website, download the configuration file below and copy it into your project folder.
            </p>
            <button 
              type="button" 
              className="admin-save-btn" 
              style={{ background: '#ffffff', color: '#111111', width: '100%', display: 'block', textAlign: 'center' }}
              onClick={handleDownloadConfig}
            >
              📥 Download config.json
            </button>
            <small style={{ display: 'block', marginTop: '10px', fontSize: '11px', color: '#555555', fontStyle: 'italic', lineHeight: '1.4' }}>
              Replace the file at <strong>public/config.json</strong> in your project folder with this downloaded file, then deploy the site.
            </small>
          </div>
        </form>
      )}

      {/* TAB 5: CLOUD STORAGE CREDENTIALS */}
      {activeTab === 'settings' && currentUser.role === 'Super Admin' && (
        <div className="admin-settings-card">
          <h3>Supabase Storage Credentials</h3>
          <form onSubmit={handleSaveSettings}>
            {settingsSuccess && (
              <div className="upload-status-indicator" style={{ background: 'rgba(74, 169, 108, 0.1)', color: '#4aa96c', borderColor: 'rgba(74, 169, 108, 0.2)' }}>
                Cloud Settings Saved!
              </div>
            )}
            <div className="admin-form-group">
              <label>Supabase URL</label>
              <input 
                type="text" 
                value={supabaseUrl} 
                onChange={(e) => setSupabaseUrl(e.target.value)} 
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Supabase Anon Key</label>
              <input 
                type="password" 
                value={supabaseKey} 
                onChange={(e) => setSupabaseKey(e.target.value)} 
                placeholder="Paste public anon key here"
              />
            </div>
            <div className="admin-form-group">
              <label>Storage Bucket Name</label>
              <input 
                type="text" 
                value={supabaseBucket} 
                onChange={(e) => setSupabaseBucket(e.target.value)} 
                required
              />
            </div>
            <button type="submit" className="admin-save-btn">Save Credentials</button>
          </form>
        </div>
      )}

      {/* ADD SNIPPET MODAL OVERLAY */}
      {showAddModal && currentUser.role !== 'Viewer' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h3>Add New Audio Snippet</h3>
            <form onSubmit={handleAddSnippet}>
              {error && <div className="admin-login-error" style={{ marginBottom: '15px' }}>{error}</div>}
              {uploading && (
                <div className="upload-status-indicator">
                  Uploading files to cloud storage... Please wait.
                </div>
              )}

              <div className="admin-form-group">
                <label>Track Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="e.g. Broken Wings"
                  required
                  disabled={uploading}
                />
              </div>

              <div className="admin-form-group">
                <label>Source Type</label>
                <select 
                  value={uploadMode} 
                  onChange={(e) => setUploadMode(e.target.value)}
                  disabled={uploading}
                >
                  <option value="local">Local Assets Folder Path</option>
                  <option value="cloud">Upload File directly to Supabase Cloud</option>
                </select>
              </div>

              {uploadMode === 'cloud' ? (
                <div className="admin-form-group">
                  <label>Audio File Upload</label>
                  <input 
                    type="file" 
                    accept="audio/*" 
                    onChange={(e) => setNewFile(e.target.files[0])}
                    required
                    disabled={uploading}
                  />
                </div>
              ) : (
                <div className="admin-form-group">
                  <label>Local Path (Relative to Public)</label>
                  <input 
                    type="text" 
                    value={newLocalPath} 
                    onChange={(e) => setNewLocalPath(e.target.value)}
                    placeholder="Resource/Audio/my-song.mp3"
                    required
                    disabled={uploading}
                  />
                </div>
              )}

              <div className="admin-login-btn-group" style={{ marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="admin-login-btn cancel" 
                  onClick={() => { setShowAddModal(false); setError(''); }}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-login-btn submit"
                  disabled={uploading}
                >
                  Save Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD PROJECT MODAL OVERLAY */}
      {showAddProjModal && currentUser.role !== 'Viewer' && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <h3>Add Project Playlist</h3>
            <form onSubmit={handleAddProject}>
              <div className="admin-form-group">
                <label>Playlist Title</label>
                <input 
                  type="text" 
                  value={newProjTitle} 
                  onChange={(e) => setNewProjTitle(e.target.value)} 
                  placeholder="e.g. Chapter 7/21 Part 2"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>YouTube Playlist ID</label>
                <input 
                  type="text" 
                  value={newProjPlaylistId} 
                  onChange={(e) => setNewProjPlaylistId(e.target.value)} 
                  placeholder="e.g. PLX__0TZa..."
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Release Year</label>
                <input 
                  type="text" 
                  value={newProjYear} 
                  onChange={(e) => setNewProjYear(e.target.value)} 
                  placeholder="e.g. 2026 or Continuous"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Visual Style Theme</label>
                <select 
                  value={newProjClass} 
                  onChange={(e) => setNewProjClass(e.target.value)}
                >
                  <option value="chapter-721-bg">Chapter 7/21 (Dark Pink Gradient)</option>
                  <option value="nightmare-bg">Nightmare (Deep Blue Shadow)</option>
                  <option value="eln-bg">Eternal Love Notes (Purple Gradient)</option>
                  <option value="singles-bg">Singles Collection (Sleek Slate)</option>
                </select>
              </div>

              <div className="admin-login-btn-group" style={{ marginTop: '20px' }}>
                <button 
                  type="button" 
                  className="admin-login-btn cancel" 
                  onClick={() => setShowAddProjModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="admin-login-btn submit"
                >
                  Save Playlist
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
