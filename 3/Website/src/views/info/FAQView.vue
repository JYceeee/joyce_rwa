<template>
  <div class="faq-page">
    <!-- Hero Section -->
    <section class="section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Frequently Asked Questions</h1>
          <p class="hero-subtitle">Everything you need to know about RWA Property Loans and our platform.</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section">
      <div class="container">
        <!-- <header class="faq-header">
          <h2 class="faq-heading">Common Questions</h2>
          <p class="faq-sub">Find answers to the most frequently asked questions about our platform.</p>
        </header> -->

        <div class="faq-grid">
          <article class="faq-item">
            <div class="faq-icon">🏠</div>
            <h3 class="faq-title">What are RWA Property Loans?</h3>
            <p class="faq-desc">Real World Asset (RWA) Property Loans are tokenized mortgage-backed loans that allow investors to participate in real estate investments with daily returns and transparent blockchain technology.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">💰</div>
            <h3 class="faq-title">How do daily returns work?</h3>
            <p class="faq-desc">Our platform provides daily interest payments on your investments, calculated based on the annual interest rate of the underlying property loan and distributed proportionally.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">🔒</div>
            <h3 class="faq-title">Is my investment secure?</h3>
            <p class="faq-desc">Yes, all investments are backed by real property assets with first-lien mortgages, providing strong security for your capital. Each loan undergoes rigorous due diligence.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">📊</div>
            <h3 class="faq-title">What is the minimum investment?</h3>
            <p class="faq-desc">The minimum investment varies by project, but typically starts from AUD 100, making real estate investment accessible to a wider range of investors.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">⏰</div>
            <h3 class="faq-title">What are the loan terms?</h3>
            <p class="faq-desc">Loan terms typically range from 12 to 36 months, with monthly interest payments and principal repayment at maturity. Early repayment options may be available.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">🌐</div>
            <h3 class="faq-title">How does the blockchain integration work?</h3>
            <p class="faq-desc">All transactions are recorded on the blockchain, providing transparency, immutability, and real-time tracking of your investments and returns.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">📱</div>
            <h3 class="faq-title">Can I track my portfolio?</h3>
            <p class="faq-desc">Yes, our platform provides comprehensive portfolio tracking, including real-time valuations, transaction history, and performance analytics.</p>
          </article>
          
          <article class="faq-item">
            <div class="faq-icon">🏦</div>
            <h3 class="faq-title">How do I withdraw my returns?</h3>
            <p class="faq-desc">Returns are automatically credited to your account and can be withdrawn through our secure payment system. Processing times vary by method.</p>
          </article>
        </div>

        <div class="faq-cta">
          <div class="faq-cta-avatars" aria-hidden="true">
            <span class="avatar">A</span>
            <span class="avatar">B</span>
            <span class="avatar">C</span>
          </div>
          <h3 class="faq-cta-title">Still have questions?</h3>
          <p class="faq-cta-sub">Can't find the answer you're looking for? Please chat to our friendly team.</p>
          <a href="#" class="btn primary">Get in touch</a>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'FAQView',
  mounted() {
    console.log('📋 FAQView 组件已加载')
  }
}
</script>

<style scoped>
/* FAQ页面样式 */
.faq-page {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    #1a1a2e 0%, 
    #16213e 25%, 
    #2d1b69 50%, 
    #1a1a2e 75%, 
    #0f0f23 100%);
}

/* Hero Section */
.hero {
  padding: 80px 0 60px;
  text-align: center;
  background: linear-gradient(135deg, 
    rgba(26, 26, 46, 0.9) 0%, 
    rgba(22, 33, 62, 0.8) 100%);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 16px;
  text-align: center;
}

.hero-subtitle {
  font-size: 20px;
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
  text-align: center;
}

/* Section样式 */
.section {
  padding: 60px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* FAQ Header */
.faq-header {
  text-align: center;
  margin-bottom: 48px;
}

.faq-heading {
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.faq-sub {
  font-size: 18px;
  color: #8ca0c3;
  margin: 0;
}

/* FAQ Grid */
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.faq-item {
  background: rgba(20, 20, 40, 0.95);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.faq-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #8a2be2, #4b0082, #8a2be2);
  border-radius: 16px 16px 0 0;
}

.faq-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(138, 43, 226, 0.3);
  border-color: rgba(138, 43, 226, 0.4);
}

.faq-icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
}

.faq-title {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.4;
}

.faq-desc {
  font-size: 16px;
  color: #e0e0e0;
  line-height: 1.6;
  margin: 0;
}

/* FAQ CTA */
.faq-cta {
  background: rgba(20, 20, 40, 0.95);
  border: 1px solid rgba(138, 43, 226, 0.2);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.faq-cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.05) 0%, rgba(59, 130, 246, 0.03) 100%);
  pointer-events: none;
}

.faq-cta-avatars {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8a2be2, #4b0082);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
}

.faq-cta-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
}

.faq-cta-sub {
  font-size: 16px;
  color: #8ca0c3;
  margin-bottom: 24px;
  line-height: 1.6;
}

.btn {
  display: inline-block;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn.primary {
  background: linear-gradient(135deg, #8a2be2, #4b0082);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(138, 43, 226, 0.3);
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(138, 43, 226, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 60px 0 40px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 18px;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .faq-item {
    padding: 20px;
  }
  
  .faq-cta {
    padding: 32px 24px;
  }
  
  .faq-cta-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .faq-heading {
    font-size: 28px;
  }
  
  .faq-sub {
    font-size: 16px;
  }
  
  .faq-item {
    padding: 16px;
  }
  
  .faq-title {
    font-size: 18px;
  }
  
  .faq-desc {
    font-size: 14px;
  }
  
  .faq-cta {
    padding: 24px 20px;
  }
  
  .faq-cta-title {
    font-size: 20px;
  }
  
  .faq-cta-sub {
    font-size: 14px;
  }
}
</style>
