import { createRouter, createWebHistory } from 'vue-router'
// Core pages
import HomeView from '../views/core/HomeView.vue'
import WalletView from '../views/core/WalletView.vue'
import PortfolioView from '../views/core/PortfolioView.vue'
import ListedProjectsView from '../views/core/ListedProjectsView.vue'
import ToBeListedView from '../views/core/ToBeListedView.vue'
import ProfileView from '../views/core/ProfileView.vue'
import TradeProjectView from '../views/core/TradeProjectView.vue'
import TokenDetailView from '../views/core/TokenDetailView.vue'
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'
import AboutUsView from '../views/info/aboutus/AboutUsView.vue'
import SettingsView from '../views/settings/SettingsView.vue'
import kycService from '../components/kycService.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home'},
    { path: '/home', name: 'home', component: HomeView },
    { path: '/wallet', name: 'wallet', component: WalletView },
    { path: '/portfolio', name: 'portfolio', component: PortfolioView },
    { path: '/listedprojects', name: 'listedprojects', component: ListedProjectsView },
    { path: '/listedprojects/:code', name: 'listedProjectDetail', component: ListedProjectsView, props: true },
    { path: '/to-be-listed', name: 'toBeListed', component: ToBeListedView },
    { path: '/to-be-listed/:code', name: 'toBeListedDetail', component: ToBeListedView, props: true },
    { path: '/token/:address', name: 'tokenDetail', component: TokenDetailView, props: true },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/trade/:code', name: 'tradeProject', component: TradeProjectView, props: true },
    { path: '/kycService', component: kycService },
    { path: '/about', name: 'about', component: AboutUsView },
    {path:'/settings',name:'settings',component:SettingsView},
  ]
})

export default router