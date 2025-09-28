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
