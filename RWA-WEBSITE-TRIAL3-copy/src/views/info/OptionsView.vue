<template>
  <div class="options-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Options</h1>
        <p class="page-subtitle">Configure your account preferences and settings</p>
      </div>

      <div class="options-grid">
        <!-- Account Options -->
        <div class="option-section">
          <div class="section-header">
            <h2 class="section-title">Account Options</h2>
            <span class="section-icon">👤</span>
          </div>
          <div class="option-items">
            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Profile Visibility</h3>
                <p class="option-description">Control who can see your profile information</p>
              </div>
              <div class="option-control">
                <select class="option-select">
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Email Notifications</h3>
                <p class="option-description">Receive notifications about account activities</p>
              </div>
              <div class="option-control">
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Two-Factor Authentication</h3>
                <p class="option-description">Add an extra layer of security to your account</p>
              </div>
              <div class="option-control">
                <button class="btn btn-secondary">Enable 2FA</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Trading Options -->
        <div class="option-section">
          <div class="section-header">
            <h2 class="section-title">Trading Options</h2>
            <span class="section-icon">📊</span>
          </div>
          <div class="option-items">
            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Default Trading Pair</h3>
                <p class="option-description">Set your preferred trading pair for quick access</p>
              </div>
              <div class="option-control">
                <select class="option-select">
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="USDC/USDT">USDC/USDT</option>
                </select>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Auto-Confirm Trades</h3>
                <p class="option-description">Automatically confirm trades under specified amount</p>
              </div>
              <div class="option-control">
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Price Alerts</h3>
                <p class="option-description">Get notified when prices reach your target</p>
              </div>
              <div class="option-control">
                <button class="btn btn-secondary">Manage Alerts</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Options -->
        <div class="option-section">
          <div class="section-header">
            <h2 class="section-title">Privacy Options</h2>
            <span class="section-icon">🔒</span>
          </div>
          <div class="option-items">
            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Data Collection</h3>
                <p class="option-description">Allow us to collect anonymous usage data</p>
              </div>
              <div class="option-control">
                <label class="toggle-switch">
                  <input type="checkbox" checked>
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Marketing Emails</h3>
                <p class="option-description">Receive promotional emails and updates</p>
              </div>
              <div class="option-control">
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Third-Party Sharing</h3>
                <p class="option-description">Allow sharing data with trusted partners</p>
              </div>
              <div class="option-control">
                <label class="toggle-switch">
                  <input type="checkbox">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Advanced Options -->
        <div class="option-section">
          <div class="section-header">
            <h2 class="section-title">Advanced Options</h2>
            <span class="section-icon">⚙️</span>
          </div>
          <div class="option-items">
            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">API Access</h3>
                <p class="option-description">Manage your API keys and permissions</p>
              </div>
              <div class="option-control">
                <button class="btn btn-secondary">API Settings</button>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Export Data</h3>
                <p class="option-description">Download your account data</p>
              </div>
              <div class="option-control">
                <button class="btn btn-secondary">Export</button>
              </div>
            </div>

            <div class="option-item">
              <div class="option-info">
                <h3 class="option-name">Reset Preferences</h3>
                <p class="option-description">Reset all options to default values</p>
              </div>
              <div class="option-control">
                <button class="btn btn-danger">Reset</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-actions">
        <button class="btn btn-primary">Save Changes</button>
        <button class="btn btn-secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionsView',
  data() {
    return {
      // Options data will be handled here
    }
  },
  methods: {
    saveOptions() {
      // Save options logic
      console.log('Options saved');
    }
  }
}
</script>

<style scoped>
.options-page {
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

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.option-section {
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

.option-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--bg-secondary, #16213e);
  border-radius: 8px;
  border: 1px solid var(--border-light, #3a3a5a);
}

.option-info {
  flex: 1;
}

.option-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text, #ffffff);
  margin: 0 0 4px 0;
}

.option-description {
  font-size: 0.9rem;
  color: var(--text-secondary, #a0a0a0);
  margin: 0;
}

.option-control {
  margin-left: 20px;
}

.option-select {
  padding: 8px 12px;
  background: var(--bg, #0f0f23);
  border: 1px solid var(--border, #2a2a4a);
  border-radius: 6px;
  color: var(--text, #ffffff);
  font-size: 0.9rem;
  min-width: 120px;
}

.option-select:focus {
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
  .options-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .option-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .option-control {
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
