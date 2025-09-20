<template>
  <div class="settings-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your application preferences and system configurations</p>
      </div>

      <div class="settings-grid">
        <!-- General Settings -->
        <div class="settings-section">
          <div class="section-header">
            <h2 class="section-title">General Settings</h2>
            <span class="section-icon">⚙️</span>
          </div>
          <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Language</h3>
                <p class="settings-description">Choose your preferred language</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Theme</h3>
                <p class="settings-description">Select your preferred theme</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Timezone</h3>
                <p class="settings-description">Set your local timezone</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="CST">China Standard Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Security Settings</h2>
            <span class="section-icon">🔐</span>
          </div>
          <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Password</h3>
                <p class="settings-description">Change your account password</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">Change Password</button>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Session Timeout</h3>
                <p class="settings-description">Set automatic logout time</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Login Alerts</h3>
                <p class="settings-description">Get notified of new login attempts</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Wallet Settings -->
        <div class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Wallet Settings</h2>
            <span class="section-icon">💼</span>
          </div>
          <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Default Wallet</h3>
                <p class="settings-description">Select your preferred wallet provider</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="metamask">MetaMask</option>
                  <option value="walletconnect">WalletConnect</option>
                  <option value="coinbase">Coinbase Wallet</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Auto-Connect</h3>
                <p class="settings-description">Automatically connect wallet on page load</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Gas Settings</h3>
                <p class="settings-description">Configure transaction gas preferences</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">Gas Settings</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Notifications</h2>
            <span class="section-icon">🔔</span>
          </div>
          <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Push Notifications</h3>
                <p class="settings-description">Enable browser push notifications</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Email Notifications</h3>
                <p class="settings-description">Receive important updates via email</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">SMS Alerts</h3>
                <p class="settings-description">Get critical alerts via SMS</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Settings -->
        <div class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Performance</h2>
            <span class="section-icon">⚡</span>
          </div>
          <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Auto-Refresh</h3>
                <p class="settings-description">Automatically refresh data</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="0">Disabled</option>
                  <option value="30">30 seconds</option>
                  <option value="60">1 minute</option>
                  <option value="300">5 minutes</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Cache Size</h3>
                <p class="settings-description">Maximum cache storage size</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="100">100 MB</option>
                  <option value="250">250 MB</option>
                  <option value="500">500 MB</option>
                  <option value="1000">1 GB</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Clear Cache</h3>
                <p class="settings-description">Clear all cached data</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">Clear Cache</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Settings -->
        <div class="settings-section">
          <div class="section-header">
            <h2 class="section-title">Advanced</h2>
            <span class="section-icon">🔧</span>
          </div>
          <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Developer Mode</h3>
                <p class="settings-description">Enable developer tools and debug mode</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Analytics</h3>
                <p class="settings-description">Help improve the app by sharing usage data</p>
              </div>
              <div class="settings-control">
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Reset All Settings</h3>
                <p class="settings-description">Reset all settings to default values</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-danger">Reset Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary" @click="saveSettings">Save Settings</button>
        <button class="btn btn-secondary" @click="resetSettings">Reset to Default</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  data() {
    return {
      settings: {
        language: 'en',
        theme: 'dark',
        timezone: 'UTC',
        sessionTimeout: 30,
        defaultWallet: 'metamask',
        autoConnect: false,
        pushNotifications: true,
        emailNotifications: true,
        smsAlerts: false,
        autoRefresh: 60,
        cacheSize: 250,
        developerMode: false,
        analytics: true
      }
    }
  },
  methods: {
    saveSettings() {
      // Save settings logic
      console.log('Settings saved:', this.settings);
      // Here you would typically save to localStorage or send to backend
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
      alert('Settings saved successfully!');
    },
    resetSettings() {
      if (confirm('Are you sure you want to reset all settings to default values?')) {
        // Reset to default values
        this.settings = {
          language: 'en',
          theme: 'dark',
          timezone: 'UTC',
          sessionTimeout: 30,
          defaultWallet: 'metamask',
          autoConnect: false,
          pushNotifications: true,
          emailNotifications: true,
          smsAlerts: false,
          autoRefresh: 60,
          cacheSize: 250,
          developerMode: false,
          analytics: true
        };
        localStorage.removeItem('userSettings');
        alert('Settings reset to default values!');
      }
    }
  },
  mounted() {
    // Load saved settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: var(--bg, #0f0f23);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text, #ffffff);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary, #a0a0a0);
  margin: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.settings-section {
  background: var(--card-bg, #1a1a2e);
  border: 1px solid var(--border, #2a2a4a);
  border-radius: 12px;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border, #2a2a4a);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text, #ffffff);
  margin: 0;
}

.section-icon {
  font-size: 1.5rem;
}

.settings-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-secondary, #16213e);
  border-radius: 8px;
  border: 1px solid var(--border-light, #3a3a5a);
}

.settings-info {
  flex: 1;
}

.settings-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text, #ffffff);
  margin: 0 0 4px 0;
}

.settings-description {
  font-size: 0.9rem;
  color: var(--text-secondary, #a0a0a0);
  margin: 0;
}

.settings-control {
  margin-left: 20px;
}

.settings-select {
  padding: 8px 12px;
  background: var(--bg, #0f0f23);
  border: 1px solid var(--border, #2a2a4a);
  border-radius: 6px;
  color: var(--text, #ffffff);
  font-size: 0.9rem;
  min-width: 140px;
}

.settings-select:focus {
  outline: none;
  border-color: var(--brand, #ffa500);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--border, #2a2a4a);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--brand, #ffa500);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

/* Buttons */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: var(--brand, #ffa500);
  color: #000;
}

.btn-primary:hover {
  background: #e6940a;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--text, #ffffff);
  border: 1px solid var(--border, #2a2a4a);
}

.btn-secondary:hover {
  background: var(--brand-600, rgba(255, 165, 0, 0.1));
  border-color: var(--brand, #ffa500);
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.page-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 30px;
  border-top: 1px solid var(--border, #2a2a4a);
}

/* Responsive Design */
@media (max-width: 768px) {
  .settings-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .settings-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .settings-control {
    margin-left: 0;
    align-self: flex-end;
  }

  .page-title {
    font-size: 2rem;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
