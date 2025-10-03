<template>
  <div class="container">
    <div class="page-header">
      <h1>Pricing Solutions</h1>
      <p class="page-subtitle">Transparent fee structure, so you can clearly understand the cost of each transaction</p>
    </div>

    <div class="pricing-content">
      <div class="pricing-cards">
        <div class="pricing-card">
          <div class="pricing-header">
            <h3>Individual Investors</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">1.5</span>
              <span class="period">%</span>
            </div>
            <p class="price-description">Each transaction fee</p>
          </div>
          <div class="pricing-features">
            <ul>
              <li>✅ No minimum investment limit</li>
              <li>✅ Basic trading functions</li>
              <li>✅ Investment portfolio tracking</li>
              <li>✅ Email support</li>
              <li>❌ Exclusive customer support</li>
              <li>❌ API access</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <router-link to="/signup" class="btn primary">Start Investing</router-link>
          </div>
        </div>

        <div class="pricing-card featured">
          <div class="featured-badge">Most Popular</div>
          <div class="pricing-header">
            <h3>Institutional Investors</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">1.0</span>
              <span class="period">%</span>
            </div>
            <p class="price-description">Each transaction fee</p>
          </div>
          <div class="pricing-features">
            <ul>
              <li>✅ Minimum investment $10,000</li>
              <li>✅ Advanced trading functions</li>
              <li>✅ Exclusive investment advisor</li>
              <li>✅ Priority customer support</li>
              <li>✅ API access</li>
              <li>✅ Customized report</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <router-link to="/contact" class="btn primary">Contact Sales</router-link>
          </div>
        </div>

        <div class="pricing-card">
          <div class="pricing-header">
            <h3>Enterprise Customers</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">0.5</span>
              <span class="period">%</span>
            </div>
            <p class="price-description">Each transaction fee</p>
          </div>
          <div class="pricing-features">
            <ul>
              <li>✅ Minimum investment $100,000</li>
              <li>✅ Complete API integration</li>
              <li>✅ White label solution</li>
              <li>✅ 24/7 exclusive support</li>
              <li>✅ Customized development</li>
              <li>✅ Compliance support</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <router-link to="/contact" class="btn primary">Customized solution</router-link>
          </div>
        </div>
      </div>

      <div class="fee-breakdown">
        <h2>Fee Details</h2>
        <div class="fee-table">
          <div class="fee-row">
            <div class="fee-item">
              <h4>Transaction fee</h4>
              <p>Percentage fee based on transaction amount, deducted automatically during transaction</p>
            </div>
            <div class="fee-amount">0.5% - 1.5%</div>
          </div>
          <div class="fee-row">
            <div class="fee-item">
              <h4>Network fee</h4>
              <p>Blockchain network transaction fee, determined by network congestion</p>
            </div>
            <div class="fee-amount">$2 - $20</div>
          </div>
          <div class="fee-row">
            <div class="fee-item">
              <h4>Withdrawal fee</h4>
              <p>Fee for withdrawing funds to bank account</p>
            </div>
            <div class="fee-amount">$5</div>
          </div>
          <div class="fee-row">
            <div class="fee-item">
              <h4>Management fee</h4>
              <p>Annual asset management fee, deducted from investment收益中扣除</p>
            </div>
            <div class="fee-amount">0.2%</div>
          </div>
        </div>
      </div>

      <!-- <div class="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h4>Are there hidden fees?</h4>
            <p>We promise a transparent fee structure, all fees will be clearly displayed before transactions, and there will be no hidden fees.</p>
            <p>我们承诺透明的费用结构，所有费用都会在交易前明确显示，不会有任何隐藏费用。</p>
          </div>
          <div class="faq-item">
            <h4>如何降低交易费用？</h4>
            <p>大额投资可以享受更低的费率，机构投资者和企业客户可以申请定制化费率方案。</p>
          </div>
          <div class="faq-item">
            <h4>费用何时收取？</h4>
            <p>交易手续费在交易执行时自动扣除，管理费按年度从投资收益中扣除。</p>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'PricingView'
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  color: var(--dark-text);
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.page-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin: 0;
}

.pricing-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.pricing-card {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 20px;
  padding: 40px;
  position: relative;
  text-align: center;
  transition: transform 0.2s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
}

.pricing-card.featured {
  border-color: #f97316;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #f97316;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.pricing-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #ffffff;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 8px;
}

.currency {
  font-size: 1.5rem;
  color: #f97316;
  font-weight: 600;
}

.amount {
  font-size: 3rem;
  color: #f97316;
  font-weight: 700;
}

.period {
  font-size: 1.5rem;
  color: #94a3b8;
  font-weight: 600;
}

.price-description {
  color: #94a3b8;
  margin-bottom: 30px;
}

.pricing-features ul {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
  text-align: left;
}

.pricing-features li {
  padding: 8px 0;
  color: #94a3b8;
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  display: inline-block;
}

.btn.primary {
  background: #f97316;
  color: white;
  border: 1px solid #f97316;
}

.btn.primary:hover {
  background: #ea580c;
  border-color: #ea580c;
}

.fee-breakdown h2,
.faq-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #ffffff;
}

.fee-table {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  overflow: hidden;
}

.fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #2a2a4a;
}

.fee-row:last-child {
  border-bottom: none;
}

.fee-item h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #ffffff;
}

.fee-item p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
}

.fee-amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: #f97316;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-item {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 24px;
}

.faq-item h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #ffffff;
}

.faq-item p {
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .pricing-cards {
    grid-template-columns: 1fr;
  }
  
  .fee-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .fee-amount {
    align-self: flex-end;
  }
}
</style>
