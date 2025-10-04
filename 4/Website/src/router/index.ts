import { createRouter, createWebHistory } from 'vue-router'
// Core pages
import HomeView from '../views/core/HomeView.vue'
import WalletView from '../views/core/WalletView.vue'
import PortfolioView from '../views/core/PortfolioView.vue'
import ListedProjectsView from '../views/core/ListedProjectsView.vue'
import ToBeListedView from '../views/core/ToBeListedView.vue'
import AdminProjectsView from '../views/core/AdminProjectsView.vue'
import ContactUsView from '../views/core/ContactUsView.vue'
import DetailPage from '../views/core/DetailPage.vue'
import ProfileView from '../views/core/ProfileView.vue'
import TradeProjectView from '../views/core/TradeProjectView.vue'
// import TradeProjectViewTest from '../views/core/TradeProjectViewTest.vue'
// import ContractView from '../views/core/contract.vue'
import TokenDetailView from '../views/core/TokenDetailView.vue'
// Auth pages
import LoginView from '../views/auth/LoginView.vue'
import SignupView from '../views/auth/SignupView.vue'
// Info pages
import OverviewView from '../views/info/aboutus/OverviewView.vue'
// import SolutionsView from '../views/info/aboutus/SolutionsView.vue'
// import TutorialsView from '../views/info/aboutus/TutorialsView.vue'
// import PricingView from '../views/info/aboutus/PricingView.vue'
import AboutUsView from '../views/info/aboutus/AboutUsView.vue'
// import ContactView from '../views/info/aboutus/ContactView.vue'
// import TermView from '../views/info/aboutus/Term.vue'
// import PrivacyPolicyView from '../views/info/aboutus/PrivacyPolicy.vue'
// import FAQView from '../views/info/FAQView.vue'
// import SettingsView from '../views/settings/SettingsView.vue'
// Functional modules
// Other components
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
    { path: '/admin-projects', name: 'adminProjects', component: AdminProjectsView },
    // { path: '/admin-projects/:code', name: 'adminProjectDetail', component: AdminProjectsView, props: true },
    { path: '/contact', name: 'contact', component: ContactUsView },
    { path: '/detail/:code?', name: 'detail', component: DetailPage, props: true },
    { path: '/token/:address', name: 'tokenDetail', component: TokenDetailView, props: true },
    { path: '/profile', name: 'profile', component: ProfileView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/signup', name: 'signup', component: SignupView },
    { path: '/trade/:code', name: 'tradeProject', component: TradeProjectView, props: true },
    // { path: '/trade-test/:code', name: 'tradeProjectTest', component: TradeProjectViewTest, props: true },
    // { path: '/contract', name: 'contract', component: ContractView },
    // { path: '/email-verify', name: 'emailVerify', component: EmailVerifyView },
    { path: '/kycService', component: kycService },
    // Footer pages
    { path: '/overview', name: 'overview', component: OverviewView },
    // { path: '/features', redirect: '/solutions' },
    // { path: '/solutions', name: 'solutions', component: SolutionsView },
    // { path: '/tutorials', name: 'tutorials', component: TutorialsView },
    // { path: '/pricing', name: 'pricing', component: PricingView },
    { path: '/about', name: 'about', component: AboutUsView },
  ]
})

export default router