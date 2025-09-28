import { createRouter, createWebHistory } from 'vue-router'
// Core pages
import HomeView from '../views/core/HomeView.vue'
import WalletView from '../views/core/WalletView.vue'
import PortfolioView from '../views/core/PortfolioView.vue'
import ProjectsView from '../views/core/ProjectsView.vue'
import DetailPage from '../views/core/DetailPage.vue'
import ProfileView from '../views/core/ProfileView.vue'
import TradeProjectView from '../views/core/TradeProjectView.vue'
import ContractView from '../views/core/contract.vue'
import BridgeView from '../views/FunctionalModule/otherinteractbutton/BridgeView.vue'
import SendView from '../views/FunctionalModule/otherinteractbutton/SendView.vue'
import SwapView from '../views/FunctionalModule/otherinteractbutton/SwapView.vue'
import TokenDetailView from '../views/core/TokenDetailView.vue'
// Auth pages
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'
// Info pages
import OverviewView from '../views/info/aboutus/OverviewView.vue'
import SolutionsView from '../views/info/aboutus/SolutionsView.vue'
import TutorialsView from '../views/info/aboutus/TutorialsView.vue'
import PricingView from '../views/info/aboutus/PricingView.vue'
import AboutUsView from '../views/info/aboutus/AboutUsView.vue'
import ContactView from '../views/info/aboutus/ContactView.vue'
import TermView from '../views/info/aboutus/Term.vue'
import PrivacyPolicyView from '../views/info/aboutus/PrivacyPolicy.vue'
import FAQView from '../views/info/FAQView.vue'
import SettingsView from '../views/settings/SettingsView.vue'
// Test pages
import ContractTestView from '../views/test/ContractTestView.vue'
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
    { path: '/projects/:code', name: 'projectDetail', component: ProjectsView, props: true },
    { path: '/detail/:id?', name: 'detail', component: DetailPage, props: true },
    { path: '/swap', name: 'swap', component: SwapView },
    { path: '/bridge', name: 'bridge', component: BridgeView },
    { path: '/send', name: 'send', component: SendView },
    { path: '/token/:address', name: 'tokenDetail', component: TokenDetailView, props: true },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/trade/:code', name: 'tradeProject', component: TradeProjectView, props: true },
    { path: '/contract', name: 'contract', component: ContractView },
    // { path: '/email-verify', name: 'emailVerify', component: EmailVerifyView },
    { path: '/kycService', component: kycService },
    // Footer pages
    { path: '/overview', name: 'overview', component: OverviewView },
    { path: '/features', redirect: '/solutions' },
    { path: '/solutions', name: 'solutions', component: SolutionsView },
    { path: '/tutorials', name: 'tutorials', component: TutorialsView },
    { path: '/pricing', name: 'pricing', component: PricingView },
    { path: '/about', name: 'about', component: AboutUsView },
    { path: '/contact', name: 'contact', component: ContactView },
    { path: '/faq', name: 'faq', component: FAQView },
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
    { path: '/terms', name: 'terms', component: TermView },
    { path: '/privacy', name: 'privacy', component: PrivacyPolicyView },
    { path: '/cookies', name: 'cookies', component: OverviewView },
    { path: '/licenses', name: 'licenses', component: OverviewView },
    { path: '/settings', name: 'settings', component: SettingsView },
    { path: '/options', redirect: '/settings' },
    // // Test routes
    // { path: '/test/routes', name: 'routeTest', component: () => import('@/views/test/RouteTestView.vue') },
    // { path: '/test/wallet-debug', name: 'walletConnectionDebug', component: () => import('@/views/test/WalletConnectionDebugView.vue') },
    // { path: '/test/contract', name: 'contractTest', component: ContractTestView },
    // { path: '/test/config', name: 'contractConfig', component: () => import('@/views/test/ContractConfigView.vue') },
    // { path: '/test/trade-database', name: 'tradeDatabaseTest', component: () => import('@/views/test/TradeDatabaseTestView.vue') },
    // { path: '/test/contract-address', name: 'contractAddressTest', component: () => import('@/views/test/ContractAddressTestView.vue') }
  ],
})

export default router