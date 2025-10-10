<template>

  <!-- 解绑账号弹窗 -->
  <div v-if="showDisconnectModal" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">{{ t('wallet.disconnect') }}</h2>
        <p style="color:#ffffff;">{{ t('wallet.disconnect.confirm') }}</p>
        <div>
          <span style="display:block;font-size:15px;padding:8px 0;color:#ffffff;background:#2a2a4a;border-radius:8px;">{{ fullAddress }}</span>
        </div>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showDisconnectModal=false">{{ t('common.cancel') }}</button>
          <button class="mm-btn mm-outline" style="margin-left:8px;" @click="confirmDisconnect">{{ t('common.confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 解绑成功弹窗 -->
  <div v-if="showDisconnectSuccess" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">{{ t('wallet.disconnectSuccess') }}</h2>
        <p style="color:#ffffff;">{{ t('wallet.disconnectSuccessMsg') }}</p>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showDisconnectSuccess=false">{{ t('common.confirm') }}</button>
        </div>
      </div>
    </div>
  </div>
  
  <header class="header"> 
    <div class="container nav">
      <div class="left">
        <a class="brand" href="#" @click.prevent="go('/')">
          <img src="/icons/RWA-logo.svg" alt="Mortgage RWA" class="brand-logo" />
        </a>
        <nav class="menu" aria-label="Primary">
          <!-- <a href="#" @click.prevent="go('/home')" class="menu-item">首页</a> -->
          <a href="#" @click.prevent="go('/about')" class="menu-item">{{ t('nav.about') }}</a>
          <a href="#" @click.prevent="go('/listedprojects')" class="menu-item">{{ t('nav.listedProjects') }}</a>
          <a href="#" @click.prevent="go('/to-be-listed')" class="menu-item">{{ t('nav.toBeListed') }}</a>
          <a href="#" @click.prevent="goToContactUs" class="menu-item">{{ t('nav.contact') }}</a>
          <!-- <a href="#" @click.prevent="go('/portfolio')" class="menu-item">我的投资组合</a> -->
        </nav>
        
        <!-- 移动端汉堡菜单按钮 -->
        <button 
          class="mobile-menu-btn" 
          @click="toggleMobileMenu"
          :class="{ active: mobileMenuOpen }"
          aria-label="Toggle mobile menu"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>

      <div class="right">
      
      <!-- User Auth Buttons -->
        <div v-if="isLoggedIn">
          <!-- 钱包连接状态显示 -->
          <div v-if="!connected" class="wallet-connect-section">
            <button class="btn orange pill" @click.prevent="connectWallet">
              <span>{{ t('wallet.connect') }}</span>
            </button>
          </div>
          
          <!-- 已连接钱包显示 -->
          <div v-else class="wallet-dropdown-container">
            <div class="wallet-btn-wrapper">
               <button class="btn orange pill wallet-main-btn" @click.prevent="goToWallet()">
                 <span class="wallet-address-text">{{ shortAddress }}</span>
                 <!-- <span class="wallet-icon-text">💳</span> -->
               </button>
               <div class="wallet-divider"></div>
                <button class="btn orange pill wallet-dropdown-btn" 
                @click.prevent="toggleWalletDropdown">
                 <span class="dropdown-arrow">▾</span>
               </button>
            </div>
            <div v-if="walletDropdownOpen" class="wallet-dropdown-menu" style="color: #ffffff;">
              <div class="wallet-dropdown-header">{{ t('wallet.management') }}</div>
              <a href="#" @click.prevent="showDisconnectModal = true; walletDropdownOpen = false" class="wallet-dropdown-item">
                <span>{{ t('wallet.disconnect') }}</span>
              </a>
            </div>
          </div>
          <button class="btn light pill" @click.prevent="goToProfile()">
            <span>👤</span>
          </button>
          <button class="btn ghost pill settings-btn" @click.prevent="go('/settings')">⚙️</button>
          <button class="btn ghost pill language-btn" @click.prevent="toggleLanguage">
            <span>{{ getCurrentLanguageDisplay() }}</span>
          </button>
        </div>
        <div v-else>
          <a class="btn ghost" href="#" @click.prevent="go('/login')">{{ t('common.login') }}</a>
          <a class="btn orange" href="#" @click.prevent="go('/signup')">{{ t('common.signup') }}</a>
          <a href="#" @click.prevent="go('/settings')"><button class="btn ghost pill settings-btn">⚙️</button></a>
          <button class="btn ghost pill language-btn" @click.prevent="toggleLanguage">
            <span>{{ getCurrentLanguageDisplay() }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-content">
        <!-- <a href="#" @click.prevent="go('/home')" class="mobile-menu-item">
          <span class="mobile-menu-icon">🏠</span> 
          <span>Home</span>
        </a> -->
        <a href="#" @click.prevent="go('/about')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">🏢</span> -->
          <span>{{ t('nav.about') }}</span>
        </a>
        <a href="#" @click.prevent="go('/listedprojects')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">📊</span> -->
          <span>{{ t('nav.listedProjects') }}</span>
        </a>
        <a href="#" @click.prevent="go('/to-be-listed')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">⏳</span> -->
          <span>{{ t('nav.toBeListed') }}</span>
        </a>
        <a href="#" @click.prevent="goToContactUs" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">📞</span> -->
          <span>{{ t('nav.contact') }}</span>
        </a>
        <!-- <a href="#" @click.prevent="go('/portfolio')" class="mobile-menu-item">
          <span>My Portfolio</span>
        </a> -->
      </div>
    </div>
    
  </header>
</template>

<script>
import { isLoggedIn, clearAuth, AUTH_CHANGED_EVENT } from '@/utils/auth';
import { useWallet } from '@/composables/useWallet';
import { useLanguage } from '@/composables/useLanguage';

export default {
  name: 'AppHeader',
  props: {},
  setup() {
    const { connected, fullAddress, shortAddress, connect, disconnect } = useWallet()
    const { t, setLanguage, getCurrentLanguage } = useLanguage()
    
    return {
      connected,
      fullAddress,
      shortAddress,
      connect,
      disconnect,
      t,
      setLanguage,
      getCurrentLanguage
    }
  },
  data(){
    return { 
      isLoggedIn: false,
      moreDropdownOpen: false,
      mobileMenuOpen: false,
      walletDropdownOpen: false,
      showDisconnectModal: false,
      showDisconnectSuccess: false,
      disconnectSuccessMsg: ''
    }
  },

  methods: {
    noop(){},
    go(path){
      this.$router.push(path);
      this.closeMoreDropdown();
      this.closeMobileMenu();
    },
    toggleLanguage() {
      const currentLang = this.getCurrentLanguage.code;
      const newLang = currentLang === 'zh' ? 'en' : 'zh';
      this.setLanguage(newLang);
    },
    getCurrentLanguageDisplay() {
      const currentLang = this.getCurrentLanguage.code;
      return currentLang === 'zh' ? '中' : 'ENG';
    },
    toggleMoreDropdown(){
      this.moreDropdownOpen = !this.moreDropdownOpen;
      this.closeMobileMenu();
    },
    closeMoreDropdown(){
      this.moreDropdownOpen = false;
    },
    toggleWalletDropdown(){
      this.walletDropdownOpen = !this.walletDropdownOpen;
      this.updateArrowRotation();
    },
    hideWalletDropdown(){
      this.walletDropdownOpen = false;
      this.updateArrowRotation();
    },
    updateArrowRotation(){
      this.$nextTick(() => {
        const arrow = this.$el.querySelector('.dropdown-arrow');
        if (arrow) {
          arrow.style.transform = this.walletDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      });
    },
    toggleMobileMenu(){
      this.mobileMenuOpen = !this.mobileMenuOpen;
      this.closeMoreDropdown();
    },
    closeMobileMenu(){
      this.mobileMenuOpen = false;
    },
    // refreshAuth() {
    //   const logged = localStorage.getItem('isLoggedIn') === 'true';
    //   this.isLoggedIn = logged;

    //   const token = localStorage.getItem('token');
    //   if (logged && token) {
    //     axios.defaults.headers.common['Authorization'] = token;
    //   } else {
    //     delete axios.defaults.headers.common['Authorization'];
    //   }
    // },
    checkLogin(){
      this.isLoggedIn = isLoggedIn();
    },
    logout(){
      clearAuth();
      this.$router.push('/login');
    },

    onDocClick(e){
      const dropdown = this.$el.querySelector('.dropdown-container')
      const mobileMenuBtn = this.$el.querySelector('.mobile-menu-btn')
      const mobileMenu = this.$el.querySelector('.mobile-menu')
      const walletDropdown = this.$el.querySelector('.wallet-dropdown-container')
      
      // 处理dropdown点击外部关闭
      if(dropdown && this.moreDropdownOpen && !dropdown.contains(e.target)){
        this.closeMoreDropdown()
      }
      
      // 处理钱包下拉菜单点击外部关闭
      if(walletDropdown && this.walletDropdownOpen && !walletDropdown.contains(e.target)){
        this.hideWalletDropdown()
      }
      
      // 处理移动端菜单点击外部关闭
      if(mobileMenu && this.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)){
        this.closeMobileMenu()
      }
    },
    async connectWallet() {
      try {
        await this.connect();
        console.log("Wallet connected successfully");
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    },
    shortenAddress(addr) {
      return addr.slice(0, 6) + "..." + addr.slice(-4);
    },
    goToWallet() {
      // alert('跳转到钱包页面');
      this.go('/wallet');
    },
    goToProfile() {
      // alert('跳转到个人资料页面');
      this.go('/profile');
    },
    goToContactUs() {
      // 跳转到ContactUs组件页面
      this.go('/contact');
    },
    addManualWallet() {
      this.hideWalletDropdown();
      // 实现手动添加钱包的逻辑
      const walletAddress = prompt('请输入钱包地址:');
      if (walletAddress && walletAddress.trim()) {
        this.addManualWalletAddress(walletAddress.trim());
      }
    },
    addManualWalletAddress(address) {
      // 验证地址格式（简单的以太坊地址验证）
      if (address.length === 42 && address.startsWith('0x')) {
        // 存储到localStorage
        const existingWallets = JSON.parse(localStorage.getItem('linkedWallets') || '[]');
        if (!existingWallets.includes(address)) {
          existingWallets.push(address);
          localStorage.setItem('linkedWallets', JSON.stringify(existingWallets));
          const message = this.t('wallet.addressAdded').replace('{address}', address);
          alert(message);
          // 触发钱包更新事件
          this.$emit('wallet-added', address);
        } else {
          alert(this.t('wallet.addressExists'));
        }
      } else {
        alert(this.t('wallet.invalidAddress'));
      }
    },
    setPrimaryWallet() {
      this.hideWalletDropdown();
      // 获取已连接的钱包列表
      const linkedWallets = JSON.parse(localStorage.getItem('linkedWallets') || '[]');
      const currentWallet = localStorage.getItem('walletAddress');
      
      if (linkedWallets.length === 0) {
        alert(this.t('wallet.noWalletToSet'));
        return;
      }
      
      // 创建选择对话框
      let options = linkedWallets.map((wallet, index) => 
        `${index + 1}. ${wallet}${wallet === currentWallet ? ' (当前)' : ''}`
      ).join('\n');
      
      const choice = prompt(`选择要设置为主钱包的地址:\n${options}\n\n请输入序号:`);
      const selectedIndex = parseInt(choice) - 1;
      
      if (selectedIndex >= 0 && selectedIndex < linkedWallets.length) {
        const selectedWallet = linkedWallets[selectedIndex];
        localStorage.setItem('primaryWallet', selectedWallet);
        localStorage.setItem('walletAddress', selectedWallet);
        const message = this.t('wallet.primaryWalletSet').replace('{wallet}', selectedWallet);
        alert(message);
        this.$emit('primary-wallet-changed', selectedWallet);
      } else if (choice !== null) {
        alert(this.t('wallet.invalidSelection'));
      }
    },
    
    // 显示断开连接弹窗
    disconnectWallet() {
      this.hideWalletDropdown();
      this.showDisconnectModal = true;
    },
    
    // 确认断开连接
    async confirmDisconnect() {
      try {
        await this.disconnect();
        this.showDisconnectModal = false;
        this.showDisconnectSuccess = true;
        this.disconnectSuccessMsg = this.t('wallet.disconnectSuccessMsg');
        console.log("Wallet disconnected successfully");
      } catch (error) {
        console.error("Wallet disconnection failed:", error);
        this.showDisconnectModal = false;
        alert("Failed to disconnect wallet. Please try again.");
      }
    },
    disconnectWalletConnection(walletAddress) {
      // 从列表中移除钱包
      const linkedWallets = JSON.parse(localStorage.getItem('linkedWallets') || '[]');
      const updatedWallets = linkedWallets.filter(wallet => wallet !== walletAddress);
      localStorage.setItem('linkedWallets', JSON.stringify(updatedWallets));
      
      // 如果断开的是当前钱包，清除当前连接状态
      const currentWallet = localStorage.getItem('walletAddress');
      if (currentWallet === walletAddress) {
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('primaryWallet');
      }
      
      const message = this.t('wallet.walletDisconnected').replace('{address}', walletAddress);
      alert(message);
      this.$emit('wallet-disconnected', walletAddress);
    }
  },
  mounted(){
    document.addEventListener('click', this.onDocClick);
    this.checkLogin();
    // 监听自定义的 auth 变更事件（同页可用）
    window.addEventListener(AUTH_CHANGED_EVENT, this.checkLogin);
    // 页面刷新时也能保持状态
    this.isLoggedIn = isLoggedIn();
  },
  beforeUnmount(){
    document.removeEventListener('click', this.onDocClick);
    window.removeEventListener(AUTH_CHANGED_EVENT, this.checkLogin);
  }
}
</script>

<style scoped>
.icon-btn {
  margin-right: 10px;
  border: none;
  background: transparent;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
}
.icon-btn:focus { outline: 2px solid #94a3b8; outline-offset: 2px; }

/* Dropdown样式 */
.dropdown-container {
  position: relative;
  display: inline-block;
}

/* 钱包连接区域样式 */
.wallet-connect-section {
  display: inline-block;
  margin-left: 15px;
  margin-right: 15px;
}

/* 连接钱包按钮样式 */
.wallet-connect-section .btn.orange {
  color: #ffffff !important;
  font-weight: bold;
}

.wallet-connect-section .btn.orange span {
  color: #ffffff !important;
  font-weight: bold;
}

/* 钱包下拉菜单样式 */
.wallet-dropdown-container {
  position: relative;
  display: inline-block;
}

.wallet-btn-wrapper {
  display: flex;
  align-items: center;
  background: #f97316;
  color: #ffffff !important;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid transparent;
}

.wallet-main-btn {
  background: transparent;
  border: none;
  color: #ffffff !important;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

/* 钱包地址和图标显示控制 */
.wallet-address-text {
  display: inline;
  font-size: 14px;
  color: #ffffff !important;
  font-weight: bold;
}

.wallet-icon-text {
  display: none;
  color: #ffffff;
}

.wallet-main-btn:hover {
  background: var(--hover-bg);
}

.wallet-divider {
  width: 1px;
  height: 16px;
  background: #ffffff;
  opacity: 0.3;
  flex-shrink: 0;
}

.wallet-dropdown-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-dropdown-btn:hover {
  background: var(--hover-bg);
}

.dropdown-arrow {
  font-size: 20px;
  transition: transform 0.2s ease;
  color: #ffffff !important;
}

/* 下拉箭头旋转效果通过JavaScript控制 */

.wallet-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 200px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  margin-top: 4px;
  animation: dropdownFadeIn 0.2s ease-out;
}

.wallet-dropdown-header {
  padding: 12px 16px;
  color: #8ca0c3;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #2a2a4a;
  background: #23234a;
  border-radius: 8px 8px 0 0;
}

.wallet-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid #2a2a4a;
  font-size: 14px;
  font-weight: 500;
}

.wallet-dropdown-item:last-child {
  border-bottom: none;
  border-radius: 0 0 8px 8px;
}

.wallet-dropdown-item:hover {
  background: #2a2a4a;
  color: #ffffff;
}

/* 浅色主题下的下拉菜单样式 */
[data-theme="light"] .wallet-dropdown-menu {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

[data-theme="light"] .wallet-dropdown-header {
  background: #f9fafb;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
}

[data-theme="light"] .wallet-dropdown-item {
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

[data-theme="light"] .wallet-dropdown-item:hover {
  background: #f3f4f6;
  color: #111827;
}

/* 浅色主题下的弹窗样式 */
[data-theme="light"] .modal-mask {
  background: rgba(0, 0, 0, 0.5);
}

[data-theme="light"] .modal-container {
  background: #ffffff;
  color: #111827;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
}

[data-theme="light"] .modal-container h2 {
  color: #111827 !important;
}

[data-theme="light"] .modal-container p {
  color: #6b7280 !important;
}

[data-theme="light"] .modal-container span {
  color: #374151 !important;
  background: #f9fafb !important;
  border: 1px solid #e5e7eb !important;
}

/* 浅色主题下的按钮样式 */
[data-theme="light"] .mm-btn {
  background: #f9fafb;
  color: #374151;
  border-color: #d1d5db;
}

[data-theme="light"] .mm-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

[data-theme="light"] .mm-btn.mm-outline {
  background: transparent;
  border-color: #6b7280;
  color: #6b7280;
}

[data-theme="light"] .mm-btn.mm-outline:hover {
  background: #f3f4f6;
  color: #111827;
}

[data-theme="light"] .mm-btn.mm-primary {
  background: #f97316;
  border-color: #f97316;
  color: #ffffff;
}

[data-theme="light"] .mm-btn.mm-primary:hover {
  background: #ea580c;
  border-color: #ea580c;
}


.more-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 150px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  margin-top: 4px;
  animation: dropdownFadeIn 0.2s ease-out;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 1px solid #2a2a4a;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #2a2a4a;
  color: #ffffff;
}

.dropdown-divider {
  height: 1px;
  background: #2a2a4a;
  margin: 8px 0;
}

.dropdown-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.test-link {
  color: #fbbf24 !important;
  border-left: 3px solid #fbbf24;
  padding-left: 13px !important;
}

.test-link:hover {
  background: #374151 !important;
  color: #fcd34d !important;
}

.mobile-menu-item.test-link {
  color: #fbbf24 !important;
  border-left: 3px solid #fbbf24;
  padding-left: 13px !important;
}

.mobile-menu-item.test-link:hover {
  background: var(--brand-600) !important;
  color: #fcd34d !important;
}

/* 菜单项样式 */
.menu-item {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: color 0.2s ease;
  padding: 8px 12px;
  border-radius: 6px;
}

.menu-item:hover {
  color: #667eea;
}

/* Header样式 */
.header {
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
}

.header .logo {
  color: var(--text);
}

.header .btn {
  font-size: 15px;
  gap: 12px;
  color: var(--text);
}

/* 深色主题适配 - 已直接应用深色样式 */

/* 汉堡菜单按钮样式 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  gap: 4px;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--text);
  transition: all 0.3s ease;
  border-radius: 1px;
}

.mobile-menu-btn.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 移动端菜单样式 */
.mobile-menu {
  position: fixed;
  top: 60px; /* 匹配移动端header高度 */
  left: 0;
  right: 0;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  z-index: 999;
  animation: slideDown 0.3s ease-out;
}

/* 小屏幕移动端菜单位置调整 */
@media (max-width: 480px) {
  .mobile-menu {
    top: 56px; /* 匹配小屏幕header高度 */
  }
}

/* 超小屏幕移动端菜单位置调整 */
@media (max-width: 360px) {
  .mobile-menu {
    top: 52px; /* 匹配超小屏幕header高度 */
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-menu-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text);
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.01em;
}

.mobile-menu-item:hover {
  background: var(--brand-600);
}

.mobile-menu-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.mobile-menu-divider {
  height: 1px;
  background: var(--border);
  margin: 8px 0;
}

/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
  .header {
    margin-left: 0;
    margin-right: 0;
    padding-left: 30px;
    padding-right: 30px;
  }
  
  .nav {
    padding-left: 0; /* 移除nav的padding，使用header的30px */
    padding-right: 0;
    gap: 6px;
    height: 60px; /* 降低移动端header高度 */
  }
  
  .left {
    gap: 6px;
    margin-left: 0; /* 重置桌面端边距 */
  }
  
  .right {
    gap: 8px;
    margin-right: 0; /* 重置桌面端边距 */
    flex-wrap: nowrap; /* 防止换行 */
    align-items: center;
    justify-content: center; /* 改为center实现居中对齐 */
    min-width: 0; /* 允许收缩 */
    width: 100%;
    max-width: 200px;
  }
  
  /* 移动端按钮布局 - 居中对齐 */
  .right > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
  }
  
  /* Wallet按钮 - 左侧 */
  .wallet-connect-section,
  .wallet-dropdown-container {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* Profile按钮 - 中间 */
  .btn.light.pill {
    flex: 0 0 auto;
    margin: 0;
  }
  
  /* Settings按钮 - 右侧 */
  .settings-btn {
    flex: 0 0 auto;
    background:#94a3b8;
  }

  /* 语言切换按钮 - 桌面端 */
  .language-btn {
    flex: 0 0 auto;
    background: transparent !important;
    border: none !important;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
    min-width: 40px;
    padding: 6px 8px;
    transition: all 0.2s ease;
  }

  .language-btn:hover {
    background: var(--hover-bg) !important;
    border: none !important;
  }
  
  .brand-logo {
    height: 36px; /* 稍微缩小logo */
  }
  
  .menu {
    display: none; /* 在移动端隐藏完整菜单 */
  }
  
  .mobile-menu-btn {
    display: flex; /* 显示汉堡菜单按钮 */
    width: 32px;
    height: 32px;
  }
  
  
  .btn {
    padding: 4px 6px;
    font-size: 11px;
    white-space: nowrap; /* 防止文字换行 */
    flex-shrink: 0; /* 防止收缩 */
    min-width: auto;
  }
  
  .btn.pill {
    padding: 3px 6px;
  }
  
  /* Profile按钮样式 - 正方形 */
  .btn.light.pill {
    padding: 6px;
    font-size: 11px;
    border-radius: 6px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 28px;
  }
  
  /* Settings按钮样式 */
  .settings-btn {
    padding: 4px !important;
    flex-shrink: 0;
    width: 33px;
    height: 33px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .btn.pill span:last-child {
    display: inline; /* 移动端显示完整文字 */
  }
  
  .wallet-btn-wrapper {
    flex-direction: row; /* 保持水平布局 */
    min-width: auto;
    flex-shrink: 1; /* 允许收缩 */
    gap: 1px; /* 减少间距 */
  }
  
  .wallet-main-btn {
    padding: 3px 5px;
    font-size: 9px;
    white-space: nowrap; /* 防止文字换行 */
    flex-shrink: 1; /* 允许收缩 */
    min-width: auto;
  }
  
  /* 移动端钱包按钮只显示图标 */
  .wallet-address-text {
    display: none;
  }
  
  .wallet-icon-text {
    display: inline;
    font-size: 14px;
  }
  
  .wallet-dropdown-btn {
    padding: 3px 3px;
    flex-shrink: 0; /* 保持固定大小 */
    min-width: auto;
  }
  
  .wallet-divider {
    width: 1px;
    height: 14px;
    margin: 0 0px;
    flex-shrink: 0;
  }
  
  .dropdown-menu {
    right: 0;
    left: auto;
    min-width: 140px;
    top: 100%;
  }
  
  .wallet-dropdown-menu {
    right: 0;
    left: auto;
    min-width: 140px;
    top: 100%;
  }
  
  .dropdown-item {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .wallet-dropdown-item {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .dropdown-icon {
    font-size: 12px;
    width: 14px;
  }
  
  .wallet-dropdown-container {
    margin-left: 4px;
    margin-right: 4px;
  }
}

/* 平板端适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .menu {
    gap: 16px;
  }
  
  
  .btn {
    padding: 9px 14px;
  }
}

/* 小屏幕手机端 (小于480px) */
@media (max-width: 480px) {
  .header {
    margin-left: 0;
    margin-right: 0;
    padding-left: 30px;
    padding-right: 30px;
  }
  
  .nav {
    padding-left: 0; /* 移除nav的padding，使用header的30px */
    padding-right: 0;
    gap: 4px;
    height: 56px; /* 进一步降低高度 */
  }
  
  .left {
    gap: 4px;
  }
  
  .right {
    gap: 6px;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center; /* 改为center实现居中对齐 */
    min-width: 0;
    width: 100%;
    max-width: 180px;
  }
  
  /* 小屏幕按钮布局 - 居中对齐 */
  .right > div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
  }
  
  /* Wallet按钮 - 左侧 */
  .wallet-connect-section,
  .wallet-dropdown-container {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }
  
  /* Profile按钮 - 中间 */
  .btn.light.pill {
    flex: 0 0 auto;
    margin: 0 1px;
  }
  
  /* Settings按钮 - 右侧 */
  .settings-btn {
    flex: 0 0 auto;
  }
  
  .brand-logo {
    height: 32px; /* 更小的logo */
  }
  
  .mobile-menu-btn {
    width: 28px;
    height: 28px;
  }
  
  
  .btn {
    padding: 3px 4px;
    font-size: 10px;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: auto;
  }
  
  .btn.pill {
    padding: 2px 4px;
  }
  
  .btn.pill span:first-child {
    font-size: 12px;
  }
  
  /* Profile按钮样式 - 正方形 */
  .btn.light.pill {
    padding: 4px;
    font-size: 10px;
    border-radius: 4px;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
  }
  
  /* Settings按钮样式 */
  .settings-btn {
    padding: 3px !important;
    width: 29px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .wallet-main-btn {
    padding: 3px 4px;
    font-size: 9px;
  }
  
  /* 小屏移动端钱包按钮只显示图标 */
  .wallet-address-text {
    display: none;
  }
  
  .wallet-icon-text {
    display: inline;
    font-size: 12px;
  }
  
  .wallet-dropdown-btn {
    padding: 2px 2px;
    flex-shrink: 0;
    min-width: auto;
  }
  
  .wallet-divider {
    height: 12px;
    margin: 0 0px;
    flex-shrink: 0;
  }
  
  .dropdown-menu {
    min-width: 120px;
  }
  
  .wallet-dropdown-menu {
    min-width: 120px;
  }
  
  .dropdown-item {
    padding: 4px 6px;
    font-size: 11px;
  }
  
  .wallet-dropdown-item {
    padding: 4px 6px;
    font-size: 11px;
  }
  
  .wallet-dropdown-container {
    margin-left: 2px;
    margin-right: 2px;
  }
}

/* 超小屏幕 (小于360px) */
@media (max-width: 360px) {
  .header {
    margin-left: 0;
    margin-right: 0;
    padding-left: 30px;
    padding-right: 30px;
  }
  
  .nav {
    padding-left: 0; /* 移除nav的padding，使用header的30px */
    padding-right: 0;
    gap: 2px;
    height: 52px; /* 最小高度 */
  }
  
  .left {
    gap: 2px;
  }
  
  .right {
    gap: 0px;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between; /* 改为space-between实现左中右分布 */
    min-width: 0;
    width: 100%;
    max-width: 140px;
  }
  
  /* 超小屏幕按钮布局 - 左中右分布 */
  .right > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 0px;
  }
  
  /* Wallet按钮 - 左侧 */
  .wallet-connect-section,
  .wallet-dropdown-container {
    flex: 1;
    display: flex;
    justify-content: flex-start;
  }
  
  /* Profile按钮 - 中间 */
  .btn.light.pill {
    flex: 0 0 auto;
    margin: 0 1px;
  }
  
  /* Settings按钮 - 右侧 */
  .settings-btn {
    flex: 0 0 auto;
  }
  
  .brand-logo {
    height: 28px; /* 最小logo */
  }
  
  .mobile-menu-btn {
    width: 24px;
    height: 24px;
  }
  
  
  .btn {
    padding: 2px 3px;
    font-size: 9px;
    white-space: nowrap;
    flex-shrink: 0;
    min-width: auto;
  }
  
  .btn.pill {
    padding: 1px 3px;
  }
  
  /* Profile按钮样式 - 正方形 */
  .btn.light.pill {
    padding: 3px;
    font-size: 9px;
    border-radius: 3px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
  }
  
  /* Settings按钮样式 */
  .settings-btn {
    padding: 2px !important;
    width: 25px;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 语言切换按钮样式 */
  .language-btn {
    padding: 2px 4px !important;
    background: transparent !important;
    border: none !important;
    min-width: 30px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    background: transparent !important;
    border: none !important;
  }
  
  .wallet-main-btn {
    padding: 2px 3px;
    font-size: 8px;
  }
  
  /* 超小屏移动端钱包按钮只显示图标 */
  .wallet-address-text {
    display: none;
  }
  
  .wallet-icon-text {
    display: inline;
    font-size: 10px;
  }
  
  .wallet-dropdown-btn {
    padding: 1px 1px;
    flex-shrink: 0;
    min-width: auto;
  }
  
  .wallet-divider {
    height: 10px;
    margin: 0 0px;
    flex-shrink: 0;
  }
  
  .dropdown-menu {
    min-width: 100px;
  }
  
  .wallet-dropdown-menu {
    min-width: 100px;
  }
  
  .dropdown-item {
    padding: 3px 4px;
    font-size: 10px;
  }
  
  .wallet-dropdown-item {
    padding: 3px 4px;
    font-size: 10px;
  }
  
  .wallet-dropdown-container {
    margin-left: 1px;
    margin-right: 1px;
  }
}

/* 钱包弹窗响应式样式 */
@media (max-width: 768px) {
  .modal-container {
    min-width: 320px;
    max-width: 90vw;
    padding: 16px;
  }
  
}

@media (max-width: 480px) {
  .modal-container {
    min-width: 280px;
    max-width: 95vw;
    padding: 12px;
  }
  
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.modal-container {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  color: var(--text);
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.mm-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-secondary);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mm-btn:hover {
  background: var(--hover-bg);
}

.mm-btn.mm-outline {
  background: transparent;
  border-color: var(--text-secondary);
  color: var(--text-secondary);
}

.mm-btn.mm-outline:hover {
  background: var(--hover-bg);
  color: var(--text);
}

.mm-btn.mm-primary {
  background: #f97316;
  border-color: #f97316;
  color: #ffffff;
}

.mm-btn.mm-primary:hover {
  background: #ea580c;
  border-color: #ea580c;
}

.mm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}




/* Settings按钮样式 - 移除背景和边框 */
.settings-btn {
  background: transparent !important;
  border: none !important;
  color: var(--text);
  padding: 8px !important;
}

.settings-btn:hover {
  background: var(--hover-bg) !important;
  border: none !important;
}

.settings-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  transition: fill 0.2s ease;
}

/* 响应式 SVG 图标大小 */
@media (max-width: 768px) {
  .settings-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 640px) {
  .settings-icon {
    width: 16px;
    height: 16px;
  }
}

</style>