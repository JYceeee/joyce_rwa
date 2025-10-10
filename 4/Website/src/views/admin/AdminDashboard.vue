<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">管理员面板</h1>
      <!-- <p class="dashboard-subtitle">管理面板</p> -->
    </div>

    <div class="dashboard-content">
      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalSubscriptions }}</div>
            <div class="stat-label">总认购申请</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingSubscriptions }}</div>
            <div class="stat-label">待审核申请</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ approvedSubscriptions }}</div>
            <div class="stat-label">已批准申请</div>
          </div>
        </div>
        
        <!-- <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-value">{{ totalAmount.toLocaleString() }}</div>
            <div class="stat-label">总认购代币数</div>
          </div>
        </div> -->
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <h2 class="section-title">快速操作</h2>
        <div class="actions-grid">
          <router-link to="/admin/subscriptions" class="action-card">
            <!-- <div class="action-icon">📋</div> -->
            <div class="action-content">
              <h3>认购管理</h3>
              <p>查看和管理所有认购申请</p>
            </div>
          </router-link>
          
          <router-link to="/listedprojects" class="action-card">
            <!-- <div class="action-icon">🏢</div> -->
            <div class="action-content">
              <h3>已上链项目管理</h3>
              <!-- <p>管理已上链项目</p> -->
            </div>
          </router-link>
          
          <router-link to="/to-be-listed" class="action-card">
            <!-- <div class="action-icon">⏳</div> -->
            <div class="action-content">
              <h3>待上链项目管理</h3>
              <!-- <p>管理即将上市的项目</p> -->
            </div>
          </router-link>
        </div>
      </div>

      <!-- 最近认购申请 -->
      <div class="recent-subscriptions">
        <h2 class="section-title">最近认购申请</h2>
        <div class="subscriptions-table">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="recentSubscriptions.length === 0" class="empty-state">
            <p>暂无认购申请</p>
          </div>
          
          <div v-else class="table-container">
            <table class="subscriptions-table-content">
              <thead>
                <tr>
                  <th>项目代码</th>
                  <th>用户地址</th>
                  <th>代币数量</th>
                  <th>年化收益率</th>
                  <th>状态</th>
                  <th>申请时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subscription in recentSubscriptions" :key="subscription.id">
                  <td>{{ subscription.project_code }}</td>
                  <td>{{ formatAddress(subscription.user_wallet_address) }}</td>
                  <td>{{ subscription.token_amount }} Tokens</td>
                  <td>{{ subscription.interest_rate || 'N/A' }}%</td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(subscription.status)">
                      {{ getStatusText(subscription.status) }}
                    </span>
                  </td>
                  <td>{{ formatDate(subscription.created_at) }}</td>
                  <td>
                    <router-link 
                      :to="`/admin/subscriptions/${subscription.id}`" 
                      class="btn-small primary"
                    >
                      查看详情
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const subscriptions = ref([])
const loading = ref(true)

// 计算属性
const totalSubscriptions = computed(() => subscriptions.value.length)
const pendingSubscriptions = computed(() => 
  subscriptions.value.filter(s => s.status === 'pending').length
)
const approvedSubscriptions = computed(() => 
  subscriptions.value.filter(s => s.status === 'approved').length
)
const totalAmount = computed(() => 
  subscriptions.value.reduce((sum, s) => sum + parseFloat(s.token_amount || 0), 0)
)
const recentSubscriptions = computed(() => 
  subscriptions.value.slice(0, 5) // 显示最近5条
)

