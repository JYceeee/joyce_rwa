<template>
  <section class="container">
    <h1 class="headline">{{ model?.name || 'Project Detail' }}</h1>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading project details...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h3>Loading failed</h3>
      <p>{{ error }}</p>
      <button @click="loadProjectData" class="retry-btn">Retry</button>
    </div>
    
    <!-- 项目详情 -->
    <div v-else-if="model" class="detail-container">
      <!-- Key Facts 关键信息 -->
      <section class="section key-facts">
        <div class="section-header">
          <h2>Key Facts</h2>
          <button class="invest-btn" @click="handleInvest">
            <span class="btn-icon">💰</span>
            Invest
          </button>
        </div>
        <div class="facts-grid">
          <div class="fact-item">
            <div class="fact-label">Loan Amount</div>
            <div class="fact-value">{{ p.loanAmount }}</div>
          </div>
          <div class="fact-item">
            <div class="fact-label">Annual Interest Rate</div>
            <div class="fact-value">{{ p.loanInterest }}</div>
          </div>
          <div class="fact-item">
            <div class="fact-label">Loan Term</div>
            <div class="fact-value">{{ p.loanTerm }}</div>
          </div>
          <div class="fact-item">
            <div class="fact-label">LTV (Loan-to-Value)</div>
            <div class="fact-value">{{ p.collateralRatio }}</div>
          </div>
          <div class="fact-item">
            <div class="fact-label">Disbursement Date</div>
            <div class="fact-value">{{ p.loanWithdrawalDate }}</div>
          </div>
          <div class="fact-item">
            <div class="fact-label">Prepayment Option</div>
            <div class="fact-value">{{ getPrepaymentInfo() }}</div>
          </div>
          <div class="fact-item">
            <div class="fact-label">Repayment Schedule</div>
            <div class="fact-value">{{ p.interestPaymentMethod }}</div>
          </div>
        </div>
      </section>

      <!-- Parties 相关主体 -->
      <section class="section parties">
        <h2>Parties</h2>
        <div class="parties-grid">
          <div class="party-item">
            <div class="party-label">Issuer</div>
            <div class="party-value">{{ p.issuer }}</div>
          </div>
          <div class="party-item">
            <div class="party-label">PW Shareholders</div>
            <div class="party-value">{{ p.pwShareholders }}</div>
          </div>
          <div class="party-item">
            <div class="party-label">Lender</div>
            <div class="party-value">{{ p.lender }}</div>
          </div>
          <div class="party-item">
            <div class="party-label">Borrower</div>
            <div class="party-value">{{ p.borrower }}</div>
          </div>
          <div class="party-item">
            <div class="party-label">Guarantor</div>
            <div class="party-value">{{ p.guarantor }}</div>
          </div>
        </div>
      </section>

      <!-- Disbursement & Interest -->
      <section class="section disbursement">
        <h2>Disbursement & Interest</h2>
        <div class="disbursement-grid">
          <div class="disbursement-item">
            <div class="disbursement-label">Disbursement Method</div>
            <div class="disbursement-value">{{ p.disbursementMethod }}</div>
          </div>
          <div class="disbursement-item">
            <div class="disbursement-label">Interest Rate</div>
            <div class="disbursement-value">{{ p.interest }}</div>
          </div>
          <div class="disbursement-item">
            <div class="disbursement-label">Prepayment Information</div>
            <div class="disbursement-value">{{ p.earlyRepaymentDetails }}</div>
          </div>
          <div class="disbursement-item">
            <div class="disbursement-label">Maturity Date</div>
            <div class="disbursement-value">{{ p.maturityDate }}</div>
          </div>
        </div>
      </section>

      <!-- Collateral -->
      <section class="section collateral">
        <h2>Collateral</h2>
        <div class="collateral-grid">
          <div class="collateral-item">
            <div class="collateral-label">Property Address</div>
            <div class="collateral-value">{{ p.propertyAddress }}</div>
          </div>
          <div class="collateral-item">
            <div class="collateral-label">Valuation</div>
            <div class="collateral-value">{{ p.valuation }}</div>
          </div>
          <div class="collateral-item">
            <div class="collateral-label">Security Ranking</div>
            <div class="collateral-value">{{ p.securityRank }}</div>
          </div>
          <div class="collateral-item">
            <div class="collateral-label">LVR (Loan-to-Value Ratio)</div>
            <div class="collateral-value">{{ p.lvr }}</div>
          </div>
          <div class="collateral-item full-width">
            <div class="collateral-label">Description</div>
            <div class="collateral-value">{{ p.summary }}</div>
          </div>
        </div>
      </section>

      <!-- Default & Remedies -->
      <section class="section default">
        <h2>Default & Remedies</h2>
        <div class="default-grid">
          <div class="default-item">
            <div class="default-label">Default Interest Rate</div>
            <div class="default-value">{{ p.defaultInterestRate }}</div>
          </div>
          <div class="default-item full-width">
            <div class="default-label">Default Trigger Conditions</div>
            <div class="default-value">{{ p.defaultTriggers }}</div>
          </div>
          <div class="default-item full-width">
            <div class="default-label">Disposal Process</div>
            <div class="default-value">{{ p.defaultProcess }}</div>
          </div>
        </div>
      </section>

      <!-- On-Chain & Documents -->
      <section class="section documents">
        <h2>On-Chain & Documents</h2>
        <div class="documents-grid">
          <div class="document-item">
            <div class="document-label">Issuer Token</div>
            <div class="document-value">{{ p.issuerToken }}</div>
            <button class="doc-btn">View</button>
          </div>
          <div class="document-item">
            <div class="document-label">Loan Token</div>
            <div class="document-value">{{ p.loanToken }}</div>
            <button class="doc-btn">View</button>
          </div>
          <div class="document-item">
            <div class="document-label">Valuation Report</div>
            <div class="document-value">{{ p.valuationReport }}</div>
            <button class="doc-btn">Download</button>
          </div>
          <div class="document-item">
            <div class="document-label">Mortgage Deed</div>
            <div class="document-value">{{ p.mortgageDeed }}</div>
            <button class="doc-btn">Download</button>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
