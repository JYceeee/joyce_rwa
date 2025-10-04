<template>
  <div class="settings-page">
    <div class="settings-container">
      <!-- 左侧边栏 -->
      <div class="settings-sidebar">
        <div class="sidebar-header">
          <h1 class="sidebar-title">设置</h1>
        </div>
        <nav class="sidebar-nav">
          <button 
            v-for="section in settingsSections" 
            :key="section.id"
            class="sidebar-item"
            :class="{ active: activeSection === section.id }"
            @click="setActiveSection(section.id)"
          >
            <span class="sidebar-icon">{{ section.icon }}</span>
            <span class="sidebar-text">{{ section.title }}</span>
          </button>
        </nav>
      </div>

      <!-- 右侧主内容区 -->
      <div class="settings-main">
        <div class="main-header">
          <h2 class="main-title">{{ getActiveSectionTitle() }}</h2>
          <p class="main-subtitle">{{ getActiveSectionDescription() }}</p>
        </div>
        
        <div class="main-content">
          <!-- General Settings -->
          <div v-if="activeSection === 'general'" class="settings-section">
            <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">语言</h3>
                <p class="settings-description">选择您偏好的语言</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="en">英语</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">主题</h3>
                <p class="settings-description">选择您偏好的主题</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="dark">深色</option>
                  <option value="light">浅色</option>
                  <option value="auto">自动</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">时区</h3>
                <p class="settings-description">设置您的本地时区</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="UTC">UTC</option>
                  <option value="EST">东部时间</option>
                  <option value="PST">太平洋时间</option>
                  <option value="CST">中国标准时间</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">开场视频</h3>
                <p class="settings-description">重新观看网站开场视频</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary" @click="watchIntroVideo">观看开场视频</button>
              </div>
            </div>
          </div>
        </div>

          <!-- Security Settings -->
          <div v-if="activeSection === 'security'" class="settings-section">
            <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">密码</h3>
                <p class="settings-description">更改您的账户密码</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">更改密码</button>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">会话超时</h3>
                <p class="settings-description">设置自动登出时间</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="15">15分钟</option>
                  <option value="30">30分钟</option>
                  <option value="60">1小时</option>
                  <option value="480">8小时</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">登录提醒</h3>
                <p class="settings-description">接收新登录尝试的通知</p>
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
          <div v-if="activeSection === 'wallet'" class="settings-section">
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
          <div v-if="activeSection === 'notifications'" class="settings-section">
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
          <div v-if="activeSection === 'performance'" class="settings-section">
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

          <!-- Account Options -->
          <div v-if="activeSection === 'account'" class="settings-section">
            <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Profile Visibility</h3>
                <p class="settings-description">Control who can see your profile information</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Two-Factor Authentication</h3>
                <p class="settings-description">Add an extra layer of security to your account</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">Enable 2FA</button>
              </div>
            </div>
          </div>
        </div>

          <!-- Trading Options -->
          <div v-if="activeSection === 'trading'" class="settings-section">
            <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Default Trading Pair</h3>
                <p class="settings-description">Set your preferred trading pair for quick access</p>
              </div>
              <div class="settings-control">
                <select class="settings-select">
                  <option value="ETH/USDT">ETH/USDT</option>
                  <option value="BTC/USDT">BTC/USDT</option>
                  <option value="USDC/USDT">USDC/USDT</option>
                </select>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Auto-Confirm Trades</h3>
                <p class="settings-description">Automatically confirm trades under specified amount</p>
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
                <h3 class="settings-name">Price Alerts</h3>
                <p class="settings-description">Get notified when prices reach your target</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">Manage Alerts</button>
              </div>
            </div>
          </div>
        </div>

          <!-- Privacy Options -->
          <div v-if="activeSection === 'privacy'" class="settings-section">
            <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Data Collection</h3>
                <p class="settings-description">Allow us to collect anonymous usage data</p>
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
                <h3 class="settings-name">Marketing Emails</h3>
                <p class="settings-description">Receive promotional emails and updates</p>
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
                <h3 class="settings-name">Third-Party Sharing</h3>
                <p class="settings-description">Allow sharing data with trusted partners</p>
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

          <!-- Advanced Settings -->
          <div v-if="activeSection === 'advanced'" class="settings-section">
            <div class="settings-items">
            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">API Access</h3>
                <p class="settings-description">Manage your API keys and permissions</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">API Settings</button>
              </div>
            </div>

            <div class="settings-item">
              <div class="settings-info">
                <h3 class="settings-name">Export Data</h3>
                <p class="settings-description">Download your account data</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-secondary">Export</button>
              </div>
            </div>

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
                <h3 class="settings-name">Reset Preferences</h3>
                <p class="settings-description">Reset all options to default values</p>
              </div>
              <div class="settings-control">
                <button class="btn btn-danger">Reset All</button>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- 页面操作按钮 -->
        <div class="page-actions">
          <button class="btn btn-primary" @click="saveSettings">Save Settings</button>
          <button class="btn btn-secondary" @click="resetSettings">Reset to Default</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsView',
  data() {
    return {
      activeSection: 'general', // 默认显示General Settings
      settingsSections: [
        { id: 'general', title: '常规', icon: '', description: '基本应用程序设置和偏好' },
        { id: 'security', title: '安全', icon: '', description: '密码、身份验证和安全设置' },
        { id: 'wallet', title: '钱包', icon: '', description: '钱包连接和交易设置' },
        { id: 'notifications', title: '通知', icon: '', description: '通知偏好和提醒设置' },
        { id: 'performance', title: '性能', icon: '', description: '性能优化和缓存设置' },
        { id: 'account', title: '账户', icon: '', description: '账户选项和个人资料设置' },
        { id: 'trading', title: '交易', icon: '', description: '交易偏好和选项设置' },
        { id: 'privacy', title: '隐私', icon: '', description: '隐私控制和数据设置' },
        { id: 'advanced', title: '高级', icon: '', description: '高级设置和开发者选项' }
      ],
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
        analytics: true,
        // Account Options
        profileVisibility: 'public',
        twoFactorAuth: false,
        // Trading Options
        defaultTradingPair: 'ETH/USDT',
        autoConfirmTrades: false,
        // Privacy Options
        dataCollection: true,
        marketingEmails: false,
        thirdPartySharing: false
      }
    }
  },
  methods: {
    setActiveSection(sectionId) {
      this.activeSection = sectionId;
    },
    getActiveSectionTitle() {
      const section = this.settingsSections.find(s => s.id === this.activeSection);
      return section ? section.title : 'Settings';
    },
    getActiveSectionDescription() {
      const section = this.settingsSections.find(s => s.id === this.activeSection);
      return section ? section.description : 'Manage your application preferences';
    },
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
          analytics: true,
          // Account Options
          profileVisibility: 'public',
          twoFactorAuth: false,
          // Trading Options
          defaultTradingPair: 'ETH/USDT',
          autoConfirmTrades: false,
          // Privacy Options
          dataCollection: true,
          marketingEmails: false,
          thirdPartySharing: false
        };
        localStorage.removeItem('userSettings');
        alert('Settings reset to default values!');
      }
    },
    watchIntroVideo() {
      // 清除开场视频观看记录，跳转到开场视频页面
      localStorage.removeItem('rwa_intro_seen');
      this.$router.push('/intro');
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

.settings-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;
  min-height: calc(100vh - 80px);
}

