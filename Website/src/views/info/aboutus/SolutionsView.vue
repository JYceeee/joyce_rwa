<template>
  <div class="container">
    <div class="page-header">
      <h1>Solutions</h1>
      <p class="page-subtitle">Customized investment solutions for different investors</p>
    </div>

    <div class="solutions-content">
      <div class="solution-cards">
        <div class="solution-card">
          <div class="solution-header">
            <div class="solution-icon">👤</div>
            <h3>Individual Investors</h3>
          </div>
          <div class="solution-content">
            <ul class="solution-features">
              <li>Low-threshold investment, starting from as little as $100 AUD</li>
              <li>Diverse investment portfolios, diversify risks</li>
              <li>Simple and easy-to-use trading interface</li>
              <li>Real-time Investment Tracking</li>
              <li>24/7 Customer Support</li>
            </ul>
            <div class="solution-cta">
              <router-link to="/signup" class="btn primary">Start Investing</router-link>
            </div>
          </div>
        </div>

        <div class="solution-card featured">
          <div class="featured-badge">Recommended</div>
          <div class="solution-header">
            <div class="solution-icon">🏢</div>
            <h3>Institutional Investors</h3>
          </div>
          <div class="solution-content">
            <ul class="solution-features">
              <li>Large investment discount rate</li>
              <li>Exclusive investment advisor service</li>
              <li>Customized investment strategy</li>
              <li>API interface integration</li>
              <li>White label solution</li>
            </ul>
            <div class="solution-cta">
              <router-link to="/contact" class="btn primary">Contact Sales</router-link>
            </div>
          </div>
        </div>

        <div class="solution-card">
          <div class="solution-header">
            <div class="solution-icon">🏦</div>
            <h3>Financial Institutions</h3>
          </div>
          <div class="solution-content">
            <ul class="solution-features">
              <li>Complete tokenization infrastructure</li>
              <li>Compliance support</li>
              <li>Liquidity management tools</li>
              <li>Risk management framework</li>
              <li>Technical integration support</li>
            </ul>
            <div class="solution-cta">
              <router-link to="/contact" class="btn primary">Learn More</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h2>Features of the Product</h2>
        <p class="features-subtitle">Explore the core features of our platform</p>
        <div class="feature-items">
          <div class="feature-item">
            <div class="feature-icon">🔐</div>
            <div class="feature-content">
              <h3>Secure Wallet Integration</h3>
              <p>Supports mainstream wallets like MetaMask, ensuring the security of your digital assets. All transactions are encrypted and protected.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">📈</div>
            <div class="feature-content">
              <h3>Real-Time Trading</h3>
              <p>24/7 real-time trading functionality, allowing you to buy and sell real estate tokens, enjoy market liquidity.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h3>Portfolio Management</h3>
              <p>Intuitive portfolio dashboard, tracking your investment performance and returns in real-time.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">🏘️</div>
            <div class="feature-content">
              <h3>Project Details</h3>
              <p>Detailed real estate project information, including location, valuation, rental income, and other key data.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <div class="feature-content">
              <h3>Smart Filtering</h3>
              <p>Filter investment projects by type, region, risk level, and other criteria to find the best investment opportunities.</p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-content">
              <h3>Mobile Support</h3>
              <p>Responsive design, perfectly supporting mobile and tablet devices, allowing you to manage your investments anytime, anywhere.</p>
            </div>
          </div>
        </div>
        
        <div class="features-cta">
          <h3>Ready to Start Investing?</h3>
          <p>Register an account now, start your real estate tokenization investment journey</p>
          <div class="cta-buttons">
            <router-link to="/signup" class="btn primary">Register Now</router-link>
            <router-link to="/projects" class="btn secondary">Browse Projects</router-link>
          </div>
        </div>
      </div>

      <div class="comparison-section">
        <h2>Comparison of Solutions</h2>
        <div class="comparison-table">
          <div class="table-header">
            <div class="table-cell">Function Features</div>
            <div class="table-cell">Individual Investors</div>
            <div class="table-cell">Institutional Investors</div>
            <div class="table-cell">Financial Institutions</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Minimum Investment</div>
            <div class="table-cell">$100</div>
            <div class="table-cell">$10,000</div>
            <div class="table-cell">$100,000</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Transaction Fee Rate</div>
            <div class="table-cell">1.5%</div>
            <div class="table-cell">1.0%</div>
            <div class="table-cell">0.5%</div>
          </div>
          <div class="table-row">
            <div class="table-cell">Exclusive Support</div>
            <div class="table-cell">❌</div>
            <div class="table-cell">✅</div>
            <div class="table-cell">✅</div>
          </div>
          <div class="table-row">
            <div class="table-cell">API Access</div>
            <div class="table-cell">❌</div>
            <div class="table-cell">✅</div>
            <div class="table-cell">✅</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SolutionsView'
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

.solutions-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.solution-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.solution-card {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 20px;
  padding: 40px;
  position: relative;
  transition: transform 0.2s ease;
}

.solution-card:hover {
  transform: translateY(-4px);
}

.solution-card.featured {
  border-color: #f97316;
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.2);
}

.featured-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: #f97316;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.solution-header {
  text-align: center;
  margin-bottom: 30px;
}

.solution-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.solution-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.solution-features {
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
}

.solution-features li {
  padding: 8px 0;
  color: #94a3b8;
  position: relative;
  padding-left: 24px;
}

.solution-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

.solution-cta {
  text-align: center;
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

.features-section {
  text-align: center;
}

.features-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.features-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 60px;
}

.feature-items {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  transition: transform 0.2s ease;
  text-align: left;
}

.feature-item:hover {
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141426;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
}

.feature-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.feature-content p {
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.features-cta {
  margin-top: 60px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 20px;
  padding: 60px 40px;
}

.features-cta h3 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.features-cta p {
  font-size: 1.25rem;
  color: #94a3b8;
  margin-bottom: 40px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn.secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid #2a2a4a;
}

.btn.secondary:hover {
  background: #2a2a4a;
  border-color: #4b5563;
}

.comparison-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #ffffff;
}

.comparison-table {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  background: #141426;
  font-weight: 600;
  color: #ffffff;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  border-top: 1px solid #2a2a4a;
}

.table-cell {
  padding: 16px 20px;
  color: #94a3b8;
  display: flex;
  align-items: center;
}

.table-header .table-cell {
  color: #ffffff;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .solution-cards {
    grid-template-columns: 1fr;
  }
  
  .feature-item {
    flex-direction: column;
    text-align: center;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 200px;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
  
  .table-cell {
    border-bottom: 1px solid #2a2a4a;
  }
  
  .table-cell:first-child {
    font-weight: 600;
    color: #ffffff;
    background: #141426;
  }
}
</style>