export default { 
  name: 'DetailPage',
  props: { product: { type: Object, default: null } },
  data() {
    return {
      model: null,
      loading: false,
      error: null
    }
  },
  computed: {
    // 定义p变量指向model，方便模板使用
    p() {
      return this.model || {}
    }
  },
  async mounted() {
    await this.loadProjectData()
  },
  methods: {
    async loadProjectData() {
      // 优先使用props传入的product
      if (this.product) {
        this.model = this.product
        return
      }

      // 尝试从sessionStorage获取
      try {
        const cache = sessionStorage.getItem('lastProduct')
        if (cache) {
          this.model = JSON.parse(cache)
          return
        }
      } catch(e) {
        console.warn('解析缓存数据失败:', e)
      }

      // 从URL参数获取项目ID并调用API
      const projectId = this.$route.params.id || this.$route.query.id
      if (projectId) {
        await this.fetchProjectFromAPI(projectId)
      }
    },

    async fetchProjectFromAPI(projectId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(import.meta.env.VITE_API_Project_URL)
        const data = await response.json()
        
        if (data.status === 0 && data.data) {
          this.model = data.data
          // 缓存到sessionStorage
          sessionStorage.setItem('lastProduct', JSON.stringify(data.data))
        } else {
          this.error = data.message || '获取项目详情失败'
        }
      } catch (error) {
        console.error('API请求失败:', error)
        this.error = '网络请求失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },

    // 获取提前还款信息
    getPrepaymentInfo() {
      if (!this.model?.loanTerm) return '-'
      const term = this.model.loanTerm.toLowerCase()
      if (term.includes('6个月') || term.includes('6 months')) {
        return 'Available after 6 months'
      }
      return 'Not available'
    },

    // 处理投资按钮点击
    handleInvest() {
      if (!this.model) {
        console.error('No project data available')
        return
      }
      
      // 获取项目代码，优先使用code字段，然后是project_id
      const projectCode = this.model.code || this.model.project_id || this.model.projectCode
      
      if (!projectCode) {
        console.error('No project code found')
        return
      }
      
      console.log('🚀 跳转到交易页面，项目代码:', projectCode)
      
      // 跳转到交易页面，使用正确的路由格式
      this.$router.push({
        name: 'tradeProject',
        params: { code: projectCode }
      })
    }
  },
  
  watch: {
    // 监听路由变化，重新加载数据
    '$route'(to, from) {
      if (to.params.id !== from.params.id) {
        this.loadProjectData()
      }
    },
    
    // 监听props变化
    product: {
      handler(newProduct) {
        if (newProduct) {
          this.model = newProduct
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
/* 主容器 */
.detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 章节样式 */
.section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.section:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--brand);
}

.section h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  border-bottom: 2px solid var(--brand);
  padding-bottom: 12px;
}

/* Key Facts 样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  margin: 0;
  border: none;
  padding: 0;
}

.invest-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f97316;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.2);
}

.invest-btn:hover {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.3);
}

.btn-icon {
  font-size: 18px;
}

/* 网格布局 */
.facts-grid, .parties-grid, .disbursement-grid, .collateral-grid, .default-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

/* 信息项样式 */
.fact-item, .party-item, .disbursement-item, .collateral-item, .default-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.fact-item:hover, .party-item:hover, .disbursement-item:hover, 
.collateral-item:hover, .default-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--brand);
  transform: translateY(-2px);
}

.fact-item.full-width, .party-item.full-width, .disbursement-item.full-width, 
.collateral-item.full-width, .default-item.full-width {
  grid-column: 1 / -1;
}

/* 标签和值样式 */
.fact-label, .party-label, .disbursement-label, .collateral-label, .default-label {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fact-value, .party-value, .disbursement-value, .collateral-value, .default-value {
  font-weight: 600;
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
}

/* 文档项样式 */
.document-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.document-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--brand);
}