/* 左侧边栏样式 */
.settings-sidebar {
  width: 280px;
  background: var(--card-bg, #1a1a2e);
  border-radius: 16px;
  padding: 24px 0;
  height: fit-content;
  position: sticky;
  top: 40px;
}

.sidebar-header {
  padding: 0 24px 20px;
  border-bottom: 1px solid var(--border, #303049);
  margin-bottom: 20px;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text, #ffffff);
  margin: 0;
}

.sidebar-nav {
  padding: 0 12px;
}

.sidebar-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 4px;
  border: none;
  background: transparent;
  border-radius: 8px;
  color: var(--text-secondary, #a0a0a0);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.sidebar-item:hover {
  background: var(--hover-bg, #30304c);
  color: var(--text, #ffffff);
}

.sidebar-item.active {
  background: var(--brand, #667eea);
  color: #ffffff;
  font-weight: 600;
}

.sidebar-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.sidebar-text {
  flex: 1;
}

/* 右侧主内容区样式 */
.settings-main {
  flex: 1;
  background: var(--card-bg, #1a1a2e);
  border-radius: 16px;
  padding: 32px;
}

.main-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--border, #2a2a4a);
}

.main-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text, #ffffff);
  margin: 0 0 8px;
}

.main-subtitle {
  font-size: 1rem;
  color: var(--text-secondary, #a0a0a0);
  margin: 0;
}

.main-content {
  min-height: 400px;
}

.settings-section {
  padding: 0;
  margin-bottom: 0;
}

/* section-header 样式已移除，现在使用 main-header */

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
  background: var(--brand, #3f3d39);
  color: #fffefe;
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

/* 响应式设计 */
@media (max-width: 1024px) {
  .settings-container {
    flex-direction: column;
    gap: 20px;
  }

  .settings-sidebar {
    width: 100%;
    position: static;
    order: 2;
  }

  .settings-main {
    order: 1;
  }

  .sidebar-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 24px;
  }

  .sidebar-item {
    flex: 1;
    min-width: 120px;
    justify-content: center;
    margin-bottom: 0;
  }
}

@media (max-width: 768px) {
  .settings-container {
    padding: 0 16px;
  }

  .settings-main {
    padding: 20px;
  }

  .main-title {
    font-size: 1.5rem;
  }

  .sidebar-item {
    min-width: 100px;
    padding: 8px 12px;
  }

  .sidebar-text {
    display: none;
  }

  .sidebar-icon {
    font-size: 1.2rem;
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

  .page-actions {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .sidebar-nav {
    padding: 0 16px;
  }

  .sidebar-item {
    min-width: 80px;
    padding: 6px 8px;
  }

  .sidebar-icon {
    font-size: 1rem;
  }
}
</style>
