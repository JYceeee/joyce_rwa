import { createRouter, createWebHistory } from 'vue-router'
// Core pages
import HomeView from '../views/core/HomeView.vue'
import WalletView from '../views/core/WalletView.vue'
import PortfolioView from '../views/core/PortfolioView.vue'
import ProjectsView from '../views/core/ProjectsView.vue'
import DetailPage from '../views/core/DetailPage.vue'
import ProfileView from '../views/core/ProfileView.vue'
import TradeProjectView from '../views/core/TradeProjectView.vue'
import BridgeView from '../views/core/BridgeView.vue'
import SendView from '../views/core/SendView.vue'
import SwapView from '../views/core/SwapView.vue'
import TokenDetailView from '../views/core/TokenDetailView.vue'
// Auth pages
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'
// Info pages
import OverviewView from '../views/info/OverviewView.vue'
import FeaturesView from '../views/info/FeaturesView.vue'
import SolutionsView from '../views/info/SolutionsView.vue'
import TutorialsView from '../views/info/TutorialsView.vue'
import PricingView from '../views/info/PricingView.vue'
import AboutUsView from '../views/info/AboutUsView.vue'
import ContactView from '../views/info/ContactView.vue'
import OptionsView from '../views/info/OptionsView.vue'
import SettingsView from '../views/info/SettingsView.vue'
// Other components
import kycService from '../components/kycService.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home'},
    { path: '/home', name: 'home', component: HomeView },
    { path: '/wallet', name: 'wallet', component: WalletView },
    { path: '/portfolio', name: 'portfolio', component: PortfolioView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    { path: '/detail/:code?', name: 'detail', component: DetailPage, props: true },
    { path: '/swap', name: 'swap', component: SwapView },
    { path: '/bridge', name: 'bridge', component: BridgeView },
    { path: '/send', name: 'send', component: SendView },
    { path: '/token/:address', name: 'tokenDetail', component: TokenDetailView, props: true },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/trade/:code', name: 'tradeProject', component: TradeProjectView, props: true },
    // { path: '/email-verify', name: 'emailVerify', component: EmailVerifyView },
    { path: '/kycService', component: kycService },
    // Footer pages
    { path: '/overview', name: 'overview', component: OverviewView },
    { path: '/features', name: 'features', component: FeaturesView },
    { path: '/solutions', name: 'solutions', component: SolutionsView },
    { path: '/tutorials', name: 'tutorials', component: TutorialsView },
    { path: '/pricing', name: 'pricing', component: PricingView },
    { path: '/about', name: 'about', component: AboutUsView },
    { path: '/contact', name: 'contact', component: ContactView },
    // Placeholder routes for other footer links
    { path: '/releases', name: 'releases', component: OverviewView },
    { path: '/careers', name: 'careers', component: OverviewView },
    { path: '/press', name: 'press', component: OverviewView },
    { path: '/news', name: 'news', component: OverviewView },
    { path: '/media-kit', name: 'media-kit', component: OverviewView },
    { path: '/blog', name: 'blog', component: OverviewView },
    { path: '/newsletter', name: 'newsletter', component: OverviewView },
    { path: '/events', name: 'events', component: OverviewView },
    { path: '/help', name: 'help', component: OverviewView },
    { path: '/support', name: 'support', component: ContactView },
    { path: '/terms', name: 'terms', component: OverviewView },
    { path: '/privacy', name: 'privacy', component: OverviewView },
    { path: '/cookies', name: 'cookies', component: OverviewView },
    { path: '/licenses', name: 'licenses', component: OverviewView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/options', name: 'options', component: OptionsView },
  ],
})

export default router