<template>
  <section class="container hero">
    <div class="grid">
      <div>
        <h1 class="headline">Invest in RWA Property<br />Loans with Daily Returns</h1>
        <p class="sub">
          Access verified Real World Assets (RWA) — mortgage-backed loans, tokenized for secure and transparent investing.
        </p>

        <form class="email-row" @submit.prevent="notify('Thanks! We will be in touch.')">
          <input class="input" id="email" name="email" type="email" placeholder="Enter your email" required />
          <button class="btn primary" type="submit">Get started</button>
        </form>

        <p class="foot">By continuing, you agree to our Terms and acknowledge our 
          <a href="/src/components/privacypolicy.vue">Privacy Policy.</a></p>
      </div>
    </div>
  </section>

  <section class="new-listing-section">
    <div class="container">
      <div class="listing-card">
        <div class="card-header">
          <h3 class="card-title">New Listing</h3>
          <div class="status-badge" :class="newListingProject ? 'active' : 'inactive'">
            {{ newListingProject ? 'Available' : 'Coming Soon' }}
          </div>
        </div>
        
        <div v-if="newListingProject" class="card-content">
          <div class="project-info">
            <h4 class="project-name">{{ newListingProject.code }} • {{ newListingProject.name }}</h4>
            <p class="project-description">Premium real estate investment opportunity</p>
          </div>
          
          <div class="project-details">
            <div class="detail-item">
              <div class="detail-label">Loan Size</div>
              <div class="detail-value">{{ newListingProject.loanAmount }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Est. Yield (IRR)</div>
              <div class="detail-value highlight">{{ newListingProject.targetYield }}%</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Term</div>
              <div class="detail-value">{{ newListingProject.loanTerm }}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Status</div>
              <div class="detail-value status">{{ getStatusText(newListingProject.status) }}</div>
            </div>
          </div>
          
          <div class="card-actions">
            <button class="btn-primary">View Details</button>
            <button class="btn-secondary">Add to Watchlist</button>
          </div>
        </div>
        
        <div v-else class="card-content empty">
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <h4>No upcoming projects</h4>
            <p>Check back soon for new investment opportunities</p>
            <button class="btn-primary">Get Notified</button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <header class="faq-header">
        <h2 class="faq-heading">Frequently asked questions</h2>
        <p class="faq-sub">Everything you need to know about the product and billing.</p>
      </header>

      <div class="faq-grid">
        <article class="faq-item"><div class="faq-icon">♡</div><h3 class="faq-title">Is there a free trial available?</h3><p class="faq-desc">Yes, you can try us for free for 30 days.</p></article>
        <article class="faq-item"><div class="faq-icon">⇄</div><h3 class="faq-title">Can I change my plan later?</h3><p class="faq-desc">Of course—pricing scales with your company.</p></article>
        <article class="faq-item"><div class="faq-icon">◎</div><h3 class="faq-title">What is your cancellation policy?</h3><p class="faq-desc">Cancel anytime and we’ll refund the difference already paid.</p></article>
        <article class="faq-item"><div class="faq-icon">▣</div><h3 class="faq-title">Can info be added to an invoice?</h3><p class="faq-desc">For now, add info to the workspace name.</p></article>
        <article class="faq-item"><div class="faq-icon">⧉</div><h3 class="faq-title">How does billing work?</h3><p class="faq-desc">Plans are per workspace, not per account.</p></article>
        <article class="faq-item"><div class="faq-icon">✉</div><h3 class="faq-title">How do I change my account email?</h3><p class="faq-desc">Use account settings from a computer.</p></article>
      </div>

      <div class="faq-cta">
        <div class="faq-cta-avatars" aria-hidden="true">
          <span class="avatar">A</span><span class="avatar">B</span><span class="avatar">C</span>
        </div>
        <h3 class="faq-cta-title">Still have questions?</h3>
        <p class="faq-cta-sub">Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
        <a href="#" class="btn primary">Get in touch</a>
      </div>
    </div>
  </section>

  <section class="section wallet">
    <div class="container wallet-grid">
      <div class="wallet-visual">
        <img src="/icons/mobile-app-preview.png" alt="Mortgage RWA Wallet mobile preview" class="wallet-phone" />
      </div>
      <div class="wallet-copy">
        <span class="badge">New</span>
        <h2 class="wallet-title">Mortgage RWA Wallet</h2>
        <p class="wallet-sub">Manage your RWA assets in one place:<strong>Receiving Payment</strong>、<strong>Transfering</strong>、<strong>Exchanging</strong>、<strong>Buying</strong>in one safe wallet</p>
        <ul class="wallet-feats"><li>Non-custodial, self-held private keys</li><li>Daily income details and notifications</li><li>Fiat channels (compliant available regions)</li><li>Multi-chain support (EVM first)</li></ul>
        <div class="store-row">
          <a class="store-btn ios" href="#">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M16.365 1.43c.03 1.09-.4 1.9-1.01 2.63-.68.83-1.83 1.47-2.96 1.38-.13-1.04.35-2 .95-2.66.74-.83 1.99-1.46 3.02-1.35zM20.77 17.38c-.53 1.23-.8 1.77-1.5 2.86-1 1.53-2.41 3.43-4.17 3.45-1.56.02-1.97-1.01-4.1-1.01-2.13 0-2.59 1-4.14 1.03-1.77.03-3.13-1.65-4.14-3.17C.7 18.15-.52 14.34.9 11.5c1.01-2.01 2.82-3.29 4.96-3.32 1.54-.03 2.99 1.04 4.1 1.04 1.1 0 2.9-1.28 4.89-1.09.83.04 3.17.34 4.67 2.56-3.99 2.23-3.35 8.09 1.25 9.69z" fill="currentColor"/>
            </svg><span color="black">App Store</span></a>
          <a class="store-btn and" href="#">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M3.6 1.8l12.3 9-12.3 9c-.37-.21-.6-.6-.6-1.07V2.87c0-.47.23-.86.6-1.07zm13.78 9L18 9.34 6.36 1.8l10.02 11zm0 0L6.36 22.2 18 14.66l-.62-.82zM19.1 13.88l2.9-1.88-2.9-1.88c-.2-.13-.46-.07-.6.13l-1.2 1.75 1.2 1.75c.14.2.4.26.6.13z" fill="currentColor"/>
            </svg><span color="black">Google Play</span></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { products } from '@/data/ProductDetailsInfo.js'

export default {
  name: 'HomeView',
  emits: ['notify'],
  data() {
    return {
      products: products
    }
  },
  computed: {
    // 获取upcoming状态的项目
    upcomingProjects() {
      return this.products.filter(product => product.status === 'upcoming')
    },
    // 获取最新的upcoming项目作为New Listing
    newListingProject() {
      return this.upcomingProjects.length > 0 ? this.upcomingProjects[0] : null
    }
  },
  methods: { 
    notify(msg){ this.$emit('notify', msg) },
    getStatusText(status) {
      const statusMap = {
        'active': 'Active',
        'upcoming': 'Upcoming',
        'research': 'Research',
        'planning': 'Planning',
        'completed': 'Completed'
      }
      return statusMap[status] || 'Unknown'
    }
  },
  mounted() {
    // 测试数据关联
    console.log('🏠 HomeView: 加载的产品数据:', this.products.length, '个项目')
    console.log('📋 HomeView: Upcoming项目:', this.upcomingProjects)
    console.log('🆕 HomeView: New Listing项目:', this.newListingProject)
    
    if (this.newListingProject) {
      console.log('✅ HomeView: New Listing项目详情:', {
        code: this.newListingProject.code,
        name: this.newListingProject.name,
        loanAmount: this.newListingProject.loanAmount,
        targetYield: this.newListingProject.targetYield,
        loanTerm: this.newListingProject.loanTerm,
        status: this.newListingProject.status
      })
    } else {
      console.log('ℹ️ HomeView: 暂无upcoming项目')
    }
  }
}
</script>

<style scoped>
/* 全局重置，确保全屏效果 */
:deep(body) {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Hero section 深色背景样式 */
.hero {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, 
    #1a1a2e 0%, 
    #16213e 25%, 
    #2d1b69 50%, 
    #1a1a2e 75%, 
    #0f0f23 100%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.hero::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(75, 0, 130, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(25, 25, 112, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.hero .grid {
  position: relative;
  z-index: 1;
}

.hero .headline {
  color: #ffffff;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 48px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero .sub {
  color: #e0e0e0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.hero .card {
  background: rgba(20, 20, 38, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(138, 43, 226, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero .card h3 {
  color: #ffffff;
}

.hero .li {
  color: #d0d0d0;
}

.hero .check svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.faq-grid {
  background: #141426;
  border-radius: 16px;
  padding: 32px 24px;
}
.faq-item {
  background: #0A0A19;
  border-radius: 12px;
  padding: 18px 16px;
}
.faq-cta {
  background: #141426;
  border-radius: 16px;
  padding: 28px 20px;
}
.wallet-grid {
  background: #141426;
  border-radius: 16px;
  padding: 32px 24px;
}
.section.wallet {
  background: #0A0A19;
}

.input{
  background: #242435;
}

.card{
  max-height: 280px;
}

/* New Listing Section 样式 */
.new-listing-section {
  background: #0A0A19;
  padding: 60px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.new-listing-section .container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.listing-card {
  width: 500px;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(138, 43, 226, 0.2);
  border: 1px solid rgba(138, 43, 226, 0.1);
  position: relative;
  overflow: hidden;
}

.listing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #8a2be2, #4b0082, #8a2be2);
  border-radius: 20px 20px 0 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(138, 43, 226, 0.2);
}

.card-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.status-badge.inactive {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: #d1d5db;
}

.card-content {
  color: #e5e7eb;
}

.project-info {
  margin-bottom: 24px;
}

.project-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.project-description {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.project-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.detail-value.highlight {
  color: #10b981;
  font-size: 18px;
}

.detail-value.status {
  color: #f59e0b;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: linear-gradient(135deg, #8a2be2, #4b0082);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(138, 43, 226, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
}

.btn-secondary {
  background: transparent;
  color: #8a2be2;
  border: 2px solid rgba(138, 43, 226, 0.3);
}

.btn-secondary:hover {
  background: rgba(138, 43, 226, 0.1);
  border-color: rgba(138, 43, 226, 0.5);
}

/* 空状态样式 */
.card-content.empty {
  text-align: center;
  padding: 40px 20px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.6;
}

.empty-state h4 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.empty-state p {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .listing-card {
    width: 100%;
    max-width: 500px;
    margin: 0 20px;
  }
  
  .project-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .card-actions {
    flex-direction: column;
  }
}

</style>
