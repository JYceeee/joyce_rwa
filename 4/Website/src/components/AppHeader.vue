<template>
  <!-- 连接新钱包弹窗 -->
  <div v-if="showLinkWalletModal" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">Link New Wallet</h2>
        <p style="color:#ffffff;">Select a MetaMask account to link to your profile:</p>
        
        <!-- 账户选择列表 - 图片样式 -->
        <div v-if="availableAccounts.length > 0" class="account-grid">
          <div 
            v-for="(account, index) in availableAccounts" 
            :key="account"
            class="account-card"
            :class="{ selected: selectedAccountIndex === index }"
            @click="selectAccount(index)"
          >
            <!-- 钱包头像 -->
            <div class="wallet-avatar">
              <img 
                :src="generateWalletAvatar(account)" 
                :alt="`Wallet ${index + 1}`"
                class="avatar-image"
              />
              <div class="avatar-overlay">
                <span class="avatar-icon">🦊</span>
              </div>
            </div>
            
            <!-- 账户信息 -->
            <div class="account-details">
              <div class="account-name">Account {{ index + 1 }}</div>
              <div class="account-address">{{ formatAddress(account) }}</div>
              <div class="account-balance" v-if="accountBalances[account]">
                {{ accountBalances[account] }} ETH
              </div>
              <div class="account-balance" v-else>
                Loading...
              </div>
            </div>
            
            <!-- 选择状态指示器 -->
            <div v-if="selectedAccountIndex === index" class="selection-indicator">
              <div class="checkmark">✓</div>
            </div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div v-if="loadingAccounts" class="loading-accounts">
          <div class="loading-spinner"></div>
          <span>Loading accounts...</span>
        </div>
        
        <!-- 无账户状态 -->
        <div v-if="!loadingAccounts && availableAccounts.length === 0" class="no-accounts">
          <p>No additional accounts found in MetaMask.</p>
          <p>Please add more accounts in MetaMask and try again.</p>
        </div>
        
        <div style="text-align:right;margin-top:20px;">
          <button class="mm-btn mm-outline" @click="showLinkWalletModal=false">Cancel</button>
          <button 
            v-if="availableAccounts.length > 0" 
            class="mm-btn mm-primary" 
            style="margin-left:8px;" 
            @click="linkSelectedAccount"
            :disabled="selectedAccountIndex === -1"
          >
            Link Selected Account
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 解绑账号弹窗 -->
  <div v-if="showDisconnectModal" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">Disconnect Wallet</h2>
        <p style="color:#ffffff;">Are you sure you want to disconnect this wallet?</p>
        <div>
          <span style="display:block;font-size:15px;padding:8px 0;color:#ffffff;background:#2a2a4a;border-radius:8px;">{{ fullAddress }}</span>
        </div>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showDisconnectModal=false">Cancel</button>
          <button class="mm-btn mm-outline" style="margin-left:8px;" @click="confirmDisconnect">Confirm</button>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 解绑成功弹窗 -->
  <div v-if="showDisconnectSuccess" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <h2 style="margin-bottom:8px;color:#ffffff;">Wallet Disconnected</h2>
        <p style="color:#ffffff;">{{ disconnectSuccessMsg }}</p>
        <div style="text-align:right;">
          <button class="mm-btn mm-outline" @click="showDisconnectSuccess=false">Confirm</button>
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
          <a href="#" @click.prevent="go('/about')" class="menu-item">关于我们</a>
          <a href="#" @click.prevent="go('/listedprojects')" class="menu-item">已上链RWA</a>
          <a href="#" @click.prevent="go('/to-be-listed')" class="menu-item">待上链RWA</a>
          <a href="#" @click.prevent="goToContactUs" class="menu-item">联系我们</a>
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
              <span>连接钱包</span>
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
            <div v-if="walletDropdownOpen" class="wallet-dropdown-menu">
              <div class="wallet-dropdown-header">钱包管理</div>
              <a href="#" @click.prevent="showLinkWalletModal = true; walletDropdownOpen = false" class="wallet-dropdown-item">
                <span>连接新钱包</span>
              </a>
              <a href="#" @click.prevent="showDisconnectModal = true; walletDropdownOpen = false" class="wallet-dropdown-item">
                <span>断开钱包</span>
              </a>
            </div>
          </div>
          <button class="btn light pill" @click.prevent="goToProfile()">
            <span>👤</span>
          </button>
          <button class="btn ghost pill settings-btn" @click.prevent="go('/settings')">⚙️</button>
        </div>
        <div v-else>
          <a class="btn ghost" href="#" @click.prevent="go('/login')">登录</a>
          <a class="btn orange" href="#" @click.prevent="go('/signup')">注册</a>
        </div>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-content">
        <a href="#" @click.prevent="go('/home')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">🏠</span> -->
          <span>Home</span>
        </a>
        <a href="#" @click.prevent="go('/about')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">🏢</span> -->
          <span>About Us</span>
        </a>
        <a href="#" @click.prevent="go('/listedprojects')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">📊</span> -->
          <span>Listed RWA</span>
        </a>
        <a href="#" @click.prevent="go('/to-be-listed')" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">⏳</span> -->
          <span>To be listed RWA</span>
        </a>
        <a href="#" @click.prevent="goToContactUs" class="mobile-menu-item">
          <!-- <span class="mobile-menu-icon">📞</span> -->
          <span>Contact Us</span>
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

