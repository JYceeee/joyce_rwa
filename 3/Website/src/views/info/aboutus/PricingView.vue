<template>
  <div class="container">
    <div class="page-header">
      <h1>定价方案</h1>
      <p class="page-subtitle">透明的费用结构，让您清楚了解每笔交易的成本</p>
    </div>

    <div class="pricing-content">
      <div class="pricing-cards">
        <div class="pricing-card">
          <div class="pricing-header">
            <h3>个人投资者</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">1.5</span>
              <span class="period">%</span>
            </div>
            <p class="price-description">每笔交易手续费</p>
          </div>
          <div class="pricing-features">
            <ul>
              <li>✅ 无最低投资限制</li>
              <li>✅ 基础交易功能</li>
              <li>✅ 投资组合跟踪</li>
              <li>✅ 邮件支持</li>
              <li>❌ 专属客服</li>
              <li>❌ API访问</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <router-link to="/signup" class="btn primary">开始投资</router-link>
          </div>
        </div>

        <div class="pricing-card featured">
          <div class="featured-badge">最受欢迎</div>
          <div class="pricing-header">
            <h3>机构投资者</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">1.0</span>
              <span class="period">%</span>
            </div>
            <p class="price-description">每笔交易手续费</p>
          </div>
          <div class="pricing-features">
            <ul>
              <li>✅ 最低投资 $10,000</li>
              <li>✅ 高级交易功能</li>
              <li>✅ 专属投资顾问</li>
              <li>✅ 优先客服支持</li>
              <li>✅ API访问</li>
              <li>✅ 定制化报告</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <router-link to="/contact" class="btn primary">联系销售</router-link>
          </div>
        </div>

        <div class="pricing-card">
          <div class="pricing-header">
            <h3>企业客户</h3>
            <div class="price">
              <span class="currency">$</span>
              <span class="amount">0.5</span>
              <span class="period">%</span>
            </div>
            <p class="price-description">每笔交易手续费</p>
          </div>
          <div class="pricing-features">
            <ul>
              <li>✅ 最低投资 $100,000</li>
              <li>✅ 完整API集成</li>
              <li>✅ 白标解决方案</li>
              <li>✅ 24/7专属支持</li>
              <li>✅ 定制化开发</li>
              <li>✅ 合规性支持</li>
            </ul>
          </div>
          <div class="pricing-cta">
            <router-link to="/contact" class="btn primary">定制方案</router-link>
          </div>
        </div>
      </div>

      <div class="fee-breakdown">
        <h2>费用明细</h2>
        <div class="fee-table">
          <div class="fee-row">
            <div class="fee-item">
              <h4>交易手续费</h4>
              <p>基于交易金额的百分比费用，在交易时自动扣除</p>
            </div>
            <div class="fee-amount">0.5% - 1.5%</div>
          </div>
          <div class="fee-row">
            <div class="fee-item">
              <h4>网络费用</h4>
              <p>区块链网络交易费用，由网络拥堵程度决定</p>
            </div>
            <div class="fee-amount">$2 - $20</div>
          </div>
          <div class="fee-row">
            <div class="fee-item">
              <h4>提现费用</h4>
              <p>将资金提取到银行账户的手续费</p>
            </div>
            <div class="fee-amount">$5</div>
          </div>
          <div class="fee-row">
            <div class="fee-item">
              <h4>管理费</h4>
              <p>年度资产管理费用，从投资收益中扣除</p>
            </div>
            <div class="fee-amount">0.2%</div>
          </div>
        </div>
      </div>

      <div class="faq-section">
        <h2>常见问题</h2>
        <div class="faq-list">
          <div class="faq-item">
            <h4>是否有隐藏费用？</h4>
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
      </div>
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
