<template>
  <div class="container">
    <div class="page-header">
      <h1>产品功能</h1>
      <p class="page-subtitle">探索我们平台的核心功能特性</p>
    </div>

    <div class="features-content">
      <div class="feature-section">
        <div class="feature-item">
          <div class="feature-icon">🔐</div>
          <div class="feature-content">
            <h3>安全钱包集成</h3>
            <p>支持MetaMask等主流钱包，确保您的数字资产安全。所有交易都经过加密保护。</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📈</div>
          <div class="feature-content">
            <h3>实时交易</h3>
            <p>24/7实时交易功能，支持买入和卖出房地产代币，享受市场流动性。</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📊</div>
          <div class="feature-content">
            <h3>投资组合管理</h3>
            <p>直观的投资组合仪表板，实时跟踪您的投资表现和收益情况。</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🏘️</div>
          <div class="feature-content">
            <h3>项目详情</h3>
            <p>详细的房地产项目信息，包括位置、估值、租金收入等关键数据。</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">🔍</div>
          <div class="feature-content">
            <h3>智能筛选</h3>
            <p>按类型、地区、风险等级等条件筛选投资项目，找到最适合您的投资机会。</p>
          </div>
        </div>

        <div class="feature-item">
          <div class="feature-icon">📱</div>
          <div class="feature-content">
            <h3>移动端支持</h3>
            <p>响应式设计，完美支持手机和平板设备，随时随地管理您的投资。</p>
          </div>
        </div>
      </div>

      <div class="cta-section">
        <h2>准备开始投资？</h2>
        <p>立即注册账户，开始您的房地产代币化投资之旅</p>
        <div class="cta-buttons">
          <router-link to="/signup" class="btn primary">立即注册</router-link>
          <router-link to="/projects" class="btn secondary">浏览项目</router-link>
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
