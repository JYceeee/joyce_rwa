<!-- src/App.vue -->
<template>
  <div id="app">
    <AppHeader @search="handleSearch" />
    <main class="page-wrap">
      <router-view />
    </main>
  <AppFooter v-if="!isAuthPage" />
  </div>
</template>


<script>
import AppHeader from './components/AppHeader.vue'
import HomeView from './views/HomeView.vue'
import ProjectsView from './views/ProjectsView.vue'
import PortfolioView from './views/PortfolioView.vue'
// import LoginView from './views/LoginView.vue'
import SignupView from './views/SignupView.vue'
import ProfileView from './views/ProfileView.vue'
import WalletView from './views/WalletView.vue'
import kycService from './components/kycService.vue'
import AppFooter from './components/AppFooter.vue'
import DetailPage from './views/DetailPage.vue'

export default {
  name: 'App',
  components: { 
    AppHeader, 
    AppFooter, 
    HomeView, 
    ProjectsView, 
    // LoginView, 
    SignupView, 
    ProfileView, 
    WalletView, 
    PortfolioView, 
    kycService, 
    DetailPage 
  },
  data(){
    return { 
      user: null
    }
  },
  computed: {
    isAuthPage() {
      const path = this.$route.path;
      return path === '/login' || path === '/signup';
    }
  },
  methods: {
    alertMsg(msg){ alert(msg) },
    handleSearch(q){
      const v = (q || '').toLowerCase().trim()
      if(!v) return
      if(v.includes('project')) this.$router.push({ name: 'projects' })
      else if(v.includes('login')) this.$router.push({ name: 'login' })
      else if(v.includes('signup') || v.includes('register')) this.$router.push({ name: 'signup' })
      else alert('No matching page found.')
    }
  }
}
</script>
