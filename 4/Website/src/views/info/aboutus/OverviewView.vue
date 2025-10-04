<template>
  <div class="container">
    <div class="page-header">
      <h1>Product Overview</h1>
      <p class="page-subtitle">Know our real estate tokenization investment platform</p>
    </div>

    <div class="overview-content">
      <div class="feature-grid">
        <div class="feature-card">
          <!-- <div class="feature-icon">🏠</div> -->
          <h3>Real Estate Tokenization</h3>
          <p>Convert traditional real estate investments into tradable digital tokens, reducing investment门槛, and improving liquidity.</p>
        </div>
        
        <div class="feature-card">
          <!-- <div class="feature-icon">💰</div> -->
          <h3>Stable Income</h3>
          <p>Based on high-quality real estate mortgage loans, providing stable rental income and capital appreciation potential.</p>
        </div>
        
        <div class="feature-card">
          <!-- <div class="feature-icon">🔒</div> -->
          <h3>Secure and Transparent</h3>
          <p>Based on blockchain technology, all transaction records are transparent and smart contracts are automatically executed.</p>
        </div>
        
        <div class="feature-card">
          <!-- <div class="feature-icon">📊</div> -->
          <h3>Real-Time Data</h3>
          <p>Provide real-time market data, project information and investment performance, helping you make wise decisions.</p>
        </div>
      </div>

      <div class="stats-section">
        <h2>Platform Data</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">$50M+</div>
            <div class="stat-label">Managed Assets</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1,200+</div>
            <div class="stat-label">Active Investors</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">25+</div>
            <div class="stat-label">Investment Projects</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">6.5%</div>
            <div class="stat-label">Average Annual Return</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OverviewView'
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

.overview-content {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.feature-card p {
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

.stats-section {
  text-align: center;
}

.stats-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 40px;
  color: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-item {
  background: #141426;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 30px 20px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f97316;
  margin-bottom: 8px;
}

.stat-label {
  color: #94a3b8;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
