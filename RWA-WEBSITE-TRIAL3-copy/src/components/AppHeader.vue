<template>
  <header class="header"> 
    <div class="container nav">
      <div class="left">
        <a class="brand" href="#" @click.prevent="go('/')">
          <img src="/icons/RWA-logo.png" alt="Mortgage RWA" class="brand-logo" />
        </a>
        <nav class="menu" aria-label="Primary">
          <a href="#" @click.prevent="go('/home')">Home</a>
          <a href="#" @click.prevent="go('/projects')">Projects</a>
          <a href="#" @click.prevent="go('/portfolio')">Portfolio</a>
          <a href="#" @click.prevent="noop">More ▾</a>
        </nav>
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
              <!-- <img src="/icons/search-icon.png" alt="Search" /> -->
            🔍</button>
          </form>
        </div>
      
      <!-- User Auth Buttons -->
        <template v-if="isLoggedIn">
          <button class="btn orange pill" @click.prevent="go('/wallet')">
            <img class="btn-icon" src="/icons/login-wallet-icon.png" alt="" />
            <span>Wallet</span>
          </button>
          <button class="btn light pill" @click.prevent="go('/profile')">
            <img class="btn-icon" src="/icons/user.png" alt="" />
          Profile</button>
        </template>
        <template v-else>
          <a class="btn ghost" href="#" @click.prevent="go('/login')">Log in</a>
          <a class="btn orange" href="#" @click.prevent="go('/signup')">Sign up</a>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
import { isLoggedIn, clearAuth, AUTH_CHANGED_EVENT } from '@/utils/auth';
export default {
  name: 'AppHeader',
  props: {},
  data(){
    return { searchOpen: false, searchText: '', isLoggedIn: false }
  },
//  created() {
//     // 页面首次进来，同步一次登录态 + 恢复全局 Authorization 头
//     this.refreshAuth();
//   },
//   watch: {
//     // 每次路由切换时，重读 localStorage，做到“无刷新切换”
//     $route() {
//       this.refreshAuth();
//     }
//   },
  methods: {
    noop(){},
    go(path){
      this.$router.push(path);
      this.closeSearch();
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
      if(!input) return
      if(this.searchOpen && !input.contains(e.target) && !btn.contains(e.target)){
        this.closeSearch()
      }
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
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.icon-btn:focus { outline: 2px solid #94a3b8; outline-offset: 2px; }
</style>