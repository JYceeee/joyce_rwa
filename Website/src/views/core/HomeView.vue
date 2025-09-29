<template>
  <!--Homepage-->
  <section class="container hero">
    <div class="grid">
      <div>
        <h1 class="headline">Invest in RWA Property Loans with Monthly Returns</h1>
        <p class="sub">
          We are the RWA dealmaker who is good at originating real estate assets as RWA underlying assets that investors like
        </p>
        <p class="foot">By continuing, you agree to our Terms and acknowledge our 
          <a href="/src/components/privacypolicy.vue" >Privacy Policy.</a></p>
      </div>
        <!-- 区块链智能合约交易动态图样 -->
         <video autoplay loop muted playsinline class="bg-video">
           <source src="/videos/Blockchainvideo.mp4" type="video/mp4">
         </video>

    </div>
  </section>

  <!--New Listing-->
  <section class="section">
    <div class="cards" aria-label="Highlights">
      <div class="new-listings-section">
        <h1>New Listing</h1></div>
      <div class="container">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading project data...</p>
        </div>
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
            <div class="error-icon">⚠️</div>
            <h4 class="error-title">Loading failed</h4>
            <p class="error-description">{{ error }}</p>
            <button class="btn-primary" @click="loadProducts">
              Reload
            </button>
        </div>
        <!-- 项目卡片容器 -->
        <div v-else-if="upcomingProjects.length > 0" class="projects-grid">
          <article 
            v-for="(project, index) in upcomingProjects" 
            :key="project.code" 
            class="listing-card"
            :aria-labelledby="`listing-title-${index}`"
          >
          <!-- 卡片头部 -->
          <div class="card-header">
            <h4 class="project-name">{{ project.code }} • {{ project.name }}</h4>
            <!-- <h3 :id="`listing-title-${index}`" class="card-title">New Listing</h3> -->
            <div class="status-badge" :class="getStatusClass(project.status)">{{ getStatusText(project.status) }}</div>
          </div>
          
          <!-- 卡片内容 -->
          <div class="card-content">
            <!-- 项目详情 -->
            <div class="project-details">
              <div class="detail-item">
                <span class="detail-label">LOAN SIZE</span>
                <span class="detail-value">{{ project.loanAmount }}</span></div>
              <div class="detail-item">
                <span class="detail-label">EST. YIELD (IRR)</span>
                <span class="detail-value highlight">{{ project.targetYield }}%</span></div>
              <div class="detail-item">
                <span class="detail-label">TERM</span>
                <span class="detail-value">{{ project.loanTerm }}</span></div>
              <div class="detail-item">
                <span class="detail-label">STATUS</span>
                <span class="detail-value status">{{ getStatusText(project.status) }}</span></div>
            </div>
            <!-- 卡片操作按钮 -->
            <div class="card-actions">
              <button class="btn-primary" @click="viewProjectDetails(project.code)">
                VIEW DETAILS
              </button>
              <button class="btn-secondary" @click="addToWatchlist(project.code)">
                ADD TO WATCHLIST
              </button>
            </div>
          </div>
          </article>
        </div>
        <!-- 空状态 -->
        <div v-if="!loading && !error && upcomingProjects.length === 0" class="empty-state">
          <!-- <div class="empty-icon">📋</div> -->
          <h4 class="empty-title">No upcoming projects at the moment</h4>
          <p class="empty-description">Check back soon for new opportunities</p>
          <button class="btn-primary" @click="refreshListings">
            REFRESH LISTINGS
          </button>
        </div>
      </div>
      <!-- 查看所有项目按钮 -->
      <div v-if="!loading && !error && upcomingProjects.length > 0" class="view-all-section">
        <button class="view-all-projects btn-outline" @click.prevent="go('/projects')">
          VIEW ALL PROJECTS
        </button>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="page-header">
      <h1>Contact Us</h1>
      <p class="page-subtitle">We are happy to help you</p>
    </div>

    <div class="contact-content">
      <div class="contact-grid">

        <!-- Contact Information -->
        <div class="contact-info">
          <h2>Contact Information</h2>
          <div class="contact-methods">
            <div class="contact-method">
              <div class="method-icon">📧</div>
              <div class="method-details">
                <h4>Email</h4>
                <p>support@mortgagerwa.com</p>
                <p>business@mortgagerwa.com</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">📞</div>
              <div class="method-details">
                <h4>Phone</h4>
                <p>+61 2 1234 5678</p>
                <p>Monday to Friday 9:00-18:00</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">📍</div>
              <div class="method-details">
                <h4>Address</h4>
                <p>123 George Street</p>
                <p>Sydney NSW 2000, Australia</p>
              </div>
            </div>

            <div class="contact-method">
              <div class="method-icon">💬</div>
              <div class="method-details">
                <h4>Online Customer Service</h4>
                <p>24/7 Online Support</p>
                <p>Average Response Time < 5 minutes</p>
              </div>
            </div>
          </div>

          <div class="social-links">
            <h3>Follow Us</h3>
            <div class="social-icons">
              <a href="#" class="social-icon">🐦</a>
              <a href="#" class="social-icon">💼</a>
              <a href="#" class="social-icon">📘</a>
              <a href="#" class="social-icon">🐙</a>
            </div>
          </div>
        </div>
        
        <!-- Send Message -->
        <div class="contact-form">
          <h2>Send Message</h2>
          <form @submit.prevent="submitForm" class="form-container">
            <div class="form-fields">
              <div class="form-group">
                <label for="name">Your Name *</label>
                <input type="text" id="name" v-model="form.name" required>
              </div>

              <div class="form-group">
                <label for="email">Your Email *</label>
                <input type="email" id="email" v-model="form.email" required>
              </div>

              <div class="form-group">
                <label for="subject">Subject *</label>
                <select id="subject" v-model="form.subject" required>
                  <option value="">Please select a subject</option>
                  <option value="investor">I am an Investor/I am interested in investing</option>
                  <option value="asset_holder">I am an Asset Holder/I am interested in holding assets</option>
                  <option value="general">I need General Consultation</option>
                  <option value="technical">I need Technical Support</option>
                  <option value="business">I would like to have a Business Cooperation</option>
                  <option value="other">Others</option>
                </select>
              </div>

              <div class="form-group">
                <label for="message">Message Content *</label>
                <textarea id="message" v-model="form.message" rows="5" required></textarea>
              </div>
            </div>

            <div class="form-submit">
              <button type="submit" class="btn primary" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { productAPI } from '@/service/api.ts'