// 方法
const loadSubscriptions = async () => {
  try {
    loading.value = true
    console.log('📊 加载认购申请数据...')
    
    // ⚠️ 重要：这是后端API服务器地址，不是数据库地址
    // 端口应该是3000（后端API端口），不是3306（MySQL数据库端口）
    const apiUrl = 'http://localhost:3000'
    if (!apiUrl) {
      throw new Error('远程API地址未配置，请设置VUE_APP_API_URL环境变量')
    }
    
    const endpoint = `${apiUrl}/api/subscriptions`
    console.log('📊 API端点:', endpoint)
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.status === 0) {
        subscriptions.value = result.data.subscriptions || []
        console.log('✅ 成功加载认购申请:', subscriptions.value.length, '条')
      } else {
        throw new Error(result.message || '获取数据失败')
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
  } catch (error) {
    console.error('❌ 加载认购申请失败:', error)
    // 显示错误信息给用户
    subscriptions.value = []
    // 错误弹窗已取消
    // alert(`加载认购申请失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const generateMockData = () => {
  return [
    {
      id: 1,
      project_code: 'RWAT0001',
      user_wallet_address: '0x1234567890123456789012345678901234567890',
      token_amount: 1000,
      interest_rate: 8.5,
      expected_return: 'AUD 85.00 /年',
      status: 'pending',
      created_at: new Date().toISOString(),
      trade_type: 'BUY_TOKEN'
    },
    {
      id: 2,
      project_code: 'RWA0001',
      user_wallet_address: '0x2345678901234567890123456789012345678901',
      token_amount: 2500,
      interest_rate: 9.0,
      expected_return: 'AUD 225.00 /年',
      status: 'approved',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      trade_type: 'BUY_TOKEN'
    },
    {
      id: 3,
      project_code: 'YYD',
      user_wallet_address: '0x3456789012345678901234567890123456789012',
      token_amount: 500,
      interest_rate: 7.8,
      expected_return: 'AUD 39.00 /年',
      status: 'pending',
      created_at: new Date(Date.now() - 172800000).toISOString(),
      trade_type: 'BUY_TOKEN'
    }
  ]
}

const formatAddress = (address) => {
  if (!address) return 'N/A'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'pending',
    'approved': 'approved',
    'rejected': 'rejected'
  }
  return statusClasses[status] || 'unknown'
}

const getStatusText = (status) => {
  const statusTexts = {
    'pending': '待审核',
    'approved': '已批准',
    'rejected': '已拒绝'
  }
  return statusTexts[status] || '未知'
}

// 生命周期
onMounted(() => {
  // 检查管理员权限
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  if (!isAdmin) {
    router.push('/login')
    return
  }
  
  loadSubscriptions()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--bg);
  padding: 24px;
}

.dashboard-header {
  text-align: left;
  margin-bottom: 32px;
  margin-left: 36px;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-bg);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16px;
}

.quick-actions {
  margin-bottom: 32px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.action-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease;
  box-shadow: var(--shadow);
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--primary);
}

.action-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-bg);
  border-radius: 12px;
}

.action-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px 0;
}

.action-content p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.recent-subscriptions {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow);
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.table-container {
  overflow-x: auto;
}

.subscriptions-table-content {
  width: 100%;
  border-collapse: collapse;
}

.subscriptions-table-content th,
.subscriptions-table-content td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--border);
}

.subscriptions-table-content th {
  background: var(--bg-secondary);
  font-weight: 600;
  color: var(--text);
}

.subscriptions-table-content td {
  color: var(--text-secondary);
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.1);
  color: #f59e0b;
}

.status-badge.approved {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-small {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-small.primary {
  background: var(--primary);
  color: white;
}

.btn-small.primary:hover {
  background: var(--primary-dark);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 16px;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .subscriptions-table-content {
    font-size: 0.9rem;
  }
  
  .subscriptions-table-content th,
  .subscriptions-table-content td {
    padding: 8px;
  }
}

/* 浅色主题适配 */
[data-theme="light"] .admin-dashboard {
  background: var(--bg);
}

[data-theme="light"] .stat-card,
[data-theme="light"] .action-card,
[data-theme="light"] .recent-subscriptions {
  background: var(--card-bg);
  border-color: var(--border);
}

[data-theme="light"] .stat-icon,
[data-theme="light"] .action-icon {
  background: var(--primary-bg);
}

[data-theme="light"] .subscriptions-table-content th {
  background: var(--bg-secondary);
}
</style>
