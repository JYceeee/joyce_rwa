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

      <!-- 认购管理 -->
      <div class="subscriptions-management">
        <div class="management-header">
          <h2 class="section-title">认购管理</h2>
          <button class="btn primary" @click="refreshData" :disabled="loading">
            <span v-if="loading">🔄</span>
            <span v-else>刷新数据</span>
          </button>
        </div>

        <!-- 筛选和搜索 -->
        <div class="filters-section">
          <div class="filters-row">
            <div class="filter-group">
              <label class="filter-label">项目筛选:</label>
              <select v-model="selectedProject" class="filter-select" @change="applyFilters">
                <option value="">所有项目</option>
                <option v-for="project in uniqueProjects" :key="project" :value="project">
                  {{ project }}
                </option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">状态筛选:</label>
              <select v-model="selectedStatus" class="filter-select" @change="applyFilters">
                <option value="">所有状态</option>
                <option value="APPLIED">已申请</option>
                <option value="UNDER_REVIEW">审批中</option>
                <option value="APPROVED">已通过</option>
                <option value="PAYMENT_SUBMITTED">已提交支付</option>
                <option value="PAYMENT_CONFIRMED">支付已确认</option>
                <option value="COMPLETED">已完成</option>
                <option value="REJECTED">已拒绝</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label class="filter-label">搜索:</label>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="filter-input" 
                placeholder="搜索用户地址或项目代码..."
                @input="applyFilters"
              />
            </div>
          </div>
        </div>

        <!-- 认购列表 -->
        <div class="subscriptions-table">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="filteredSubscriptions.length === 0" class="empty-state">
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
                <tr v-for="subscription in paginatedSubscriptions" :key="subscription.id">
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
                    <div class="action-buttons">
                      <button 
                        v-if="subscription.status === 'APPLIED'"
                        class="btn-small info"
                        @click="changeStatus(subscription.id, 'UNDER_REVIEW')"
                        :disabled="loading"
                      >
                        开始审批
                      </button>
                      <button 
                        v-if="subscription.status === 'UNDER_REVIEW'"
                        class="btn-small success"
                        @click="changeStatus(subscription.id, 'APPROVED')"
                        :disabled="loading"
                      >
                        通过
                      </button>
                      <button 
                        v-if="subscription.status === 'APPLIED' || subscription.status === 'UNDER_REVIEW'"
                        class="btn-small danger"
                        @click="showRejectDialog(subscription.id)"
                        :disabled="loading"
                      >
                        拒绝
                      </button>
                      <button 
                        v-if="subscription.status === 'PAYMENT_SUBMITTED'"
                        class="btn-small warning"
                        @click="verifyPayment(subscription.id)"
                        :disabled="loading"
                      >
                        核查支付
                      </button>
                      <button 
                        v-if="subscription.status === 'PAYMENT_CONFIRMED'"
                        class="btn-small success"
                        @click="changeStatus(subscription.id, 'COMPLETED')"
                        :disabled="loading"
                      >
                        完成
                      </button>
                      <button 
                        class="btn-small primary"
                        @click="viewDetails(subscription)"
                      >
                        详情
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页 -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              class="btn-small" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              上一页
            </button>
            <span class="page-info">
              第 {{ currentPage }} 页，共 {{ totalPages }} 页
            </span>
            <button 
              class="btn-small" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页
            </button>
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

// 筛选和搜索
const selectedProject = ref('')
const selectedStatus = ref('')
const searchQuery = ref('')

// 分页
const currentPage = ref(1)
const itemsPerPage = ref(10)

// 计算属性
const totalSubscriptions = computed(() => subscriptions.value.length)
const pendingSubscriptions = computed(() => 
  subscriptions.value.filter(s => ['APPLIED', 'UNDER_REVIEW'].includes(s.status)).length
)
const approvedSubscriptions = computed(() => 
  subscriptions.value.filter(s => ['APPROVED', 'PAYMENT_SUBMITTED', 'PAYMENT_CONFIRMED', 'COMPLETED'].includes(s.status)).length
)
const totalAmount = computed(() => 
  subscriptions.value.reduce((sum, s) => sum + parseFloat(s.token_amount || 0), 0)
)

// 获取唯一项目列表
const uniqueProjects = computed(() => {
  const projects = subscriptions.value.map(s => s.project_code).filter(Boolean)
  return [...new Set(projects)].sort()
})

// 筛选后的认购列表
const filteredSubscriptions = computed(() => {
  let filtered = subscriptions.value

  // 项目筛选
  if (selectedProject.value) {
    filtered = filtered.filter(s => s.project_code === selectedProject.value)
  }

  // 状态筛选
  if (selectedStatus.value) {
    filtered = filtered.filter(s => s.status === selectedStatus.value)
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => 
      s.user_wallet_address.toLowerCase().includes(query) ||
      s.project_code.toLowerCase().includes(query)
    )
  }

  return filtered
})