import { useDatabaseSync } from '@/service/databaseSyncService.js'

export default {
  name: 'HomeView',
  components: {
  },
  emits: ['notify'],
  data() {
    return {
      products: [],
      loading: false,
      error: null,
      // Contact form data
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      isSubmitting: false
    }
  },
  computed: {
    // 获取upcoming状态的项目，按project code升序排列
    upcomingProjects() {
      return this.products
        .filter(product => product.status === 'upcoming')
        .sort((a, b) => {
          // 按project code升序排列
          return a.code.localeCompare(b.code)
        })
    },
    // 获取最新的upcoming项目作为New Listing
    newListingProject() {
      return this.upcomingProjects.length > 0 ? this.upcomingProjects[0] : null
    }
  },
  methods: { 
    notify(msg){ this.$emit('notify', msg) },
    
    // 从数据库加载产品数据
    async loadProducts() {
      this.loading = true
      this.error = null
      
      try {
        console.log('HomeView: 从数据库加载产品数据...')
        const response = await productAPI.getAllProducts()
        
        if (response.status === 0) {
          this.products = response.data || []
          console.log('HomeView: 成功加载', this.products.length, '个产品')
          console.log('HomeView: Upcoming项目:', this.upcomingProjects)
        } else {
          this.error = response.message || '加载产品数据失败'
          console.error('HomeView: 加载产品数据失败:', this.error)
          this.notify('加载产品数据失败: ' + this.error)
        }
      } catch (error) {
        this.error = error.message || '网络错误'
        console.error('HomeView: 加载产品数据异常:', error)
        this.notify('加载产品数据异常: ' + this.error)
      } finally {
        this.loading = false
      }
    },
    
    // 设置数据库同步
    setupDatabaseSync() {
      const { subscribeProducts, subscribeNewProjects } = useDatabaseSync()
      
      // 订阅产品列表更新
      this.unsubscribeProducts = subscribeProducts((products) => {
        console.log('🔄 HomeView: 收到产品数据更新，共', products.length, '个项目')
        this.products = products
        
        // 检查是否有新的upcoming项目
        const newUpcomingProjects = products.filter(product => 
          product.status === 'upcoming' && 
          !this.products.some(existing => existing.code === product.code)
        )
        
        if (newUpcomingProjects.length > 0) {
          console.log('🆕 HomeView: 发现', newUpcomingProjects.length, '个新的upcoming项目')
          this.notify(`发现 ${newUpcomingProjects.length} 个新项目`)
        }
      })
      
      // 订阅新项目通知
      this.unsubscribeNewProjects = subscribeNewProjects((newProjects) => {
        console.log('🆕 HomeView: 收到新项目通知:', newProjects)
        this.notify(`新增 ${newProjects.length} 个项目`)
      })
    },
    getStatusText(status) {
      const statusMap = {
        'active': 'Active',
        'upcoming': 'Upcoming',
        'research': 'Research',
        'planning': 'Planning',
        'completed': 'Completed'
      }
      return statusMap[status] || 'Unknown'
    },
    getStatusClass(status) {
      const classMap = {
        'active': 'status-active',
        'upcoming': 'status-upcoming',
        'research': 'status-research',
        'planning': 'status-planning',
        'completed': 'status-completed'
      }
      return classMap[status] || 'status-unknown'
    },
    viewProjectDetails(projectCode) {
      // 跳转到项目详情页面
      this.$router.push(`/detail/${projectCode}`)
    },
    addToWatchlist(projectCode) {
      // 添加到关注列表
      this.notify(`Added ${projectCode} to watchlist`)
      console.log('Added to watchlist:', projectCode)
    },
    refreshListings() {
      // 刷新项目列表
      this.notify('Refreshing listings...')
      console.log('🔄 Refreshing listings...')
      // 这里可以添加实际的刷新逻辑
    },
    viewAllProjects() {
      // 跳转到项目列表页面
      this.$router.push('/projects')
    },
    formatNumber(number) {
      // 格式化数字显示
      if (!number) return '0'
      return new Intl.NumberFormat('en-US').format(number)
    },
    
    // 处理钱包活动更新
    handleWalletActivityUpdate(activity) {
      console.log('🏠 HomeView: Received wallet activity update:', activity)
      // 这里可以添加处理钱包活动更新的逻辑
    },
    
    // 处理联系表单提交
    async submitForm() {
      if (this.isSubmitting) return
      
      // 验证必填字段
      if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
        alert('Please fill in all required fields')
        return
      }
      
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.form.email)) {
        alert('Please enter a valid email address')
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 这里可以添加实际的表单提交逻辑
        // 例如发送到后端API
        console.log('Submit contact form:', this.form)
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 显示成功消息
        alert('Message sent successfully! We will reply to you as soon as possible.')
        
        // 重置表单
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
        
      } catch (error) {
        console.error('Form submission failed:', error)
        alert('Message sending failed, please try again later.')
      } finally {
        this.isSubmitting = false
      }
    }
  },
  async mounted() {
    // 设置数据库同步
    this.setupDatabaseSync()
    
    // 加载产品数据
    await this.loadProducts()
    
    // 测试数据关联
    console.log('🏠 HomeView: Loaded product data:', this.products.length, 'projects')
    console.log('📋 HomeView: Upcoming项目:', this.upcomingProjects)
    console.log('🆕 HomeView: New Listing项目:', this.newListingProject)
    
    if (this.newListingProject) {
      console.log('✅ HomeView: Project Details of New Listing:', {
        code: this.newListingProject.code,
        name: this.newListingProject.name,
        loanAmount: this.newListingProject.loanAmount,
        targetYield: this.newListingProject.targetYield,
        loanTerm: this.newListingProject.loanTerm,
        status: this.newListingProject.status
      })
    } else {
      console.log('ℹ️ HomeView: No upcoming project')
    }
    
    // 监听钱包活动更新事件
    this.$root.$on('walletActivityUpdated', this.handleWalletActivityUpdate)
  },
  beforeUnmount() {
    // 清理数据库同步订阅
    if (this.unsubscribeProducts) {
      this.unsubscribeProducts()
    }
    if (this.unsubscribeNewProjects) {
      this.unsubscribeNewProjects()
    }
    
    // 清理事件监听
    this.$root.$off('walletActivityUpdated', this.handleWalletActivityUpdate)
  }
}
</script>

