import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WalletView from '../views/WalletView.vue'
import PortfolioView from '../views/PortfolioView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import DetailPage from '../views/DetailPage.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'
// import EmailVerifyView from '../views/EmailVerifyView.vue'
import kycService from '../components/kycService.vue'
import BuySellView from '../views/BuySellView.vue'
import SwapView from '../views/SwapView.vue'
import BridgeView from '../views/BridgeView.vue'
import SendView from '../views/SendView.vue'
import ReceiveView from '../views/ReceiveView.vue'
import TokenDetailView from '../views/TokenDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home'},
    { path: '/home', name: 'home', component: HomeView },
    { path: '/wallet', name: 'wallet', component: WalletView },
    { path: '/portfolio', name: 'portfolio', component: PortfolioView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/detail/:code?', name: 'detail', component: DetailPage, props: true },
    { path: '/buy-sell', name: 'buySell', component: BuySellView },
    { path: '/swap', name: 'swap', component: SwapView },
    { path: '/bridge', name: 'bridge', component: BridgeView },
    { path: '/send', name: 'send', component: SendView },
    { path: '/receive', name: 'receive', component: ReceiveView },
    { path: '/token/:address', name: 'tokenDetail', component: TokenDetailView, props: true },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/login', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView },
  // { path: '/email-verify', name: 'emailVerify', component: EmailVerifyView },
    { path: '/kycService', component: kycService },
  ],
})

export default router