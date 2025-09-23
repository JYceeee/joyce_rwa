<template>
  <header class="header"> 
    <div class="container nav">
      <div class="left">
        <!-- 侧边栏触发按钮 -->
        <button 
          class="sidebar-toggle-btn" 
          @click="toggleSidebar"
          aria-label="Toggle sidebar"
        >
          <span class="sidebar-icon">☰</span>
        </button>
        
        <a class="brand" href="#" @click.prevent="go('/')">
          <img src="/icons/RWA-logo.jpg" alt="Mortgage RWA" class="brand-logo" />
        </a>
        <nav class="menu" aria-label="Primary">
          <a href="#" @click.prevent="go('/home')" class="menu-item">Home</a>
          <a href="#" @click.prevent="go('/projects')" class="menu-item">Projects</a>
          <a href="#" @click.prevent="go('/portfolio')" class="menu-item">Portfolio</a>
          <!-- <div class="dropdown-container">
            <a href="#" @click.prevent="toggleMoreDropdown" class="more-link">
              More ▾
            </a>
            <div v-if="moreDropdownOpen" class="dropdown-menu">
              <a href="#" @click.prevent="go('/about')" class="dropdown-item">
                <span class="dropdown-icon">🏢</span>
                <span>About Us</span>
              </a>
              <a href="#" @click.prevent="go('/vision')" class="dropdown-item">
                <span class="dropdown-icon">🎯</span>
                <span>Vision</span>
              </a>
              <a href="#" @click.prevent="go('/contact')" class="dropdown-item">
                <span class="dropdown-icon">📞</span>
                <span>Contact Us</span>
              </a>
              <a href="#" @click.prevent="go('/help')" class="dropdown-item">
                <span class="dropdown-icon">❓</span>
                <span>Help Center</span>
              </a>
            </div>
          </div>   -->
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
        <!-- Search -->
        <div class="search-wrapper">
          <form class="search-form" @submit.prevent="submitSearch">
            <input
              ref="searchInput"
              type="text"
              class="search-input"
              :class="{ expanded: searchOpen }"
              placeholder="Search..."
              v-model="searchText"
            />
            <button type="button" class="search-toggle" @click="toggleSearch">
              <img src="/icons/search-icon.png" alt="Search" />
            </button>
          </form>
        </div>
      
      <!-- User Auth Buttons -->
        <template v-if="isLoggedIn">
          <button class="btn orange pill" @click.prevent="goToWallet()">
            <span>🔗</span>
            <span>Wallet</span>
          </button>
          <button class="btn light pill" @click.prevent="goToProfile()">
            <span>👤</span>
            <span>Profile</span>
          </button>
        </template>
        <template v-else>
          <a class="btn ghost" href="#" @click.prevent="go('/login')">Log in</a>
          <a class="btn orange" href="#" @click.prevent="go('/signup')">Sign up</a>
        </template>
      </div>
    </div>
    
    <!-- 移动端菜单 -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-content">
        <a href="#" @click.prevent="go('/home')" class="mobile-menu-item">
          <span class="mobile-menu-icon">🏠</span>
          <span>Home</span>
        </a>
        <a href="#" @click.prevent="go('/projects')" class="mobile-menu-item">
          <span class="mobile-menu-icon">📊</span>
          <span>Projects</span>
        </a>
        <a href="#" @click.prevent="go('/portfolio')" class="mobile-menu-item">
          <span class="mobile-menu-icon">💼</span>
          <span>Portfolio</span>
        </a>
        <!-- <div class="mobile-menu-divider"></div>
        <a href="#" @click.prevent="go('/about')" class="mobile-menu-item">
          <span class="mobile-menu-icon">🏢</span>
          <span>About Us</span>
        </a>
        <a href="#" @click.prevent="go('/vision')" class="mobile-menu-item">
          <span class="mobile-menu-icon">🎯</span>
          <span>Vision</span> 
        </a>
        <a href="#" @click.prevent="go('/contact')" class="mobile-menu-item">
          <span class="mobile-menu-icon">📞</span>
          <span>Contact Us</span>
        </a>
        <a href="#" @click.prevent="go('/help')" class="mobile-menu-item">
          <span class="mobile-menu-icon">❓</span>
          <span>Help Center</span>
        </a> -->
      </div>
    </div>
    
    <!-- 侧边栏组件 -->
    <SlideNavigation :isOpen="sidebarOpen" @close="closeSidebar" />
  </header>
</template>

<script>
import { isLoggedIn, clearAuth, AUTH_CHANGED_EVENT } from '@/utils/auth';
import SlideNavigation from './SlideNavigation.vue';