<style scoped>
.section{
  margin: 0;
  padding: 0;
  background: 
        radial-gradient(circle at 20% 80%, rgba(51, 204, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0, 153, 204, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(25, 25, 112, 0.1) 0%, transparent 50%);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
/* Hero section 深色背景样式 */
.hero.container {
  max-width: none; /* 覆盖全局container的max-width限制 */
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  min-height: 100vh; /* 全屏高度 */
  height: 100vh;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
    background: 
      radial-gradient(circle at 20% 80%, rgba(51, 204, 255, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 153, 204, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(25, 25, 112, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.hero .grid {
  position: relative;
  z-index: 1;
}

.hero .headline {
  color: #ffffff;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 45px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-left:100px;
  width:700px;
}

.hero .sub {
  color: #e0e0e0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 650px;
  margin-left:100px;
}

.hero .foot{
  margin-left:100px;
}

.hero-image {
  width: 100%;
  max-width: 600px;
  height: auto;
  border-radius: 16px;
  /* box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); */
  transition: transform 0.3s ease;
}

/* .hero-image:hover {
  transform: scale(1.02);
} */

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 16px;
  object-fit: cover;
}

/* Hero Image 响应式设计 */
@media (max-width: 768px) {
  .hero-image {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .hero .headline {
    margin-left: 0;
    width: 100%;
    font-size: 36px;
  }
  
  .hero .sub {
    margin-left: 0;
  }
  
  .hero .foot {
    margin-left: 0;
  }
  
  .blockchain-live-visual {
    height: 100vh;
  }
  
  .bg-video {
    min-width: 100%;
    min-height: 100%;
  }
}

@media (max-width: 480px) {
  .hero-image {
    max-width: 100%;
    border-radius: 12px;
  }
  
  .hero-image img {
    border-radius: 12px;
  }
  
  .hero .headline {
    font-size: 28px;
    text-align: center;
  }
  
  .hero .sub {
    text-align: center;
  }
  
  .blockchain-live-visual {
    height: 100vh;
  }
  
  .bg-video {
    min-width: 100%;
    min-height: 100%;
  }
}

.hero .card {
  background: rgba(20, 20, 38, 0.8);
  backdrop-filter: blur(10px);
    border: 1px solid rgba(51, 204, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero .card h3 {
  color: #ffffff;
}

.hero .li {
  color: #d0d0d0;
}

.hero .check svg {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.blockchain-live-visual {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: -1;
  border-radius: 0; /* 移除圆角，完全覆盖 */
} 


/* 重新设计的New Listing卡片样式 */
.new-listings-section {
  margin-top:30px;
  margin-left: 200px;
  font-family: Georgia, 'Times New Roman', Times, serif;
  font-size: 40px;
  padding: 0;
  position: relative;
  overflow: hidden;
  min-height: 10vh;
  width: 100vw;
  max-width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-listings-section h1 {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #ffffff;
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.new-listings-section .container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 100px 100px;
  padding: 0 20px;
}

/* 项目网格布局 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.listing-card {
  width: 100%;
  background: linear-gradient(145deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(51, 204, 255, 0.2);
    border: 1px solid rgba(51, 204, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.listing-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #33CCFF, #0099CC, #33CCFF);
  border-radius: 20px 20px 0 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(10, 15, 25, 0.2);
}

.card-title {
  color: #ffffff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.status-badge.inactive {
  background: linear-gradient(135deg, #6b7280, #4b5563);
  color: #d1d5db;
}

.status-badge.upcoming {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.card-content {
  color: #e5e7eb;
}

.project-info {
  margin-bottom: 24px;
}

.project-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.project-description {
  color: #9ca3af;
  font-size: 14px;
  margin: 0;
  line-height: 1;
}

.project-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  color: #9ca3af;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.detail-value.highlight {
  color: #10b981;
  font-size: 18px;
}

.detail-value.status {
  color: #f59e0b;
}

.card-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-primary {
  background: rgb(21, 32, 53);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(10, 15, 25, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(10, 15, 25, 0.4);
  background: rgb(15, 20, 30);
}

.btn-secondary {
  background: transparent;
  color: #33CCFF;
  border: 2px solid rgba(51, 204, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(51, 204, 255, 0.1);
  border-color: rgba(51, 204, 255, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .new-listings-section {
    padding: 40px 0;
  }
  
  .new-listings-section h1 {
    position: static;
    text-align: center;
    margin-bottom: 20px;
    font-size: 28px;
  }
  
  .new-listings-section .container {
    padding: 0 16px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    max-width: 500px;
  }
  
  .listing-card {
    width: 100%;
    padding: 24px;
  }
  
  .card-title {
    font-size: 20px;
  }
  
  .project-name {
    font-size: 18px;
  }
  
  .project-details {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .card-actions {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .new-listings-section h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .projects-grid {
    gap: 16px;
  }
  
  .listing-card {
    padding: 20px;
  }
  
  .card-title {
    font-size: 18px;
  }
  
  .project-name {
    font-size: 16px;
  }
  
  .detail-value {
    font-size: 14px;
  }
  
  .detail-value.highlight {
    font-size: 16px;
  }
}

/* 财务信息网格 */
.financial-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.financial-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.financial-label {
  font-size: 12px;
  font-weight: 600;
  color: #8ca0c3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.financial-value {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.financial-value.yield {
  color: #16a34a;
  text-shadow: 0 0 8px rgba(22, 163, 74, 0.3);
}

.financial-value.status {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 12px;
  text-align: center;
  display: inline-block;
  width: fit-content;
}

.status-active {
  background: rgba(22, 163, 74, 0.2);
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.3);
}

.status-upcoming {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-research {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-planning {
  background: rgba(147, 51, 234, 0.2);
  color: #9333ea;
  border: 1px solid rgba(147, 51, 234, 0.3);
}

.status-completed {
  background: rgba(107, 114, 128, 0.2);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

/* 操作按钮 */
.listing-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {/**view details */
  flex: 1;
  padding: 12px 20px;
  background: rgb(51, 96, 187);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(10, 15, 25, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(10, 15, 25, 0.4);
  background: rgb(19, 38, 77);
}

.btn-secondary { /**add to watchlist */
  flex: 1;
  padding: 12px 20px;
  background: rgb(122, 124, 140);
  color: #e0e0e0;
  border: 1px solid rgba(43, 49, 59, 0.3);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  border-color: rgba(51, 204, 255, 0.6);
  background: rgba(51, 204, 255, 0.1);
  color: #ffffff;
}

/* 项目列表样式 */
.projects-header {
  margin-bottom: 24px;
  text-align: center;
  width:300px;
}

.projects-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  width:400px;
  
}

.projects-subtitle {
  font-size: 14px;
  color: #8ca0c3;
  margin: 0;
  line-height: 1.5;
  width:400px;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
  width:400px;
}

.wallet-grid {
  background: #0a0a1a;
  border-radius: 16px;
  padding: 32px 24px;
}
.section.wallet {
  background: #0A0A19;
}

.input{
  background: #242435;
}

.card{
  max-height: 280px;
}

/* 自定义滚动条 */
.projects-list::-webkit-scrollbar {
  width: 6px;
}

.projects-list::-webkit-scrollbar-track {
  background: rgba(51, 204, 255, 0.1);
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb {
  background: rgba(10, 15, 25, 0.3);
  border-radius: 3px;
}

.projects-list::-webkit-scrollbar-thumb:hover {
  background: rgba(10, 15, 25, 0.5);
}

.project-card {
  background: rgba(20, 20, 40, 0.6);
    border: 1px solid rgba(51, 204, 255, 0.2);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  border-color: rgba(51, 204, 255, 0.4);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.project-info {
  flex: 1;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.project-subtitle {
  font-size: 12px;
  color: #8ca0c3;
  margin: 0;
  line-height: 1.4;
}

.project-status {
  flex-shrink: 0;
  margin-left: 12px;
}

.project-financials {
  margin-bottom: 16px;
}

.financial-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 8px;
}

.financial-row:last-child {
  margin-bottom: 0;
}

.financial-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.financial-label {
  font-size: 10px;
  font-weight: 600;
  color: #8ca0c3;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.financial-value {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.financial-value.yield {
  color: #16a34a;
  text-shadow: 0 0 4px rgba(22, 163, 74, 0.3);
}

.project-actions {
  display: flex;
  gap: 8px;
}

.project-actions .btn-primary,
.project-actions .btn-secondary {
  flex: 1;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.project-actions .btn-primary {
  background: rgb(10, 15, 25);
  color: white;
  border: none;
  box-shadow: 0 2px 8px rgba(10, 15, 25, 0.3);
}

.project-actions .btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(10, 15, 25, 0.4);
}

.project-actions .btn-secondary {
  background: rgba(20, 20, 40, 0.8);
  color: #e0e0e0;
  border: 1px solid rgba(10, 15, 25, 0.3);
}

.project-actions .btn-secondary:hover {
  border-color: rgba(51, 204, 255, 0.6);
  background: rgba(51, 204, 255, 0.1);
  color: #ffffff;
}

.view-all-projects {
  text-align: center;
  padding-top: 16px;
  border-top: 1px solid rgba(10, 15, 25, 0.1);
}

.btn-outline {
  padding: 12px 24px;
  background: transparent;
  color: #184b5d;
  border: 2px solid rgba(51, 204, 255, 0.3);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: -15px;
  margin-bottom: 30px;
}

.btn-outline:hover {
  background: rgba(51, 204, 255, 0.1);
  border-color: rgba(51, 204, 255, 0.6);
  color: #ffffff;
  transform: translateY(-2px);
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
  border: 3px solid rgba(10, 15, 25, 0.2);
  border-top: 3px solid rgb(10, 15, 25);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #9ca3af;
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
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.error-description {
  color: #9ca3af;
  font-size: 14px;
  margin: 0 0 24px 0;
}

/* 空状态样式 */
/* 查看所有项目按钮 */
.view-all-section {
  text-align: center;
  margin-top: 32px;
  padding: 24px 0;
}

.view-all-projects {
  background: transparent;
  border: 2px solid rgba(51, 204, 255, 0.3);
  color: #33CCFF;
  padding: 12px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-all-projects:hover {
  background: rgba(51, 204, 255, 0.1);
  border-color: rgba(51, 204, 255, 0.6);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(51, 204, 255, 0.2);
}

.empty-state {
  padding: 40px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.empty-description {
  font-size: 14px;
  color: #8ca0c3;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .financial-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .listing-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: none;
  }
  
  .financial-row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  
  .project-actions {
    flex-direction: column;
  }
  
  .project-actions .btn-primary,
  .project-actions .btn-secondary {
    flex: none;
  }
}

@media (max-width: 480px) {
  .listing-header {
    padding: 20px 20px 12px 20px;
  }
  
  .listing-content {
    padding: 20px;
  }
  
  .project-title {
    font-size: 16px;
  }
  
  .financial-value {
    font-size: 14px;
  }
  
  .projects-list {
    max-height: 300px;
  }
  
  .project-card {
    padding: 12px;
  }
  
  .project-name {
    font-size: 14px;
  }
  
  .financial-row {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  
  .financial-label {
    font-size: 9px;
  }
  
  .financial-value {
    font-size: 12px;
  }
}

  .background {
    background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(147, 51, 234, 0.2) 0%, transparent 50%),
    linear-gradient(135deg, 
      rgba(10, 20, 40, 0.8) 0%,
      rgba(20, 40, 80, 0.6) 25%,
      rgba(30, 60, 120, 0.4) 50%,
      rgba(20, 40, 80, 0.6) 75%,
      rgba(10, 20, 40, 0.8) 100%
    );
  box-shadow: 
    inset -20px -20px 50px rgba(0, 0, 0, 0.3),
    inset 20px 20px 50px rgba(59, 130, 246, 0.1),
    0 0 100px rgba(59, 130, 246, 0.2);
  position: relative;
  animation: earthRotate 20s linear infinite;
}

.earth-sphere::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background: 
    radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 30%),
    radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 40%);
  animation: earthGlow 8s ease-in-out infinite alternate;
}

.earth-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: earthPulse 4s ease-in-out infinite;
}

.network-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.network-svg {
  width: 100%;
  height: 100%;
}

/* 地球旋转动画 */
@keyframes earthRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 地球发光动画 */
@keyframes earthGlow {
  0% { 
    opacity: 0.3;
    transform: scale(1);
  }
  100% { 
    opacity: 0.6;
    transform: scale(1.05);
  }
}

/* 地球脉冲动画 */
@keyframes earthPulse {
  0%, 100% { 
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes binaryFlicker {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}

@keyframes dataPulse {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 1;
  }
}

/* Contact Us section */
.page-header {
  margin-top: 60px;
  margin-left: 50px;
  margin-bottom: 60px;
  font-family: Georgia, 'Times New Roman', Times, serif;
  text-align: left;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.25rem;
  color: #94a3b8;
  margin: 0;
}

.contact-content {
  display: flex;
  flex-direction: column;
  gap: 80px;
  height: 850px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: stretch;
}

.contact-info {
  display: flex;
  flex-direction: column;
  height: 500px;
  width:500px;
  margin-left: 50px;
  margin-top: -50px;
}

.contact-info h2,
.contact-form h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 30px;
  color: #ffffff;
  width: 700px;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
  flex: 1;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 12px;
  padding: 20px;
}

.method-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #141426;
  border-radius: 8px;
  flex-shrink: 0;
}

.method-details h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: #ffffff;
}

.method-details p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.875rem;
}

.social-links h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #ffffff;
}

.social-icons {
  display: flex;
  gap: 12px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.social-icon:hover {
  background: #2a2a4a;
  transform: translateY(-2px);
}

.contact-form {
  background: #1d1d36;
  border: 1px solid #2a2a4a;
  border-radius: 16px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 24px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
}

.form-submit {
  margin-top: 5px;
  padding-top: 24px;
}

.form-group {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #ffffff;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #2a2a4a;
  border-radius: 8px;
  background: #141426;
  color: #ffffff;
  font-size: 1rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
}

.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.btn.primary {
  background: #f97316;
  color: white;
  border: 1px solid #f97316;
}

.btn.primary:hover:not(:disabled) {
  background: #ea580c;
  border-color: #ea580c;
}

.btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    margin-left: 0;
    text-align: center;
    padding: 40px 0;
  }
  
  .page-header h1 {
    font-size: 28px;
    position: static;
    margin-bottom: 20px;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .contact-method {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-header h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
}

</style>