// 分页后的认购列表
const paginatedSubscriptions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSubscriptions.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredSubscriptions.value.length / itemsPerPage.value)
})

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
    'APPLIED': 'pending',
    'approved': 'approved',
    'UNDER_REVIEW': 'under-review',
    'APPROVED': 'approved',
    'PAYMENT_SUBMITTED': 'payment-submitted',
    'PAYMENT_CONFIRMED': 'payment-confirmed',
    'COMPLETED': 'completed',
    'rejected': 'rejected',
    'REJECTED': 'rejected',
    'CANCELLED': 'cancelled'
  }
  return statusClasses[status] || 'unknown'
}

const getStatusText = (status) => {
  const statusTexts = {
    'pending': '待审核',
    'APPLIED': '已申请',
    'approved': '已批准',
    'UNDER_REVIEW': '审批中',
    'APPROVED': '已通过',
    'PAYMENT_SUBMITTED': '已提交支付',
    'PAYMENT_CONFIRMED': '支付已确认',
    'COMPLETED': '已完成',
    'rejected': '已拒绝',
    'REJECTED': '已拒绝',
    'CANCELLED': '已取消'
  }
  return statusTexts[status] || '未知'
}

// 认购管理方法
const applyFilters = () => {
  currentPage.value = 1 // 重置到第一页
}

const refreshData = async () => {
  await loadSubscriptions()
}

// 状态变更相关
const showRejectDialog = (subscriptionId) => {
  const reason = prompt('请输入拒绝原因：')
  if (reason) {
    changeStatus(subscriptionId, 'REJECTED', reason)
  }
}

const changeStatus = async (subscriptionId, newStatus, statusReason = '') => {
  try {
    loading.value = true
    console.log(`🔄 变更认购申请状态: ${subscriptionId} -> ${newStatus}`)
    
    const apiUrl = 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/subscriptions/${subscriptionId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        status_reason: statusReason,
        approved_by: localStorage.getItem('userId') || 'admin',
        actor_type: 'ADMIN'
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.status === 0) {
        console.log('✅ 状态变更成功')
        // 刷新数据
        await loadSubscriptions()
        alert(`状态已更新为: ${getStatusText(newStatus)}`)
      } else {
        throw new Error(result.message || '状态变更失败')
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
  } catch (error) {
    console.error('❌ 状态变更失败:', error)
    alert(`状态变更失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const verifyPayment = async (subscriptionId) => {
  try {
    loading.value = true
    console.log('🔍 核查支付:', subscriptionId)
    
    // 获取认购详情
    const subscription = subscriptions.value.find(s => s.id === subscriptionId)
    if (!subscription || !subscription.latest_tx_hash) {
      alert('未找到交易哈希，无法核查')
      return
    }
    
    const confirm = window.confirm(`确认要核查交易 ${subscription.latest_tx_hash.substring(0, 10)}... 吗？`)
    if (!confirm) return
    
    const apiUrl = 'http://localhost:3000'
    const response = await fetch(`${apiUrl}/api/subscriptions/${subscriptionId}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: subscription.payment_id || null,
        is_confirmed: true,
        block_number: null
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.status === 0) {
        console.log('✅ 支付核查成功')
        await loadSubscriptions()
        alert('支付已确认')
      } else {
        throw new Error(result.message || '支付核查失败')
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
  } catch (error) {
    console.error('❌ 支付核查失败:', error)
    alert(`支付核查失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const viewDetails = (subscription) => {
  // 显示详情对话框或跳转到详情页面
  alert(`认购详情\n\n项目: ${subscription.project_code}\n用户: ${subscription.user_wallet_address}\n数量: ${subscription.token_amount}\n状态: ${getStatusText(subscription.status)}\n\n交易哈希: ${subscription.latest_tx_hash || '未提交'}\n备注: ${subscription.admin_notes || '无'}`)
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
[data-theme="light"] .recent-subscriptions {
  background: var(--card-bg);
  border-color: var(--border);
}

[data-theme="light"] .stat-icon {
  background: var(--primary-bg);
}

[data-theme="light"] .subscriptions-table-content th {
  background: var(--bg-secondary);
}

/* 认购管理样式 */
.subscriptions-management {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.filters-section {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.filters-row {
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.filter-select,
.filter-input {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 14px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-small.success {
  background: #10b981;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-small.success:hover {
  background: #059669;
}

.btn-small.success:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.btn-small.danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-small.danger:hover {
  background: #dc2626;
}

.btn-small.danger:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px;
}

.page-info {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .filters-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-group {
    min-width: auto;
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-small {
    width: 100%;
    justify-content: center;
  }
  
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
