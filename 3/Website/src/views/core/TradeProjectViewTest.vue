<template>
  <div class="trade-page">
    <!-- 调试信息 -->
    <div class="debug-info">
      <h1>TradeProjectView 测试页面</h1>
      <p>项目代码: {{ projectCode }}</p>
      <p>加载状态: {{ projectLoading ? '加载中...' : '已加载' }}</p>
      <p>错误信息: {{ projectError || '无错误' }}</p>
      <p>项目数据: {{ projectData ? '已加载' : '未加载' }}</p>
    </div>

    <!-- 加载状态 -->
    <div v-if="projectLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <h2>Loading Project Data...</h2>
      <p>Please wait while we load the project information.</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="projectError" class="error-container"> 
      <div class="error-icon">⚠️</div>
      <h2>Failed to Load Project</h2>
      <p>{{ projectError }}</p> 
      <button class="btn primary" @click="loadProjectData">Retry</button>
    </div>
    
    <!-- 项目信息卡片 -->
    <div v-else-if="projectData" class="project-info-card">
      <div class="project-header">
        <h1 class="project-title">{{ projectData.code }} • {{ projectData.name }}</h1>
        <p class="project-subtitle">{{ projectData.subtitle }}</p>
      </div>
      
      <!-- 项目指标 -->
      <div class="project-metrics">
        <div class="metric-item">
          <span class="metric-label">LOAN SIZE</span>
          <span class="metric-value">{{ projectData.loanAmount || 'A$0' }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">EST. YIELD (IRR)</span>
          <span class="metric-value" style="color: #16a34a;">{{ projectData.metrics?.targetLoanYield || 'N/A' }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">TERM</span>
          <span class="metric-value">{{ projectData.loanTerm || '12 months' }}</span>
        </div>
      </div>
    </div>

    <!-- 调试按钮 -->
    <div class="debug-buttons">
      <button @click="loadProjectData" class="btn primary">重新加载项目数据</button>
      <button @click="testAPI" class="btn secondary">测试API</button>
      <button @click="showDebugInfo" class="btn secondary">显示调试信息</button>
    </div>

    <!-- 调试信息显示 -->
    <div v-if="showDebug" class="debug-details">
      <h3>调试详情</h3>
      <pre>{{ JSON.stringify({
        projectCode,
        projectLoading,
        projectError,
        projectData: projectData ? '已加载' : '未加载',
        routeParams: $route.params,
        routeQuery: $route.query
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { productAPI } from '@/service/api'

export default {
  name: 'TradeProjectViewTest',
  props: {
    code: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    return {
      projectData: null,
      projectLoading: true,
      projectError: null,
      showDebug: false
    }
  },
  computed: {
    projectCode() {
      const code = this.code || this.$route.params.code || this.$route.query.code
      console.log('🔍 TradeProjectViewTest: 获取项目代码:', {
        props: this.code,
        routeParams: this.$route.params.code,
        routeQuery: this.$route.query.code,
        final: code
      })
      return code || 'RWA001'
    }
  },
  async mounted() {
    console.log('🚀 TradeProjectViewTest: 组件已挂载')
    await this.loadProjectData()
  },
  methods: {
    async loadProjectData() {
      try {
        this.projectLoading = true
        this.projectError = null
        console.log('🔄 TradeProjectViewTest: 从数据库加载项目数据...', this.projectCode)
        
        const response = await productAPI.getProductByCode(this.projectCode)
        console.log('📡 TradeProjectViewTest: API响应:', response)
        
        if (response.status === 0) {
          const project = response.data
          console.log('📊 TradeProjectViewTest: 原始项目数据:', project)
          
          // 简化的数据映射
          this.projectData = {
            code: project.project_code,
            name: project.project_name,
            subtitle: `${project.loan_product} - ${project.property_type}`,
            loanAmount: project.loan_amount ? `A$${parseFloat(project.loan_amount).toLocaleString()}` : 'A$0',
            loanTerm: project.loan_term_months ? `${project.loan_term_months} months` : '12 months',
            metrics: {
              targetLoanYield: project.interest_rate ? `${project.interest_rate}% p.a.` : 'TBA'
            }
          }
          
          console.log('✅ TradeProjectViewTest: 项目数据映射成功:', this.projectData)
        } else {
          this.projectError = response.message || '获取项目数据失败'
          console.error('❌ TradeProjectViewTest: API返回错误:', response)
        }
      } catch (error) {
        this.projectError = '网络错误，无法获取项目数据'
        console.error('❌ TradeProjectViewTest: 加载项目数据失败:', error)
      } finally {
        this.projectLoading = false
      }
    },
    
    async testAPI() {
      console.log('🧪 TradeProjectViewTest: 测试API调用')
      try {
        const response = await fetch(`http://localhost:3000/api/project/${this.projectCode}`)
        const data = await response.json()
        console.log('🧪 TradeProjectViewTest: API测试结果:', data)
        alert(`API测试结果: ${response.ok ? '成功' : '失败'}\n状态: ${data.status}\n消息: ${data.message || '无消息'}`)
      } catch (error) {
        console.error('🧪 TradeProjectViewTest: API测试失败:', error)
        alert(`API测试失败: ${error.message}`)
      }
    },
    
    showDebugInfo() {
      this.showDebug = !this.showDebug
      console.log('🐛 TradeProjectViewTest: 调试信息:', {
        projectCode: this.projectCode,
        projectLoading: this.projectLoading,
        projectError: this.projectError,
        projectData: this.projectData,
        routeParams: this.$route.params,
        routeQuery: this.$route.query
      })
    }
  }
}
</script>

<style scoped>
.trade-page {
  background: #1a1a1a;
  min-height: 100vh;
  color: #ffffff;
  padding: 20px;
}

.debug-info {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #374151;
}

.debug-info h1 {
  color: #4CAF50;
  margin-bottom: 15px;
}

.debug-info p {
  margin: 5px 0;
  color: #e0e0e0;
}

.loading-container, .error-container {
  text-align: center;
  padding: 40px 20px;
  background: #2a2a2a;
  border-radius: 8px;
  margin-bottom: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #374151;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.project-info-card {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #374151;
}

.project-title {
  color: #4CAF50;
  margin-bottom: 10px;
}

.project-subtitle {
  color: #9ca3af;
  margin-bottom: 20px;
}

.project-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-item {
  background: #1f2937;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #374151;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 5px;
}

.metric-value {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.debug-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn.primary {
  background: #4CAF50;
  color: white;
}

.btn.primary:hover {
  background: #45a049;
}

.btn.secondary {
  background: #374151;
  color: white;
}

.btn.secondary:hover {
  background: #4b5563;
}

.debug-details {
  background: #1f2937;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #374151;
  margin-top: 20px;
}

.debug-details h3 {
  color: #4CAF50;
  margin-bottom: 15px;
}

.debug-details pre {
  background: #111827;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  color: #e0e0e0;
  font-size: 12px;
}
</style>