export default {
  name: 'AppHeader',
  components: {
    SlideNavigation
  },
  props: {},
  data(){
    return { 
      searchOpen: false, 
      searchText: '', 
      isLoggedIn: false,
      moreDropdownOpen: false,
      mobileMenuOpen: false,
      sidebarOpen: false
    }
  },

  methods: {
    noop(){},
    go(path){
      this.$router.push(path);
      this.closeSearch();
      this.closeMoreDropdown();
      this.closeMobileMenu();
      // 注意：不自动关闭侧边栏，只有点击☰按钮才关闭
    },
    toggleMoreDropdown(){
      this.moreDropdownOpen = !this.moreDropdownOpen;
      this.closeSearch();
      this.closeMobileMenu();
      // 注意：不自动关闭侧边栏
    },
    closeMoreDropdown(){
      this.moreDropdownOpen = false;
    },
    toggleMobileMenu(){
      this.mobileMenuOpen = !this.mobileMenuOpen;
      this.closeSearch();
      this.closeMoreDropdown();
      // 注意：不自动关闭侧边栏
    },
    closeMobileMenu(){
      this.mobileMenuOpen = false;
    },
    toggleSidebar(){
      this.sidebarOpen = !this.sidebarOpen;
      this.updateBodyClass();
      // 注意：只切换侧边栏状态，不关闭其他菜单
    },
    closeSidebar(){
      this.sidebarOpen = false;
      this.updateBodyClass();
    },
    updateBodyClass(){
      if (this.sidebarOpen) {
        document.body.classList.add('sidebar-open');
      } else {
        document.body.classList.remove('sidebar-open');
      }
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

    toggleSearch(){
      this.searchOpen = !this.searchOpen
      this.$nextTick(()=>{ if(this.searchOpen && this.$refs.searchInput) this.$refs.searchInput.focus() })
    },
    closeSearch(){
      this.searchOpen = false
      this.searchText = ''
    },
    submitSearch(){
      this.$emit('search', this.searchText)
    },
    onDocClick(e){
      const input = this.$refs.searchInput
      const btn = this.$el.querySelector('.search-toggle')
      const dropdown = this.$el.querySelector('.dropdown-container')
      const mobileMenuBtn = this.$el.querySelector('.mobile-menu-btn')
      const mobileMenu = this.$el.querySelector('.mobile-menu')
      
      // 处理搜索框点击外部关闭
      if(input && this.searchOpen && !input.contains(e.target) && !btn.contains(e.target)){
        this.closeSearch()
      }
      
      // 处理dropdown点击外部关闭
      if(dropdown && this.moreDropdownOpen && !dropdown.contains(e.target)){
        this.closeMoreDropdown()
      }
      
      // 处理移动端菜单点击外部关闭
      if(mobileMenu && this.mobileMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)){
        this.closeMobileMenu()
      }
      
      // 注意：侧边栏只能通过点击☰按钮关闭，不处理点击外部关闭
    },
    async connectWallet() {
      if (typeof window.ethereum !== "undefined") {
        try {
          // 请求用户授权
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          this.account = accounts[0];
          console.log("钱包已连接：", this.account);
        } catch (error) {
          console.error("连接失败", error);
        } 
      } else {
        alert("请先安装 MetaMask 插件！");
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
    // 清理body class
    document.body.classList.remove('sidebar-open');
  }
}
</script>

<style scoped>
.icon-btn {
  margin-right: 10px;
  border: none;
  background: transparent;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.icon-btn:focus { outline: 2px solid #94a3b8; outline-offset: 2px; }

/* Dropdown样式 */
.dropdown-container {
  position: relative;
  display: inline-block;
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
  min-width: 200px;
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

.dropdown-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
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
  top: 64px;
  left: 0;
  right: 0;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  z-index: 999;
  animation: slideDown 0.3s ease-out;
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
  .nav {
    padding: 0 16px;
    gap: 12px;
  }
  
  .left {
    gap: 12px;
  }
  
  .brand-logo {
    height: 28px;
  }
  
  .menu {
    display: none; /* 在移动端隐藏完整菜单 */
  }
  
  .mobile-menu-btn {
    display: flex; /* 显示汉堡菜单按钮 */
  }
  
  .right {
    gap: 8px;
  }
  
  .search-input.expanded {
    width: 120px; /* 移动端搜索框更窄 */
  }
  
  .btn {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  .btn.pill {
    padding: 6px 10px;
  }
  
  .btn.pill span:last-child {
    display: none; /* 移动端只显示图标 */
  }
  
  .dropdown-menu {
    right: 0;
    left: auto;
    min-width: 180px;
  }
  
  .dropdown-item {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .dropdown-icon {
    font-size: 14px;
    width: 18px;
  }
}

/* 平板端适配 */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav {
    padding: 0 20px;
  }
  
  .menu {
    gap: 16px;
  }
  
  .search-input.expanded {
    width: 150px;
  }
  
  .btn {
    padding: 9px 14px;
  }
}

/* 小屏幕手机端 (小于480px) */
@media (max-width: 480px) {
  .nav {
    padding: 0 12px;
    gap: 8px;
  }
  
  .brand-logo {
    height: 24px;
  }
  
  .search-input.expanded {
    width: 100px;
  }
  
  .btn {
    padding: 6px 8px;
    font-size: 12px;
  }
  
  .btn.pill span:first-child {
    font-size: 16px;
  }
  
  .dropdown-menu {
    min-width: 160px;
  }
  
  .dropdown-item {
    padding: 8px 10px;
    font-size: 13px;
  }
}

/* 超小屏幕 (小于360px) */
@media (max-width: 360px) {
  .nav {
    padding: 0 8px;
  }
  
  .brand-logo {
    height: 20px;
  }
  
  .search-input.expanded {
    width: 80px;
  }
  
  .btn {
    padding: 4px 6px;
    font-size: 11px;
  }
  
  .dropdown-menu {
    min-width: 140px;
  }
}

/* 侧边栏触发按钮样式 */
.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-right: 12px;
}

.sidebar-toggle-btn:hover {
  background: var(--brand-600, rgba(255, 165, 0, 0.1));
}

.sidebar-icon {
  font-size: 20px;
  color: var(--text, #ffffff);
  line-height: 1;
}

</style>