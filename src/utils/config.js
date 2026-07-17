let cachedConfig = null;

export async function getConfig(key, defaultValue) {
  // 1. Check if there is an edited value in localStorage first (so local edits show up instantly on your browser)
  const localVal = localStorage.getItem(key);
  if (localVal !== null && localVal !== undefined) {
    try {
      return JSON.parse(localVal);
    } catch (e) {
      return localVal;
    }
  }

  // 2. Visitor mode on a new browser: fetch from the deployed public/config.json (cached in memory)
  if (!cachedConfig) {
    try {
      const response = await fetch('/config.json');
      cachedConfig = await response.json();
    } catch (err) {
      console.warn("Failed to fetch public/config.json, falling back:", err);
      return defaultValue;
    }
  }

  if (cachedConfig) {
    if (key === 'snippetTracks') return cachedConfig.snippetTracks || defaultValue;
    if (key === 'projectPlaylists') return cachedConfig.projectPlaylists || defaultValue;
    if (key === 'siteConfigs') return cachedConfig.siteConfigs || defaultValue;
    if (cachedConfig.siteConfigs && cachedConfig.siteConfigs[key] !== undefined) {
      return cachedConfig.siteConfigs[key];
    }
  }

  return defaultValue;
}
