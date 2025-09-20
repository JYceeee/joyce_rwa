<template>
  <div class="container">
    <div class="page-header">
      <h1>Features of the Product</h1>
      <p class="page-subtitle">Explore the core features of our platform</p>
    </div>

    <div class="features-content">
      <div class="feature-section">
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

      <div class="cta-section">
        <h2>Ready to Start Investing?</h2>
        <p>Register an account now, start your real estate tokenization investment journey</p>
        <div class="cta-buttons">
          <router-link to="/signup" class="btn primary">Register Now</router-link>
          <router-link to="/projects" class="btn secondary">Browse Projects</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeaturesView'
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

.features-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.feature-section {
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

.cta-section {
  text-align: center;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 20px;
  padding: 60px 40px;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.cta-section p {
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

.btn.secondary {
  background: transparent;
  color: #ffffff;
  border: 1px solid #2a2a4a;
}

.btn.secondary:hover {
  background: #2a2a4a;
  border-color: #4b5563;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
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
}
</style>
