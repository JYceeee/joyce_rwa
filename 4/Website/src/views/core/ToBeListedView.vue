<template>
  <div class="container">
    <div class="project-container">
        <!-- 项目头部 -->
        <!-- <header class="doc-header">
          <div class="header-content">
            <div class="header-text">
              <h1 class="headline">
                <template v-if="isDetailView && currentProduct">
                  {{ currentProduct.name }} - {{ currentProduct.code }}
                </template>
                 <template v-else>
                  To Be Listed Property Loan
                </template> 
              </h1>
              <p class="subline">
                <template v-if="isDetailView && currentProduct">
                  {{ currentProduct.subtitle }}
                </template>
                <template v-else>
                  First-lien mortgages · LTV control · Monthly interest
                </template>
              </p>
            </div>
          </div>
        </header> -->
    
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>{{ t('common.loadingProducts') }}</p>
        </div>
    
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
          <div class="error-message">
            <h3>{{ t('common.loadFailed') }}</h3>
            <!-- <p>{{ error }}</p> -->
            <button @click="loadProducts" class="btn retry-btn">{{ t('common.refresh') }}</button>
          </div>
        </div>
    
        <!-- 单个产品详情视图 -->
        <!-- <section v-else-if="isDetailView && currentProduct" class="doc-list">
          <article class="doc-card" aria-labelledby="'title-' + currentProduct.code">
            主要内容区域 
            <div class="main-content">
              <div class="left-content">
                项目标题信息 
                <section class="title-section">
                  <div class="title-header">
                    <h2 :id="'title-' + currentProduct.code">
                      <span class="doc-code">{{ currentProduct.code }}</span>
                      <span class="doc-name">{{ currentProduct.name }}</span>
                    </h2>
                  </div>
                  <p class="doc-subtitle">{{ currentProduct.subtitle }}</p>
                  
                  <div class="project-basic-info">
                    <div class="info-item">
                      <span class="info-label">类型:</span>
                      <span class="info-value">{{ currentProduct.type }}</span>
                    </div>
                  </div>
                </section>
                <hr class="sep" />
              </div>
            </div> 
    
            按钮与进度条
            <div class="progress-actions-row">
              <div class="progress-container">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: getProgressPercentage(currentProduct) + '%' }"></div>
                  <div class="progress-empty" :style="{ width: (100 - getProgressPercentage(currentProduct)) + '%' }"></div>
                </div>
                <span class="progress-text">{{ getProgressPercentage(currentProduct) }}%</span>
              </div>
              <div class="doc-actions">
                 ACTIVE状态: Buy and Detail 
                <template v-if="currentProduct.status === 'ACTIVE'">
                  <a href="#" class="btn small orange" @click.prevent="openTrade(currentProduct.code)">购买</a>
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">详情</a>
                </template>
                
                INCOMING状态: Preview and Join Waitlist
                <template v-else-if="currentProduct.status === 'INCOMING'">
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">预览</a>
                  <a href="#" class="btn small" @click.prevent="joinWaitlist(currentProduct.code)">加入等待列表</a>
                </template>
                
                PERFORMING状态: View Details 
                <template v-else-if="currentProduct.status === 'PERFORMING'">
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">查看详情</a>
                </template>
                
                COMPLETED状态: View Details
                <template v-else-if="currentProduct.status === 'COMPLETED'">
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">查看详情</a>
                </template>
                
                 COMPLETE状态: View Details 
                <template v-else-if="currentProduct.status === 'COMPLETE'">
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">查看详情</a>
                </template>
                
                DEFAULT状态: View Details 
                <template v-else-if="currentProduct.status === 'DEFAULT'">
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">查看详情</a>
                </template>
                
                默认状态: Learn More 
                <template v-else>
                  <a href="#" class="btn small" @click.prevent="openDetail(currentProduct.code)">了解更多</a>
                </template>
              </div>
            </div>
          </article>
        </section> -->
    
        <!-- 产品列表视图 -->
        <section v-else class="doc-list">
          <article
            v-for="p in filteredProducts"
            :key="p.code"
            class="pf-project-card"
            aria-labelledby="'title-' + p.code"
          >
            <!-- 项目头部 -->
            <div class="pf-project-header">
              <!-- <img :src="p.image" class="pf-project-image" :alt="p.code" /> -->
              <div class="pf-project-info">
                <div class="pf-title-row">
                  <h4 :id="'title-' + p.code">{{ p.code }} 
                    <!-- • {{ p.name }} -->
                  </h4>
                </div>
                <p>{{ p.propertySummary }}</p>
              </div>
              <button class="pf-project-btn pf-project-btn-secondary pf-title-btn" @click="openTrade(p.code)">详情</button>
            </div>
    
            <!-- 项目指标 -->
            <div class="pf-project-metrics">
              <div class="pf-project-metric">
                <span class="pf-metric-label">{{ t('tobelisted.loanSize') }}</span>
                <span class="pf-metric-value">AUD{{ formatNumber(p.loanAmount)}}</span>
              </div>
              <div class="pf-project-metric">
                <span class="pf-metric-label">{{ t('tobelisted.estYield') }}</span>
                <span class="pf-metric-value" style="color: #16a34a;">{{ p.interestRate }}%/年</span>
              </div>
              <div class="pf-project-metric">
                <span class="pf-metric-label">{{ t('tobelisted.term') }}</span>
                <span class="pf-metric-value">{{ p.loanTermMonths }}月</span>
              </div>
            </div>
            <!-- 投资进度信息 -->
            <div class="pf-investment-progress">
              <div class="pf-progress-metrics">
                <div class="pf-progress-metric">
                  <span class="pf-progress-label">{{ t('tobelisted.subscribed') }}</span>
                  <span class="pf-progress-value">{{ formatNumber(p.subscribed || 0) }}</span>
                </div>
                <div class="pf-progress-metric">
                  <span class="pf-progress-label">{{ t('tobelisted.totalOffering') }}</span>
                  <span class="pf-progress-value">{{ formatNumber(p.totalOffering || 0) }}</span>
                </div>
              </div>
              <div class="pf-progress-bar-container">
                <div class="pf-progress-bar">
                  <div class="pf-progress-fill" :style="{ width: getSubscriptionProgress(p) + '%' }"></div>
                </div>
                <div class="pf-progress-text">{{ getSubscriptionProgress(p) }}% {{ t('tobelisted.subscriptionProgress') }}</div>
              </div>
            </div>
            <!-- 展开/收起按钮 -->
            <div class="pf-expand-toggle" @click.stop="toggleProjectDetails(p.code)">
              <span class="expand-text">{{ t('tobelisted.relatedPartyInfo') }}</span>
              <span class="expand-icon" :class="{ 'expanded': isProjectExpanded(p.code) }">▼</span>
            </div>

            <!-- 可展开的详情内容 -->
            <div class="pf-expandable-content" :class="{ 'expanded': isProjectExpanded(p.code) }">
              <!-- 新增项目指标 -->
              <div class="pf-project-metrics pf-project-metrics-new">
                <div class="pf-project-metric">
                  <span class="pf-metric-label">{{ t('tobelisted.issuer') }}</span>
                  <span class="pf-metric-value">{{ p.issuer || t('tobelisted.tba') }}</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">{{ t('tobelisted.collateral') }}</span>
                  <span class="pf-metric-value">{{ p.collateral || t('tobelisted.tba') }}</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">{{ t('tobelisted.sponsor') }}</span>
                  <span class="pf-metric-value">{{ p.sponsor || t('tobelisted.tba') }}</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">{{ t('tobelisted.valuer') }}</span>
                  <span class="pf-metric-value">{{ p.valuer || t('tobelisted.tba') }}</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">{{ t('tobelisted.lawyer') }}</span>
                  <span class="pf-metric-value">{{ p.lawyer || t('tobelisted.tba') }}</span>
                </div>
                <div class="pf-project-metric">
                  <span class="pf-metric-label">{{ t('tobelisted.trustee') }}</span>
                  <span class="pf-metric-value">{{ p.trustee || t('tobelisted.tba') }}</span>
                </div>
              </div>
              
              <!-- Etherscan链接 -->
              <div class="pf-etherscan-link" v-if="p.principalTokenAddress">
                <a 
                  :href="`https://etherscan.io/address/${p.principalTokenAddress}`" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="etherscan-link"
                >
                  <span class="etherscan-icon">🔗</span>
                  <span class="etherscan-text">{{ t('tobelisted.viewOnEtherscan') }}</span>
                </a>
              </div>
            </div>
          </article>
        </section>
    </div>
  </div>
  </template>
  
  <script>
  import { productAPI } from '@/service/api'
  import { useDatabaseSync } from '@/service/dataSyncService.js'
  import { useLanguage } from '@/composables/useLanguage'
  
  export default { 
    name: 'ProjectsView',
    setup() {
      const { t } = useLanguage()
      return { t }
    },
    props: {
      code: {
        type: String,
        default: null
      }
    },
    data(){
      return {
        filters: { q: '', type: '', status: '', minYield: 0, maxYield: 20 },
        products: [],
        currentProduct: null, // 当前选中的产品详情
        loading: true,
        error: null,
        refreshInterval: null,
        lastRefreshTime: null,
        isDetailView: false, // 是否为详情视图
        expandedProject: null // 当前展开的项目代码，同时只能有一个项目展开
      }
    },
    async mounted() {
      // 检查是否为详情视图
      this.isDetailView = !!this.code
      if (this.isDetailView) {
        await this.loadSingleProduct()
      } else {
        await this.loadProducts()
      }
      this.setupDatabaseSync()
    },
    beforeUnmount() {
      this.cleanupDatabaseSync()
    },
    watch: {
      // 监听路由变化
      '$route'(to, from) {
        console.log('ToBeListedView: 路由变化', { to: to.params, from: from.params })
        // 当路由参数变化时，重新加载数据
        if (to.params.code !== from.params.code) {
          this.isDetailView = !!to.params.code
          if (this.isDetailView) {
            this.loadSingleProduct()
          } else {
            this.loadProducts()
          }
        }
      },
      
      // 监听props变化（当使用props: true时，路由参数会自动作为props传递）
      code: {
        handler(newCode, oldCode) {
          console.log('ToBeListedView: Props代码变化', { newCode, oldCode })
          this.isDetailView = !!newCode
          if (this.isDetailView) {
            this.loadSingleProduct()
          } else {
            this.loadProducts()
          }
        },
        immediate: true
      }
    },
    methods: {
      // 加载单个产品详情
      async loadSingleProduct() {
        try {
          this.loading = true
          this.error = null
          console.log('🔄 ProjectsView: 从数据库加载单个产品数据...', this.code)
          
          const response = await productAPI.getProductByCode(this.code)
          
          if (response.status === 0) {
            // 映射数据库字段到前端期望的字段名（与ListedProjectsView保持一致）
            const rawData = response.data
            const product = {
              ...rawData,

              // 基础信息
              code: rawData.project_code,
              name: rawData.project_name,
              status: rawData.loan_status,
              
              // 认购信息            
              totalOffering: this.formatCurrency(rawData.total_offering_token),
              subscribed: this.formatCurrency(rawData.subscribe_token),
              totalOfferingRaw: rawData.total_offering_token || 0,
              subscribedRaw: rawData.subscribe_token || 0,
              
              // 物业信息
              propertyLocation: rawData.property_location,
              propertyState: rawData.property_state,
              propertyType: rawData.property_type,
              propertyValue: rawData.property_value,
              propertySummary: rawData.property_type,
              
              // 贷款信息
              mortgageType: rawData.mortage_type,
              loanAmount: rawData.loan_amount,
              loanTermMonths: rawData.loan_term_months,
              
              // 贷款比率
              lvr: rawData.lvr,
              interestRate: rawData.interest_rate,
              defaultRate: rawData.default_rate,
              
              // 贷款周期
              commencementDate: rawData.commencement_date,
              expiryDate: rawData.expiry_date,
              expectedRecoveryDate: rawData.expected_recovery_date,
              
              // 相关主体信息
              borrower: rawData.Borrower,
              lender: rawData.Lender,
              issuer: rawData.Issuer,
              sponsor: rawData.Sponsor,
              valuer: rawData.Valuer,
              lawyer: rawData.Lawyer,
              trustee: rawData.Trustee,
              collateral: rawData.Collateral,
              
              // 合约地址
              principalTokenAddress: rawData.principal_token_address,
              interestTokenAddress: rawData.interest_token_address,
              kycRegistryAddress: rawData.kyc_registry_address,
              loanIssuerAddress: rawData.loan_issuer_address,
              tradeContractAddress: rawData.trade_contract_address,
              complianceGuardContractAddress: rawData.compliance_guard_contract_address,
              holderRegistry: rawData.Holder_Registry,
              
              // 前端显示字段
              subtitle: `${rawData.mortage_type} - ${rawData.property_type}`,         
              loanAmountFormatted: this.formatCurrency(rawData.loan_amount),
              loanTermFormatted: `${rawData.loan_term_months} months`,
              targetYield: rawData.interest_rate,
              valuation: rawData.property_value,
              
              // 原始数值用于计算
              totalOfferingRaw: rawData.total_offering_token || 0,
              subscribedRaw: rawData.subscribe_token || 0
            }
            
            // 构建与列表数据结构一致的数据结构
            this.currentProduct = {
              // 基础信息
              id: product.id,
              code: product.code,
              name: product.name,
              status: product.status,
              
              // 认购信息
              totalOffering: product.totalOffering,
              subscribed: product.subscribed,
              totalOfferingRaw: product.totalOfferingRaw,
              subscribedRaw: product.subscribedRaw,
              
              // 物业信息
              propertyLocation: product.propertyLocation,
              propertyState: product.propertyState,
              propertyType: product.propertyType,
              propertyValue: product.propertyValue,
              propertySummary: product.propertySummary,
              
              // 贷款信息
              mortgageType: product.mortgageType,
              loanAmount: product.loanAmount,
              loanTermMonths: product.loanTermMonths,
              
              // 贷款比率
              lvr: product.lvr,
              interestRate: product.interestRate,
              defaultRate: product.defaultRate,
              
              // 贷款周期
              commencementDate: product.commencementDate,
              expiryDate: product.expiryDate,
              expectedRecoveryDate: product.expectedRecoveryDate,
              
              // 相关主体信息
              borrower: product.borrower,
              lender: product.lender,
              issuer: product.issuer,
              sponsor: product.sponsor,
              valuer: product.valuer,
              lawyer: product.lawyer,
              trustee: product.trustee,
              collateral: product.collateral,
              
              // 合约地址
              principalTokenAddress: product.principalTokenAddress,
              interestTokenAddress: product.interestTokenAddress,
              kycRegistryAddress: product.kycRegistryAddress,
              loanIssuerAddress: product.loanIssuerAddress,
              tradeContractAddress: product.tradeContractAddress,
              complianceGuardContractAddress: product.complianceGuardContractAddress,
              holderRegistry: product.holderRegistry,
              
              // 前端显示字段
              subtitle: product.subtitle,
              loanAmountFormatted: product.loanAmountFormatted,
              loanTermFormatted: product.loanTermFormatted,
              targetYield: product.targetYield,
              valuation: product.valuation,
              image: product.image || this.getProductImage(product.code),
              
              // 计算指标
              metrics: {
                currentElaraPrice: this.calculateTokenPrice(product),
                collateralPropertyValue: product.valuation ? `AUD${product.valuation.toLocaleString()}` : 'TBA',
                rentalIncome: this.calculateRentalIncome(product),
                targetLoanYield: `${product.targetYield}% p.a.`
              }
            }
            
            this.lastRefreshTime = new Date()
            console.log('✅ ProjectsView: 单个产品数据加载成功:', this.currentProduct)
          } else {
            this.error = response.message || '获取产品数据失败'
            console.error('❌ ProjectsView: API返回错误:', response)
          }
        } catch (error) {
          this.error = '网络错误，无法获取产品数据'
          console.error('❌ ProjectsView: 获取单个产品数据失败:', error)
        } finally {
          this.loading = false
        }
      },
  
      async loadProducts() {
        try {
          this.loading = true
          this.error = null
          console.log('🔄 从数据库加载产品数据...')
          
          const response = await productAPI.getAllProducts()
          
          if (response.status === 0) {
            // 映射数据库字段到前端期望的字段名（与ListedProjectsView保持一致）
            this.products = (response.data || []).map(project => {
              const mappedProduct = {
                // 基础信息
                id: project.id,
                code: project.project_code,
                name: project.project_name,
                status: project.loan_status || 'UNKNOWN',
                
                // 认购信息
                totalOffering: this.formatCurrency(project.total_offering_token),
                subscribed: this.formatCurrency(project.subscribe_token),
                
                // 原始数值用于计算
                totalOfferingRaw: project.total_offering_token || 0,
                subscribedRaw: project.subscribe_token || 0,
                
                // 物业信息
                propertyLocation: project.property_location,
                propertyState: project.property_state,
                propertyType: project.property_type,
                propertyValue: project.property_value,
                propertySummary: project.property_type, // 使用property_type作为summary
                
                // 贷款信息
                mortgageType: project.mortage_type,
                loanAmount: project.loan_amount,
                loanTermMonths: project.loan_term_months,
                
                // 贷款比率
                lvr: project.lvr,
                interestRate: project.interest_rate,
                defaultRate: project.default_rate,
                
                // 贷款周期
                commencementDate: project.commencement_date,
                expiryDate: project.expiry_date,
                expectedRecoveryDate: project.expected_recovery_date,
                
                // 相关主体信息
                borrower: project.Borrower,
                lender: project.Lender,
                issuer: project.Issuer,
                sponsor: project.Sponsor,
                valuer: project.Valuer,
                lawyer: project.Lawyer,
                trustee: project.Trustee,
                collateral: project.Collateral,
                
                // 合约地址
                principalTokenAddress: project.principal_token_address,
                interestTokenAddress: project.interest_token_address,
                kycRegistryAddress: project.kyc_registry_address,
                loanIssuerAddress: project.loan_issuer_address,
                tradeContractAddress: project.trade_contract_address,
                complianceGuardContractAddress: project.compliance_guard_contract_address,
                holderRegistry: project.Holder_Registry,
                
                // 前端显示字段
                subtitle: `${project.mortage_type} - ${project.property_type}`,
                loanAmountFormatted: this.formatCurrency(project.loan_amount),
                loanTermFormatted: `${project.loan_term_months} months`,
                targetYield: project.interest_rate,
                image: project.image || this.getProductImage(project.project_code)
              }
              
              // 添加计算指标
              mappedProduct.metrics = {
                currentElaraPrice: this.calculateTokenPrice(mappedProduct),
                collateralPropertyValue: project.property_value ? `AUD${project.property_value.toLocaleString()}` : 'TBA',
                rentalIncome: this.calculateRentalIncome(mappedProduct),
                targetLoanYield: `${project.interest_rate}% p.a.`
              }
              
              return mappedProduct
            })
            this.lastRefreshTime = new Date()
            // 重置展开状态，确保每次加载数据后都是收起状态
            this.expandedProject = null
            console.log('✅ 产品数据加载成功，共', this.products.length, '个项目')
          } else {
            this.error = response.message || '获取产品数据失败'
            console.error('❌ API返回错误:', response)
          }
        } catch (error) {
          this.error = '网络错误，无法获取产品数据'
          console.error('❌ 加载产品数据失败:', error)
        } finally {
          this.loading = false
        }
      },
      
      // 刷新数据
      async refreshProducts() {
        console.log('🔄 手动刷新产品数据...')
        if (this.isDetailView) {
          await this.loadSingleProduct()
        } else {
          await this.loadProducts()
        }
      },
      
      // 设置数据库同步
      setupDatabaseSync() {
        const { subscribeProducts, subscribeNewProjects, getLastRefreshTime } = useDatabaseSync()
        
        // 订阅产品列表更新
        this.unsubscribeProducts = subscribeProducts((products) => {
          console.log('📡 ProjectsView: 收到产品数据更新，共', products.length, '个项目')
          // 映射数据库字段到前端期望的字段名
          this.products = products.map(product => ({
            ...product,
            totalOffering: product.total_token,
            subscribed: product.current_subscribed_token,
            targetYield: product.target_yield,
            ltv: product.LTV,
            annualInterestRate: product.annual_interest_rate,
            
            // 原始数值用于计算
            totalOfferingRaw: product.total_token || 0,
            subscribedRaw: product.current_subscribed_token || 0,
            loanAmount: product.loan_amount,
            valuation: product.valuation,
            image: product.image || this.getProductImage(product.code)
          }))
          this.lastRefreshTime = new Date()
        })
        
        // 订阅新项目通知
        this.unsubscribeNewProjects = subscribeNewProjects((newProjects) => {
          console.log('🆕 ProjectsView: 发现', newProjects.length, '个新项目')
          // 可以在这里添加新项目通知逻辑
          this.showNewProjectsNotification(newProjects)
        })
        
        // 设置最后刷新时间
        const lastRefresh = getLastRefreshTime()
        if (lastRefresh) {
          this.lastRefreshTime = lastRefresh
        }
      },
      
      // 清理数据库同步
      cleanupDatabaseSync() {
        if (this.unsubscribeProducts) {
          this.unsubscribeProducts()
        }
        if (this.unsubscribeNewProjects) {
          this.unsubscribeNewProjects()
        }
      },
      
      // 显示新项目通知
      showNewProjectsNotification(newProjects) {
        if (newProjects.length > 0) {
          const projectNames = newProjects.map(p => p.name).join(', ')
          console.log('🆕 发现新项目:', projectNames)
          // 可以在这里添加用户通知
        }
      },
      
      // 开始自动刷新（保留作为备用）
      startAutoRefresh() {
        // 每30秒自动刷新一次数据
        this.refreshInterval = setInterval(() => {
          console.log('🔄 自动刷新产品数据...')
          this.loadProducts()
        }, 30000) // 30秒
      },
      
      // 停止自动刷新（保留作为备用）
      stopAutoRefresh() {
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval)
          this.refreshInterval = null
          console.log('⏹️ 停止自动刷新')
        }
      },
      formatCurrency(value, currency = 'AUD') {
        if (value === null || value === undefined || value === '') return `${currency}0.00`
        const num = parseFloat(value)
        if (isNaN(num)) return `${currency}0.00`
        return `${currency}${num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
        })}`
      },
      resetFilters(){ this.filters = { q: '', type: '', risk: '', status: '', minYield: 0, maxYield: 20 } },
      
      // 监听筛选器变化
      onFilterChange() {
        console.log('筛选器变化:', this.filters)
        // 强制重新计算筛选结果
        this.$forceUpdate()
      },
      openDetail(code){
        const product = this.products.find(x => x.code === code)
        try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
        this.$router.push({ name: 'detail', params: { code: code } })
      },
      openTrade(code){
        const product = this.products.find(x => x.code === code)
        try { sessionStorage.setItem('lastProduct', JSON.stringify(product)) } catch(e) {}
        this.$router.push({ name: 'tradeProject', params: { code } })
      },
      getProgressPercentage(product) {
        if (!product) return 0
        
        // 使用原始数值进行计算
        const total = product.totalOfferingRaw || 0
        const subscribed = product.subscribedRaw || 0
        
        if (total === 0) return 0
        
        const percentage = (subscribed / total) * 100
        return Math.min(Math.round(percentage), 100)
      },
      joinWaitlist(code) {
        this.addToWatchlist(code)
      },
      registerInterest(code) {
        this.addToWatchlist(code)
      },
      
      // 添加到 watchlist
      addToWatchlist(code) {
        try {
          // 获取现有的 watchlist
          let watchlist = []
          const savedWatchlist = localStorage.getItem('projectWatchlist')
          if (savedWatchlist) {
            watchlist = JSON.parse(savedWatchlist)
          }
          
          // 检查是否已经在 watchlist 中
          if (watchlist.includes(code)) {
            alert('This Project is already in your watchlist!')
            return
          }
          
          // 添加到 watchlist
          watchlist.push(code)
          localStorage.setItem('projectWatchlist', JSON.stringify(watchlist))
          
          const product = this.products.find(x => x.code === code)
          alert(`Added ${product.name} to your watchlist!`)
          console.log('Added to watchlist:', code)
        } catch (error) {
          console.error('❌ Projects: Failed to add to watchlist:', error)
          alert('Failed to add to watchlist, please try again')
        }
      },
      
      // 格式化时间显示
      formatTime(date) {
        if (!date) return ''
        const now = new Date()
        const diff = now - date
        const minutes = Math.floor(diff / 60000)
        
        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes} minutes ago`
        
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours} hours ago`
        
        const days = Math.floor(hours / 24)
        return `${days} days ago`
      },
      
      // 获取产品图片
      getProductImage(code) {
        const imageMap = {
          'RWA001': '/pics/TYMU.png',
          'RWA002': '/pics/SQNB.png',
          'RWA003': '/pics/LZYT.png',
          'YYD': '/pics/YYD.png',
          'COMP': '/pics/TYMU.png'
        }
        return imageMap[code] || '/pics/TYMU.png'
      },
      
      // 计算代币价格
      calculateTokenPrice(product) {
        // 基于目标收益率计算代币价格
        const basePrice = 1.00
        const yieldMultiplier = (product.targetYield || 6.0) / 6.0
        const adjustedPrice = basePrice * yieldMultiplier
        return `AUD${adjustedPrice.toFixed(2)}`
      },
      
      // 计算租金收入
      calculateRentalIncome(product) {
        // 基于房产价值和收益率估算租金收入
        if (!product.valuation) return 'TBA'
        
        const valuationStr = product.valuation.replace(/[AUD,]/g, '')
        const valuation = parseFloat(valuationStr)
        const monthlyYield = (product.targetYield || 6.0) / 12 / 100
        const estimatedRental = valuation * monthlyYield
        
        return `AUD${estimatedRental.toLocaleString('en-AU', { maximumFractionDigits: 0 })} / month`
      },
  
      // 计算认购进度
      getSubscriptionProgress(product) {
        if (!product) {
          return 0
        }
        
        // 使用原始数值进行计算
        const total = product.totalOfferingRaw || 0
        const subscribed = product.subscribedRaw || 0
        
        if (total === 0) return 0
        
        const progress = (subscribed / total) * 100
        return Math.round(progress * 100) / 100 // 保留两位小数
      },
  
      // 格式化数字
      formatNumber(value) {
        if (!value) return '0'
        const num = parseFloat(value)
        if (isNaN(num)) return value
        return num.toLocaleString()
      },

      // 切换项目详情展开状态（单项目展开模式）
      toggleProjectDetails(projectCode) {
        console.log('🔄 切换项目展开状态:', projectCode, '当前展开的项目:', this.expandedProject)
        
        // 如果点击的是当前已展开的项目，则收起
        if (this.expandedProject === projectCode) {
          this.expandedProject = null
          console.log('✅ 收起项目详情:', projectCode)
        } else {
          // 否则展开当前点击的项目（自动收起其他项目）
          const previousExpanded = this.expandedProject
          this.expandedProject = projectCode
          console.log('✅ 展开项目详情:', projectCode, '之前展开的项目:', previousExpanded)
        }
      },

      // 检查项目是否已展开
      isProjectExpanded(projectCode) {
        return this.expandedProject === projectCode
      },
      
      // 滚动到主页Contact Us部分
      scrollToContactUs() {
        // 跳转到主页
        this.$router.push('/')
        
        // 等待页面加载完成后滚动到Contact Us部分
        this.$nextTick(() => {
          setTimeout(() => {
            const contactSection = document.querySelector('.contact-section')
            if (contactSection) {
              contactSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }
          }, 100)
        })
      }
    },
    computed: {
      filteredProducts(){
        const q = this.filters.q.trim().toLowerCase()
        return this.products.filter(p => {
          // ToBeListed页面：只显示INCOMING状态的项目，排除ACTIVE项目
          if (p.status !== 'INCOMING') {
            return false
          }
          
          // 搜索匹配：代码、名称、副标题
          const matchQ = !q || 
            p.code.toLowerCase().includes(q) || 
            (p.name || '').toLowerCase().includes(q) ||
            (p.subtitle || '').toLowerCase().includes(q)
          
          // 类型匹配
          const matchType = !this.filters.type || p.property_type === this.filters.type
          
          // 状态匹配
          const matchStatus = !this.filters.status || p.status === this.filters.status
          
          // EST. YIELD (IRR) 区间匹配
          const targetYield = parseFloat(p.targetYield) || 0
          const matchYield = targetYield >= this.filters.minYield && targetYield <= this.filters.maxYield
          
          // 调试输出（可以在开发时启用）
          // if (p.code === 'RWA001') {
          //   console.log(`Project ${p.code}: targetYield=${targetYield}, min=${this.filters.minYield}, max=${this.filters.maxYield}, match=${matchYield}`)
          // }
          
          return matchQ && matchType && matchStatus && matchYield
        }).sort((a, b) => {
          // 按project code升序排列
          return a.code.localeCompare(b.code)
        })
      },
      
      // 检查是否有激活的筛选条件
      hasActiveFilters() {
        return this.filters.q.trim() !== '' || 
               this.filters.type !== '' || 
               this.filters.status !== '' || 
               this.filters.minYield > 0 || 
               this.filters.maxYield < 20
      },
  
      projectData() {
        // 从ProductDetailsInfo获取项目数据（保留作为备用）
        const product = this.project
        
        if (product) {
          console.log('TradeProjectView: Retrieve project data from database:', product)
          
          // 构建符合模板需求的数据结构，完整映射ProductDetailsInfo.js中的所有字段
          return {
            // 基本信息
            code: product.code,
            name: product.name,
            image: product.image || this.getProductImage(product.code),
            subtitle: product.subtitle,
            type: product.type,
            risk: product.risk,
            targetYield: product.targetYield,
            status: product.status,
            summary: product.summary,
            
            // 投资信息
            totalOffering: product.totalOffering,
            subscribed: product.subscribed,
            totalSubscriptionTokens: product.totalSubscriptionTokens,
            subscribedTokens: product.subscribedTokens,
            
            // 计算指标
            metrics: {
              currentElaraPrice: this.calculateTokenPrice(product),
              collateralPropertyValue: product.valuation || 'TBA',
              rentalIncome: this.calculateRentalIncome(product),
              targetLoanYield: `${product.targetYield}% p.a.`
            },
            
            // Key Facts 关键信息
            loanAmount: product.loanAmount,
            annualInterestRate: product.annualInterestRate,
            loanTerm: product.loanTerm,
            ltv: product.ltv,
            drawdownDate: product.drawdownDate,
            earlyRepayment: product.earlyRepayment,
            repaymentArrangement: product.repaymentArrangement,
            
            // Parties 相关主体
            issuer: product.issuer,
            pwShareholders: product.pwShareholders,
            lender: product.lender,
            borrower: product.borrower,
            guarantor: product.guarantor,
            
            // 新增项目指标字段
            underlyingAsset: product.underlyingAsset || 'TBA',
            sponsor: product.sponsor || 'TBA',
            valuer: product.valuer || 'TBA',
            lawyer: product.lawyer || 'TBA',
            trustee: product.trustee || 'TBA',
            
            // Disbursement & Interest 放款和利息
            disbursementMethod: product.disbursementMethod,
            interest: product.interest,
            earlyRepaymentDetails: product.earlyRepaymentDetails,
            maturityDate: product.maturityDate,
            
            // Collateral 抵押品
            propertyAddress: product.propertyAddress,
            valuation: product.valuation,
            securityRank: product.securityRank,
            
            // Default & Remedies 违约和补救措施
            defaultInterestRate: product.defaultInterestRate,
            defaultTriggers: product.defaultTriggers,
            defaultProcess: product.defaultProcess,
            
            // On-Chain & Documents 链上和文档
            issuerToken: product.issuerToken,
            loanToken: product.loanToken,
            valuationReport: product.valuationReport,
            mortgageDeed: product.mortgageDeed
          }
        }
      }
    } 
  }
  </script>
  
  <style scoped>
  :root{
    --orange:#f59e0b;
    --ink:#e5e7eb;
    --paper:#0e0f1b;
    --rule:#2a2c3f;
    --muted:#9ca3af;
  }
  
  .container {
    background: 
          radial-gradient(circle at 20% 80%, rgba(51, 204, 255, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(0, 153, 204, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(25, 25, 112, 0.1) 0%, transparent 50%);
    min-height: 100vh;
    padding: 20px 130px;
    margin: 0;
    width: 100vw;
    max-width: none;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
  }
  
  .project-container{
    min-height: 100vh;
    padding: 0;
    margin: 0;
    width: 100%;
    max-width: none;
  }
  
  .doc-header{
    border-bottom: 1px solid var(--rule);
    padding-bottom: 10px;
    margin-bottom: 16px;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
  }
  
  .header-text {
    flex: 1;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
  }
  
  .contact-us-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .contact-us-btn:hover {
    background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  
  .contact-us-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  .headline {
    color: var(--heading-color) !important;
    margin: 0 0 6px 0;
  }
  .subline{
    margin: 0;
    color: var(--muted);
    font-size: 14px;
  }
  
  .filters {
    background: transparent;
    padding: 16px 0;
    border: none;
    margin-bottom: 20px;
  }
  .filters .input {
    background: #141426;
    border: 1px solid #374151;
    color: #ffffff;
  }
  .filters .input::placeholder { color: #9ca3af; }
  .filters .btn {
    background: #374151;
    border: 1px solid #4b5563;
    color: #ffffff;
  }
  .filters .btn:hover { background: #4b5563; }
  
  /* 收益率区间滑块样式 */
  .yield-range-filter {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
  }
  
  .yield-range-label {
    font-size: 12px;
    color: #9ca3af;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .yield-range-container {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 25px;
  }
  
  .yield-range-display {
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
    white-space: nowrap;
    padding: 0;
  }
  
  .yield-range-slider {
    position: relative;
    height: 20px;
    background: #374151;
    border-radius: 10px;
    padding: 0 10px;
    flex: 1;
    max-width: 200px;
  }
  
  .yield-slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: transparent;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
  }
  
  .yield-slider::-webkit-slider-track {
    width: 100%;
    height: 4px;
    background: #4b5563;
    border-radius: 2px;
    border: none;
  }
  
  .yield-slider::-moz-range-track {
    width: 100%;
    height: 4px;
    background: #4b5563;
    border-radius: 2px;
    border: none;
  }
  
  .yield-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }
  
  .yield-slider::-webkit-slider-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
  
  .yield-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }
  
  .yield-slider::-moz-range-thumb:hover {
    background: #2563eb;
    transform: scale(1.1);
  }
  
  .yield-slider-min::-webkit-slider-thumb {
    background: #242524;
  }
  
  .yield-slider-min::-webkit-slider-thumb:hover {
    background: #242524;
  }
  
  .yield-slider-min::-moz-range-thumb {
    background: #242524;
  }
  
  .yield-slider-min::-moz-range-thumb:hover {
    background: #242524;
  }
  
  .yield-slider-max::-webkit-slider-thumb {
    background: #09740f;
  }
  
  .yield-slider-max::-webkit-slider-thumb:hover {
    background: #09740f;
  }
  
  .yield-slider-max::-moz-range-thumb {
    background: #09740f;
  }
  
  .yield-slider-max::-moz-range-thumb:hover {
    background: #09740f;
  }
  
  .refresh-btn:hover:not(:disabled) { 
    background: #4b5563 !important; 
    border-color: #6b7280 !important; 
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    color: var(--muted);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #374151;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
  }
  
  .error-message {
    text-align: center;
    color: var(--muted);
  }
  
  .error-message h3 {
    color: #ef4444;
    margin-bottom: 8px;
  }
  
  .retry-btn {
    background: #ef4444;
    border: 1px solid #ef4444;
    color: #ffffff;
    margin-top: 12px;
  }
  
  .retry-btn:hover {
    background: #dc2626;
    border-color: #dc2626;
  }
  
  .doc-list{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
  
  /* 新的项目卡片样式 */
  .pf-project-card{
    width:100%;
    padding:16px;
    border-radius:12px;
    background: var(--card-bg);
    border:1px solid var(--border);
    box-shadow: var(--shadow);
  }
  
  .pf-project-header{display:flex;align-items:center;gap:12px;margin-bottom:12px;}
  .pf-project-image{width:40px;height:40px;border-radius:8px;}
  .pf-project-info{flex:1;}
  .pf-title-row{display:flex;justify-content:space-between;align-items:center;gap:12px;}
  .pf-project-info h4{margin:0;font-size:16px;font-weight:700;color: var(--text);flex:1;}
  .pf-project-info p{margin:4px 0 0 0;font-size:12px;color: var(--text-secondary);}
  .pf-title-btn{padding:6px 12px;font-size:12px;white-space:nowrap;}
  
  .pf-project-metrics{margin-bottom:16px;}
  .pf-project-metric{display:flex;justify-content:space-between;align-items:center;padding:4px 0;}
  .pf-metric-label{font-size:12px;color: var(--text-secondary);}
  .pf-metric-value{font-size:14px;font-weight:600;color: var(--text);}
  .pf-metric-value.risk-low{color:#16a34a;}
  .pf-metric-value.risk-medium{color:#d97706;}
  .pf-metric-value.risk-high{color:#dc2626;}

  /* 新增项目指标样式 */
  .pf-project-metrics-new{
    margin-top:12px;
    padding-top:12px;
    border-top:1px solid rgba(255,255,255,0.1);
  }
  .pf-project-metrics-new .pf-project-metric{
    padding:6px 0;
  }
  .pf-project-metrics-new .pf-metric-label{
    font-size:11px;
    color: var(--text-secondary);
  }
  .pf-project-metrics-new .pf-metric-value{
    font-size:13px;
    color: var(--text);
  }
  
  /* 投资进度信息样式 */
  .pf-investment-progress{
    margin-bottom:16px;
    padding:16px;
    background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.1);
    border-radius:12px;
  }

  /* 浅色主题下的投资进度样式 */
  [data-theme="light"] .pf-investment-progress{
    background: #f3f4f6;
    border: 1px solid #d1d5db;
  }
  
  .pf-progress-metrics{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:12px;
    margin-bottom:16px;
    align-items:stretch;
    text-align:justify;
  }
  
  .pf-progress-metric{
    width:100%;
    display:flex;
    flex-direction:column;
    align-items:stretch;
    text-align:justify;
    margin-left:30px;
  }
  
  .pf-progress-label{
    font-size:10px;
    color: var(--text-secondary);
    text-transform:uppercase;
    letter-spacing:0.5px;
    margin-bottom:4px;
    margin-left:15px;
  }
  
  .pf-progress-value{
    font-size:14px;
    font-weight:700;
    color: var(--text);
  }
  
  .pf-progress-bar-container{
    margin-top:12px;
  }
  
  .pf-progress-bar{
    width:100%;
    height:6px;
    background:var(--border-light);
    border-radius:3px;
    overflow:hidden;
    margin-bottom:8px;
  }
  
  .pf-progress-fill{
    height:100%;
    background:linear-gradient(90deg,#10b981,#059669);
    border-radius:3px;
    transition:width 0.5s ease;
  }

  /* 浅色主题下的进度条颜色 */
  [data-theme="light"] .pf-progress-fill{
    background:linear-gradient(90deg,#059669,#047857);
  }
  
  .pf-progress-text{
    text-align:center;
    font-size:12px;
    font-weight:600;
    color:#10b981;
  }

  /* 浅色主题下的进度文字颜色 */
  [data-theme="light"] .pf-progress-text{
    color:#059669;
  }
  
  .pf-project-actions{display:flex;gap:8px;flex-wrap:wrap;}
  .pf-project-btn{padding:8px 16px;border-radius:8px;border:1px solid #374151;background:#1f2937;color:#ffffff;cursor:pointer;font-size:14px;font-weight:600;transition:all 0.2s ease;}
  .pf-project-btn:hover{background:#d97706;}
    .pf-project-btn-secondary{background:var(--primary);color:#fff;border-color:var(--primary);}
    .pf-project-btn-secondary:hover{background:var(--primary-ink);}
    
    /* 浅色主题下的详情按钮样式 */
    [data-theme="light"] .pf-project-btn-secondary{
      background: #ffffff;
      color: #374151;
      border-color: #374151;
    }
    [data-theme="light"] .pf-project-btn-secondary:hover{
      background: #f3f4f6;
      color: #374151;
      border-color: #374151;
    }
    .pf-project-btn-interest{background:#dc2626;color:#fff;border-color:#dc2626;}
  .pf-project-btn-interest:hover{background:#b91c1c;}
  
  /* 保留原有的doc-card样式作为备用 */
  .doc-card{
    background: #141426;
    border: 1px solid var(--rule);
    border-radius: 14px;
    padding: 18px;
    color: var(--ink);
    box-shadow: 0 6px 18px rgba(0,0,0,.25);
  }
  
  /* 项目基本信息样式 */
  .project-basic-info{
    display: flex;
    gap: 16px;
    margin-top: 12px;
    flex-wrap: wrap;
  }
  
  .info-item{
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .info-label{
    font-size: 12px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .info-value{
    font-size: 14px;
    color: #828386;
    font-weight: 600;
  }
  
  .info-value.risk-low{
    color: #059669;
  }
  
  .info-value.risk-medium{
    color: #d97706;
  }
  
  .info-value.risk-high{
    color: #dc2626;
  }
  
  .main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    align-items: start;
  }
  
  .left-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .title-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }
  
  .title-section h2 {
    margin: 0;
    font-size: 20px;
    color: #fff;
    letter-spacing: .2px;
    flex: 1;
  }
  
  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  
  .status-ACTIVE {
    background: rgba(16, 185, 129, 0.2);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
  }
  
  .status-INCOMING {
    background: rgba(59, 130, 246, 0.2);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
  
  .status-PERFORMING {
    background: rgba(245, 158, 11, 0.2);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  
  .status-COMPLETED {
    background: rgba(107, 128, 107, 0.2);
    color: #6b7280;
    border: 1px solid rgba(107, 114, 128, 0.3);
  }
  
  .status-COMPLETE {
    background: rgba(107, 128, 107, 0.2);
    color: #6b7280;
    border: 1px solid rgba(107, 114, 128, 0.3);
  }
  
  .status-DEFAULT {
    background: rgba(139, 92, 246, 0.2);
    color: #8b5cf6;
    border: 1px solid rgba(139, 92, 246, 0.3);
  }
  
  .doc-code {
    display: inline-block;
    padding: 2px 8px;
    border: 1px solid var(--rule);
    border-radius: 999px;
    margin-right: 8px;
    font-size: 13px;
    color: var(--muted);
  }
  
  .doc-name { 
    font-weight: 700;
  }
  
  .doc-subtitle {
    margin: 6px 0 0 0;
    color: var(--muted);
    font-size: 14px;
  }
  
  .summary-section {
    margin: 6px 0 2px;
  }
  
  
  .doc-cover {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    border: 1px solid var(--rule);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .sep{
    border: none;
    border-top: 1px dashed var(--rule);
    margin: 14px 0;
  }
  
  .doc-section{ margin: 6px 0 2px; }
  .doc-h3{
    margin: 0 0 8px 0;
    color: #eaeaf0;
    font-size: 14px;
    letter-spacing: .2px;
    text-transform: uppercase;
  }
  .doc-text{
    margin: 0;
    color: var(--ink);
    line-height: 1.6;
  }
  
  .investment-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 8px;
  }
  
  .investment-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .investment-label {
    font-size: 12px;
    color: var(--muted);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .investment-value {
    font-size: 14px;
    color: #fff;
    font-weight: 600;
  }
  
  
  .progress-actions-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--rule);
  }
  
  .progress-actions-row .progress-container {
    flex: 1;
    margin-top: 0;
  }
  
  .progress-actions-row .doc-actions {
    display: flex;
    gap: 12px;
    margin: 0;
  }
  
  .progress-container {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
  }
  
  .progress-bar {
    flex: 1;
    height: 8px;
    background: transparent;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    display: flex;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    transition: width 0.3s ease;
  }
  
  .progress-empty {
    height: 100%;
    background: #374151;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    color: #10b981;
    font-weight: 600;
    font-size: 13px;
    min-width: 35px;
    text-align: right;
  }
  
  .doc-actions{
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
  .btn.small {
    color: #ffffff !important;
    background: #1f2937;
    border: 1px solid #374151;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  .btn.small:hover { background: #374151; border-color: #4b5563; }
  .btn.small.orange { color:#fff !important; background:#f97316; border-color:#f97316; }
  .btn.small.orange:hover { background:#ea580c; border-color:#ea580c; }
  
  @media (max-width: 1400px){
    .doc-list {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (max-width: 980px){
    .main-content {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    
    .doc-cover {
      width: 200px;
      height: 140px;
    }
  }
  
  
  @media (max-width: 768px){
    .doc-list {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 16px;
    }
    
    .pf-project-card {
      padding: 16px;
      width: 100%;
    }
    
    .pf-project-header {
      flex-direction: column;
      text-align: center;
      gap: 12px;
    }
    
    .pf-title-row {
      flex-direction: column;
      gap: 8px;
    }
    
    .pf-title-btn {
      width: 100%;
      padding: 8px 16px;
      font-size: 14px;
    }
    
    .pf-project-image {
      width: 80px;
      height: 80px;
      margin: 0 auto;
    }
    
    .pf-project-metrics {
      gap: 12px;
      margin: 16px 0;
    }
    
    .pf-project-metrics-new {
      margin-top: 8px;
      padding-top: 8px;
    }
    
    .pf-progress-metrics {
      grid-template-columns: 1fr 1fr; /* 移动端也保持两列布局 */
      gap: 8px;
    }
    
    .pf-investment-progress {
      padding: 12px;
    }
    
    .investment-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    
    .progress-actions-row {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }
    
    .progress-actions-row .progress-container {
      order: 1;
    }
    
    .progress-actions-row .doc-actions {
      order: 2;
      justify-content: center;
    }
  }
  
  @media (max-width: 640px){
    .header-content {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }
    
    .header-actions {
      justify-content: center;
    }
    
    .contact-us-btn {
      width: 100%;
      max-width: 200px;
      margin: 0 auto;
    }
    
    .doc-list {
      grid-template-columns: 1fr;
      padding: 12px;
      gap: 12px;
    }
    
    .pf-project-card {
      padding: 12px;
    }
    
    .pf-project-metrics {
      gap: 8px;
    }
    
    .pf-project-metric {
      padding: 8px;
    }
    
    .pf-project-metrics-new {
      margin-top: 6px;
      padding-top: 6px;
    }
    
    .pf-project-metrics-new .pf-project-metric {
      padding: 4px 0;
    }
    
    .pf-progress-metrics {
      grid-template-columns: 1fr 1fr; /* 超小屏幕也保持两列布局 */
      gap: 6px;
    }
    
    .pf-investment-progress {
      padding: 10px;
    }
    
    .pf-progress-label {
      font-size: 9px;
    }
    
    .pf-progress-value {
      font-size: 12px;
    }
    
    .pf-project-actions {
      flex-direction: column;
      gap: 8px;
    }
    
    .pf-project-btn {
      width: 100%;
      text-align: center;
    }
    
    .investment-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    
    .investment-label {
      font-size: 11px;
    }
    
    .investment-value {
      font-size: 13px;
    }
    
    .main-content {
      gap: 12px;
    }
    
    .doc-cover {
      width: 100%;
      height: 120px;
    }
    
    .yield-range-filter {
      min-width: 150px;
    }
    
    .yield-range-display {
      font-size: 12px;
      padding: 0;
    }
    
    .yield-slider::-webkit-slider-thumb {
      width: 16px;
      height: 16px;
    }
    
    .yield-slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
    }
    
    .title-section h2 {
      font-size: 18px;
    }
    
    .doc-subtitle {
      font-size: 13px;
    }
  }

/* 展开/收起功能样式 */
.pf-expand-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: var(--card-subtle);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.pf-expand-toggle:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
}

.expand-text {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.expand-icon {
  font-size: 12px;
  color: #9ca3af;
  transition: transform 0.3s ease;
  transform: rotate(0deg);
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.pf-expandable-content {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: all 0.3s ease;
}

.pf-expandable-content.expanded {
  max-height: 500px;
  opacity: 1;
  margin-top: 12px;
}

/* Etherscan链接样式 */
.pf-etherscan-link {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.etherscan-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  color: #60a5fa;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.etherscan-link:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
  color: #93c5fd;
  text-decoration: none;
}

.etherscan-icon {
  font-size: 16px;
}

.etherscan-text {
  font-size: 14px;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .pf-etherscan-link {
    margin-top: 12px;
    padding-top: 0px;
  }
  
  .etherscan-link {
    padding: 6px 10px;
    font-size: 13px;
  }
  
  .etherscan-icon {
    font-size: 14px;
  }
  
  .etherscan-text {
    font-size: 13px;
  }

  /* 移动端展开功能样式 */
  .pf-expand-toggle {
    margin-top: 8px;
    padding: 6px 10px;
  }

  .expand-text {
    font-size: 11px;
  }

  .expand-icon {
    font-size: 11px;
  }

  .pf-expandable-content.expanded {
    margin-top: 8px;
  }
}
  </style>
  