export default {
  name: 'AppHeader',
  props: {},
  setup() {
    const { connected, fullAddress, shortAddress, connect, disconnect } = useWallet()
    
    return {
      connected,
      fullAddress,
      shortAddress,
      connect,
      disconnect
    }
  },
  data(){
    return { 
      isLoggedIn: false,
      moreDropdownOpen: false,
      mobileMenuOpen: false,
      walletDropdownOpen: false,
      showLinkWalletModal: false,
      showDisconnectModal: false,
      showDisconnectSuccess: false,
      disconnectSuccessMsg: '',
      availableAccounts: [],
      selectedAccountIndex: -1,
      loadingAccounts: false,
      accountBalances: {}
    }
  },

  methods: {
    noop(){},
    go(path){
      this.$router.push(path);
      this.closeMoreDropdown();
      this.closeMobileMenu();
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
    linkNewWallet() {
      this.hideWalletDropdown();
      // 实现连接新钱包的逻辑
      this.connectWallet();
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
          alert(`钱包地址 ${address} 已添加`);
          // 触发钱包更新事件
          this.$emit('wallet-added', address);
        } else {
          alert('该钱包地址已存在');
        }
      } else {
        alert('请输入有效的以太坊地址');
      }
    },
    setPrimaryWallet() {
      this.hideWalletDropdown();
      // 获取已连接的钱包列表
      const linkedWallets = JSON.parse(localStorage.getItem('linkedWallets') || '[]');
      const currentWallet = localStorage.getItem('walletAddress');
      
      if (linkedWallets.length === 0) {
        alert('没有可设置的钱包地址');
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
        alert(`主钱包已设置为: ${selectedWallet}`);
        this.$emit('primary-wallet-changed', selectedWallet);
      } else if (choice !== null) {
        alert('无效的选择');
      }
    },
    // 显示连接新钱包弹窗
    async linkNewWallet() {
      this.hideWalletDropdown();
      this.showLinkWalletModal = true;
      await this.loadAvailableAccounts();
    },
    
    // 加载可用的账户
    async loadAvailableAccounts() {
      this.loadingAccounts = true;
      this.availableAccounts = [];
      this.selectedAccountIndex = -1;
      this.accountBalances = {};
      
      try {
        if (typeof window.ethereum !== "undefined") {
          // 获取所有账户
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          
          // 过滤掉当前已连接的账户
          const currentAddress = this.fullAddress;
          this.availableAccounts = accounts.filter(account => 
            account.toLowerCase() !== currentAddress.toLowerCase()
          );
          
          console.log("Available accounts:", this.availableAccounts);
          
          // 获取每个账户的余额
          await this.loadAccountBalances();
          
        } else {
          console.error("MetaMask not detected");
        }
      } catch (error) {
        console.error("Failed to load accounts:", error);
      } finally {
        this.loadingAccounts = false;
      }
    },
    
    // 获取账户余额
    async loadAccountBalances() {
      for (const account of this.availableAccounts) {
        try {
          const balance = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
          });
          
          // 转换wei到ETH
          const balanceInEth = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
          this.accountBalances[account] = balanceInEth;
          
          // 触发响应式更新
          this.$forceUpdate();
        } catch (error) {
          console.error(`Failed to get balance for ${account}:`, error);
          this.accountBalances[account] = 'Error';
        }
      }
    },
    
    // 生成钱包头像
    generateWalletAvatar(address) {
      // 使用钱包地址生成确定性的头像
      // 这里使用一个简单的SVG生成器，基于地址的前几个字符
      const hash = this.simpleHash(address);
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
      ];
      const bgColor = colors[hash % colors.length];
      const textColor = '#FFFFFF';
      
      // 生成SVG头像
      const svg = `
        <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="80" fill="${bgColor}" rx="40"/>
          <text x="40" y="45" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
                text-anchor="middle" fill="${textColor}">
            ${address.slice(2, 4).toUpperCase()}
          </text>
        </svg>
      `;
      
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    },
    
    // 简单哈希函数
    simpleHash(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    },
    
    // 选择账户
    selectAccount(index) {
      this.selectedAccountIndex = index;
    },
    
    // 格式化地址显示
    formatAddress(address) {
      if (!address) return '';
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    },
    
    // 连接选中的账户
    async linkSelectedAccount() {
      if (this.selectedAccountIndex === -1) return;
      
      try {
        const selectedAccount = this.availableAccounts[this.selectedAccountIndex];
        
        // 请求切换到选中的账户
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{
            eth_accounts: {}
          }]
        });
        
        // 触发账户切换
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        this.showLinkWalletModal = false;
        console.log("Account switched successfully to:", selectedAccount);
        
        // 显示成功消息
        alert(`Successfully linked account: ${this.formatAddress(selectedAccount)}`);
        
      } catch (error) {
        console.error("Failed to link account:", error);
        if (error.code === 4001) {
          alert("User rejected the account switch request.");
        } else {
          alert("Failed to link account. Please try again.");
        }
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
        this.disconnectSuccessMsg = "Wallet has been disconnected successfully.";
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
      
      alert(`钱包 ${walletAddress} 已断开连接`);
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

/* 钱包下拉菜单样式 */
.wallet-dropdown-container {
  position: relative;
  display: inline-block;
}

.wallet-btn-wrapper {
  display: flex;
  align-items: center;
  background: #f97316;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid transparent;
}

.wallet-main-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

/* 钱包地址和图标显示控制 */
.wallet-address-text {
  display: inline;
}

.wallet-icon-text {
  display: none;
}

.wallet-main-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.wallet-divider {
  width: 1px;
  height: 16px;
  background: white;
  opacity: 0.3;
  flex-shrink: 0;
}

.wallet-dropdown-btn {
  background: transparent;
  border: none;
  color: white;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wallet-dropdown-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-arrow {
  font-size: 20px;
  transition: transform 0.2s ease;
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
  color: #ffffff;
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
/* Header右侧按钮样式 */
.header .btn {
  font-size: 15px;
  gap: 2px;

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
  background: var(--bg);
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
    gap: 1px;
    margin-right: 0; /* 重置桌面端边距 */
    flex-wrap: nowrap; /* 防止换行 */
    align-items: center;
    justify-content: space-between; /* 改为space-between实现左中右分布 */
    min-width: 0; /* 允许收缩 */
    width: 100%;
    max-width: 180px;
  }
  
  /* 移动端按钮布局 - 左中右分布 */
  .right > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 2px;
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
    margin: 0 2px;
  }
  
  /* Settings按钮 - 右侧 */
  .settings-btn {
    flex: 0 0 auto;
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
    font-size: 16px !important;
    padding: 4px !important;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
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
    gap: 0px;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between; /* 改为space-between实现左中右分布 */
    min-width: 0;
    width: 100%;
    max-width: 160px;
  }
  
  /* 小屏幕按钮布局 - 左中右分布 */
  .right > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 1px;
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
    font-size: 14px !important;
    padding: 3px !important;
    width: 24px;
    height: 24px;
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
    font-size: 12px !important;
    padding: 2px !important;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
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
  
  .account-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    max-height: 300px;
  }
  
  .account-card {
    padding: 16px;
    min-height: 140px;
  }
  
  .wallet-avatar {
    width: 60px;
    height: 60px;
    margin-bottom: 8px;
  }
  
  .avatar-image {
    width: 60px;
    height: 60px;
  }
  
  .avatar-overlay {
    width: 20px;
    height: 20px;
  }
  
  .avatar-icon {
    font-size: 10px;
  }
  
  .account-name {
    font-size: 14px;
  }
  
  .account-address {
    font-size: 11px;
  }
  
  .account-balance {
    font-size: 12px;
  }
  
  .selection-indicator {
    width: 20px;
    height: 20px;
    top: 8px;
    right: 8px;
  }
  
  .checkmark {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .modal-container {
    min-width: 280px;
    max-width: 95vw;
    padding: 12px;
  }
  
  .account-grid {
    gap: 8px;
    max-height: 250px;
  }
  
  .account-card {
    padding: 12px;
    min-height: 120px;
  }
  
  .wallet-avatar {
    width: 50px;
    height: 50px;
    margin-bottom: 6px;
  }
  
  .avatar-image {
    width: 50px;
    height: 50px;
  }
  
  .avatar-overlay {
    width: 16px;
    height: 16px;
  }
  
  .avatar-icon {
    font-size: 8px;
  }
  
  .account-name {
    font-size: 12px;
  }
  
  .account-address {
    font-size: 10px;
  }
  
  .account-balance {
    font-size: 11px;
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
  background: #1a1a2e;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.mm-btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid #374151;
  background: #1f2937;
  color: #ffffff;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.mm-btn:hover {
  background: #374151;
}

.mm-btn.mm-outline {
  background: transparent;
  border-color: #6b7280;
  color: #9ca3af;
}

.mm-btn.mm-outline:hover {
  background: #374151;
  color: #ffffff;
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

/* 账户网格样式 - 图片卡片形式 */
.account-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin: 16px 0;
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.account-card {
  position: relative;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border: 2px solid #374151;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.account-card:hover {
  border-color: #f97316;
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.2);
}

.account-card.selected {
  border-color: #f97316;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

/* 钱包头像样式 */
.wallet-avatar {
  position: relative;
  margin-bottom: 12px;
  width: 80px;
  height: 80px;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.account-card:hover .avatar-image {
  border-color: #f97316;
  transform: scale(1.1);
}

.account-card.selected .avatar-image {
  border-color: #ffffff;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.avatar-overlay {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 28px;
  height: 28px;
  background: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #1f2937;
}

.avatar-icon {
  font-size: 14px;
}

/* 账户详情样式 */
.account-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.account-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 4px;
}

.account-address {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
  word-break: break-all;
}

.account-balance {
  font-size: 14px;
  color: #10b981;
  font-weight: 600;
  margin-top: 4px;
}

/* 选择状态指示器 */
.selection-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s infinite;
}

.checkmark {
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

/* 加载状态样式 */
.loading-accounts {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: #9ca3af;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #374151;
  border-top: 2px solid #f97316;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 无账户状态样式 */
.no-accounts {
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
}

.no-accounts p {
  margin: 8px 0;
  font-size: 14px;
}

/* Settings按钮样式 - 移除背景和边框 */
.settings-btn {
  font-size:22px;
  background: transparent !important;
  border: none !important;
  padding: 8px !important;
}

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border: none !important;
}

</style>