.document-label {
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.document-value {
  font-weight: 600;
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
}

.doc-btn {
  align-self: flex-start;
  background: transparent;
  border: 1px solid var(--brand);
  color: var(--brand);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.doc-btn:hover {
  background: var(--brand);
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-container {
    padding: 16px;
    gap: 24px;
  }
  
  .section {
    padding: 20px;
  }
  
  .section h2 {
    font-size: 20px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .invest-btn {
    width: 100%;
    justify-content: center;
  }
  
  .facts-grid, .parties-grid, .disbursement-grid, .collateral-grid, .default-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .documents-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .fact-item, .party-item, .disbursement-item, .collateral-item, .default-item {
    padding: 14px;
  }
  
  .document-item {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .detail-container {
    padding: 12px;
    gap: 20px;
  }
  
  .section {
    padding: 16px;
  }
  
  .section h2 {
    font-size: 18px;
  }
  
  .fact-label, .party-label, .disbursement-label, .collateral-label, .default-label,
  .document-label {
    font-size: 12px;
  }
  
  .fact-value, .party-value, .disbursement-value, .collateral-value, .default-value,
  .document-value {
    font-size: 14px;
  }
}

/* 加载状态样式 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--brand);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: var(--muted);
  font-size: 16px;
  margin: 0;
}

/* 错误状态样式 */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
  margin: 20px 0;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-state h3 {
  color: #dc2626;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.error-state p {
  color: var(--muted);
  font-size: 16px;
  margin: 0 0 20px 0;
  max-width: 400px;
}

.retry-btn {
  background: var(--brand);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: var(--brand-dark, #e69500);
  transform: translateY(-1px);
}

.retry-btn:active {
  transform: translateY(0);
}
</style>


