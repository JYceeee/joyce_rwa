<template>
  <div class="admin-subscriptions">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">认购管理</h1>
        <p class="page-subtitle">管理所有用户提交的认购申请</p>
      </div>
      <div class="header-actions">
        <button class="btn primary" @click="refreshData" :disabled="loading">
          <span v-if="loading">🔄</span>
          <span v-else>刷新数据</span>
        </button>
      </div>
    </div>

    <div class="page-content">
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
              <option value="pending">待审核</option>
              <option value="approved">已批准</option>
              <option value="rejected">已拒绝</option>
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

      <!-- 认购申请列表 -->
      <div class="subscriptions-section">
        <div class="section-header">
          <h2 class="section-title">
            认购申请列表
            <span class="count-badge">{{ filteredSubscriptions.length }}</span>
          </h2>
        </div>

        <div class="subscriptions-table-container">
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>加载中...</p>
          </div>
          
          <div v-else-if="filteredSubscriptions.length === 0" class="empty-state">
            <!-- <div class="empty-icon">📋</div> -->
            <p>没有找到符合条件的认购申请</p>
          </div>
          
          <div v-else class="table-wrapper">
            <table class="subscriptions-table">
              <thead>
                <tr>
                  <th @click="sortBy('id')" class="sortable">
                    ID
                    <span class="sort-icon" :class="{ active: sortField === 'id' }">
                      {{ sortField === 'id' && sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </th>
                  <th @click="sortBy('project_code')" class="sortable">
                    项目代码
                    <span class="sort-icon" :class="{ active: sortField === 'project_code' }">
                      {{ sortField === 'project_code' && sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </th>
                  <th>用户地址</th>
                  <th @click="sortBy('token_amount')" class="sortable">
                    代币数量
                    <span class="sort-icon" :class="{ active: sortField === 'token_amount' }">
                      {{ sortField === 'token_amount' && sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </th>
                  <th>年化收益率</th>
                  <th>预期收益</th>
                  <th>交易类型</th>
                  <th @click="sortBy('created_at')" class="sortable">
                    申请时间
                    <span class="sort-icon" :class="{ active: sortField === 'created_at' }">
                      {{ sortField === 'created_at' && sortDirection === 'asc' ? '↑' : '↓' }}
                    </span>
                  </th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subscription in paginatedSubscriptions" :key="subscription.id" class="table-row">
                  <td class="id-cell">{{ subscription.id }}</td>
                  <td class="project-cell">
                    <span class="project-badge">{{ subscription.project_code }}</span>
                  </td>
                  <td class="address-cell">
                    <span class="address-text" :title="subscription.user_wallet_address">
                      {{ formatAddress(subscription.user_wallet_address) }}
                    </span>
                  </td>
                  <td class="amount-cell">
                    <span class="amount-value">{{ formatNumber(subscription.token_amount) }} Tokens</span>
                  </td>
                  <td class="rate-cell">
                    <span class="rate-value">{{ subscription.interest_rate || 'N/A' }}%</span>
                  </td>
                  <td class="return-cell">
                    <span class="return-value">{{ subscription.expected_return || 'N/A' }}</span>
                  </td>
                  <td class="type-cell">
                    <span class="type-badge" :class="getTypeClass(subscription.trade_type)">
                      {{ getTypeText(subscription.trade_type) }}
                    </span>
                  </td>
                  <td class="date-cell">{{ formatDate(subscription.created_at) }}</td>
                  <td class="status-cell">
                    <span class="status-badge" :class="getStatusClass(subscription.status)">
                      {{ getStatusText(subscription.status) }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button 
                        class="btn-small primary" 
                        @click="viewDetails(subscription)"
                      >
                        查看详情
                      </button>
                      <button 
                        v-if="subscription.status === 'pending'"
                        class="btn-small success" 
                        @click="approveSubscription(subscription)"
                      >
                        批准
                      </button>
                      <button 
                        v-if="subscription.status === 'pending'"
                        class="btn-small danger" 
                        @click="rejectSubscription(subscription)"
                      >
                        拒绝
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
              class="pagination-btn" 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              上一页
            </button>
            
            <span class="pagination-info">
              第 {{ currentPage }} 页，共 {{ totalPages }} 页
            </span>
            
            <button 
              class="pagination-btn" 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content detail-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">认购申请详情</h3>
          <button class="modal-close" @click="closeDetailModal">×</button>
        </div>
        
        <div class="modal-body" v-if="selectedSubscription">
          <div class="detail-grid">
            <div class="detail-item">
              <label class="detail-label">申请ID:</label>
              <span class="detail-value">{{ selectedSubscription.id }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">项目代码:</label>
              <span class="detail-value">{{ selectedSubscription.project_code }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">用户地址:</label>
              <span class="detail-value address-full">{{ selectedSubscription.user_wallet_address }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">交易类型:</label>
              <span class="detail-value">{{ getTypeText(selectedSubscription.trade_type) }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">代币数量:</label>
              <span class="detail-value amount">{{ formatNumber(selectedSubscription.token_amount) }} Tokens</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">年化收益率:</label>
              <span class="detail-value">{{ selectedSubscription.interest_rate || 'N/A' }}%</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">预期收益:</label>
              <span class="detail-value amount">{{ selectedSubscription.expected_return || 'N/A' }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">原生代币地址:</label>
              <span class="detail-value address-full">{{ selectedSubscription.token_address_native || 'N/A' }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">利息代币地址:</label>
              <span class="detail-value address-full">{{ selectedSubscription.token_address_interest || 'N/A' }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">贷款发行人地址:</label>
              <span class="detail-value address-full">{{ selectedSubscription.loan_issuer_address || 'N/A' }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">申请时间:</label>
              <span class="detail-value">{{ formatDateTime(selectedSubscription.created_at) }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">更新时间:</label>
              <span class="detail-value">{{ formatDateTime(selectedSubscription.updated_at) }}</span>
            </div>
            
            <div class="detail-item">
              <label class="detail-label">当前状态:</label>
              <span class="detail-value">
                <span class="status-badge" :class="getStatusClass(selectedSubscription.status)">
                  {{ getStatusText(selectedSubscription.status) }}
                </span>
              </span>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeDetailModal">关闭</button>
          <button 
            v-if="selectedSubscription && selectedSubscription.status === 'pending'"
            class="btn success" 
            @click="approveSubscription(selectedSubscription)"
          >
            批准申请
          </button>
          <button 
            v-if="selectedSubscription && selectedSubscription.status === 'pending'"
            class="btn danger" 
            @click="rejectSubscription(selectedSubscription)"
          >
            拒绝申请
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 响应式数据
const subscriptions = ref([])
const loading = ref(true)
const selectedProject = ref('')
const selectedStatus = ref('')
const searchQuery = ref('')
const sortField = ref('created_at')
const sortDirection = ref('desc')
const currentPage = ref(1)
const pageSize = ref(10)
const showDetailModal = ref(false)
const selectedSubscription = ref(null)

// 计算属性
const uniqueProjects = computed(() => {
  const projects = [...new Set(subscriptions.value.map(s => s.project_code))]
  return projects.sort()
})

const filteredSubscriptions = computed(() => {
  let filtered = [...subscriptions.value]

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

  // 排序
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]

    if (sortField.value === 'created_at' || sortField.value === 'purchase_amount') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    if (sortDirection.value === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredSubscriptions.value.length / pageSize.value))

const paginatedSubscriptions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSubscriptions.value.slice(start, end)
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
    
    // 构建查询参数
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: pageSize.value,
      sort_by: sortField.value,
      sort_order: sortDirection.value
    })
    
    if (selectedProject.value) params.append('project_code', selectedProject.value)
    if (selectedStatus.value) params.append('status', selectedStatus.value)
    if (searchQuery.value) params.append('user_wallet_address', searchQuery.value)
    
    console.log('📊 API端点:', `${endpoint}?${params}`)
    
    const response = await fetch(`${endpoint}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.status === 0) {
        subscriptions.value = result.data.subscriptions || []
        totalPages.value = result.data.pagination.pages || 1
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
    totalPages.value = 1
    // 错误弹窗已取消
    // alert(`加载认购申请失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

const generateMockData = () => {
  const mockData = []
  const projects = ['RWAT0001', 'RWA0001', 'RWA0002', 'YYD', 'COMP']
  const statuses = ['pending', 'approved', 'rejected']
  const types = ['BUY_TOKEN', 'SELL_INTEREST']
  const interestRates = [7.5, 8.0, 8.5, 9.0, 9.5]
  
  for (let i = 1; i <= 25; i++) {
    const tokenAmount = Math.floor(Math.random() * 10000) + 100
    const interestRate = interestRates[Math.floor(Math.random() * interestRates.length)]
    const expectedReturn = `AUD ${(tokenAmount * interestRate / 100).toFixed(2)} /年`
    
    mockData.push({
      id: i,
      project_code: projects[Math.floor(Math.random() * projects.length)],
      user_wallet_address: `0x${Math.random().toString(16).substr(2, 40)}`,
      token_amount: tokenAmount,
      interest_rate: interestRate,
      expected_return: expectedReturn,
      trade_type: types[Math.floor(Math.random() * types.length)],
      token_address_native: `0x${Math.random().toString(16).substr(2, 40)}`,
      token_address_interest: `0x${Math.random().toString(16).substr(2, 40)}`,
      loan_issuer_address: `0x${Math.random().toString(16).substr(2, 40)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
  }
  
  return mockData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

const refreshData = () => {
  loadSubscriptions()
}

const applyFilters = () => {
  currentPage.value = 1 // 重置到第一页
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const viewDetails = (subscription) => {
  selectedSubscription.value = subscription
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedSubscription.value = null
}

const approveSubscription = async (subscription) => {
  try {
    console.log('✅ 批准认购申请:', subscription.id)
    
    // ⚠️ 重要：这是后端API服务器地址，不是数据库地址
    const apiUrl = 'http://localhost:3000'
    if (!apiUrl) {
      throw new Error('远程API地址未配置')
    }
    
    const endpoint = `${apiUrl}/api/subscriptions/${subscription.id}/status`
    
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'approved',
        approval_notes: '认购申请已批准',
        approved_by: 1 // 这里应该从登录用户信息中获取
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.status === 0) {
        subscription.status = 'approved'
        subscription.updated_at = new Date().toISOString()
        subscription.approved_at = new Date().toISOString()
        
        if (selectedSubscription.value && selectedSubscription.value.id === subscription.id) {
          selectedSubscription.value = { ...subscription }
        }
        
        // 成功弹窗已取消
        // alert('认购申请已批准')
        // 重新加载数据
        loadSubscriptions()
      } else {
        throw new Error(result.message || '批准申请失败')
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    } catch (error) {
      console.error('❌ 批准申请失败:', error)
      // 错误弹窗已取消
      // alert(`批准申请失败: ${error.message}`)
    }
  }
  
  const rejectSubscription = async (subscription) => {
    try {
      console.log('❌ 拒绝认购申请:', subscription.id)
      
      // ⚠️ 重要：请将此URL替换为您的远程数据库API地址
      const apiUrl = process.env.VUE_APP_API_URL
      if (!apiUrl) {
        throw new Error('远程API地址未配置')
      }
      
      const endpoint = `${apiUrl}/api/subscriptions/${subscription.id}/status`
    
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'rejected',
        approval_notes: '认购申请已拒绝',
        approved_by: 1 // 这里应该从登录用户信息中获取
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.status === 0) {
        subscription.status = 'rejected'
        subscription.updated_at = new Date().toISOString()
        subscription.approved_at = new Date().toISOString()
        
        if (selectedSubscription.value && selectedSubscription.value.id === subscription.id) {
          selectedSubscription.value = { ...subscription }
        }
        
        // 成功弹窗已取消
        // alert('认购申请已拒绝')
        // 重新加载数据
        loadSubscriptions()
      } else {
        throw new Error(result.message || '拒绝申请失败')
      }
    } else {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error('❌ 拒绝申请失败:', error)
    // 错误弹窗已取消
    // alert(`拒绝申请失败: ${error.message}`)
  }
}

const formatAddress = (address) => {
  if (!address) return 'N/A'
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatNumber = (number) => {
  if (!number) return '0'
  return parseFloat(number).toLocaleString()
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatDateTime = (dateString) => {
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

const getTypeClass = (type) => {
  const typeClasses = {
    'BUY_TOKEN': 'buy',
    'SELL_INTEREST': 'sell'
  }
  return typeClasses[type] || 'unknown'
}

const getTypeText = (type) => {
  const typeTexts = {
    'BUY_TOKEN': '认购代币',
    'SELL_INTEREST': '赎回利息'
  }
  return typeTexts[type] || '未知'
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
.admin-subscriptions {
  min-height: 100vh;
  background: var(--bg);
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  gap: 16px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  flex-shrink: 0;
}

.page-content {
  max-width: 1400px;
  margin: 0 auto;
}

.filters-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
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
  gap: 6px;
  min-width: 150px;
}

.filter-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--bg);
  color: var(--text);
  font-size: 0.9rem;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--primary);
}

.subscriptions-section {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
}

.section-header {
  padding: 20px 24px 0;
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-badge {
  background: var(--primary);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.subscriptions-table-container {
  padding: 24px;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 60px 20px;
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

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border);
}

.subscriptions-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--card-bg);
}

.subscriptions-table th {
  background: var(--bg-secondary);
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.subscriptions-table th.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.subscriptions-table th.sortable:hover {
  background: var(--hover-bg);
}

.sort-icon {
  margin-left: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.sort-icon.active {
  opacity: 1;
}

.subscriptions-table td {
  padding: 12px;
  border-bottom: 1px solid var(--border);
  color: var(--text-secondary);
}

.table-row:hover {
  background: var(--hover-bg);
}

.project-badge {
  background: var(--primary-bg);
  color: var(--primary);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.address-text {
  font-family: monospace;
  font-size: 0.9rem;
}

.amount-value {
  font-weight: 600;
  color: var(--text);
}

.type-badge.buy {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.type-badge.sell {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.type-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
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

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn-small {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-small.primary {
  background: var(--primary);
  color: white;
}

.btn-small.primary:hover {
  background: var(--primary-dark);
}

.btn-small.success {
  background: #22c55e;
  color: white;
}

.btn-small.success:hover {
  background: #16a34a;
}

.btn-small.danger {
  background: #ef4444;
  color: white;
}

.btn-small.danger:hover {
  background: #dc2626;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.pagination-btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--card-bg);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--hover-bg);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.detail-modal {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close:hover {
  color: var(--text);
}

.modal-body {
  padding: 24px;
}

.detail-grid {
  display: grid;
  gap: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: var(--text);
  min-width: 120px;
}

.detail-value {
  color: var(--text-secondary);
  text-align: right;
  flex: 1;
  margin-left: 16px;
}

.detail-value.address-full {
  font-family: monospace;
  font-size: 0.9rem;
  word-break: break-all;
}

.detail-value.amount {
  font-weight: 600;
  color: var(--text);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--border);
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn.primary {
  background: var(--primary);
  color: white;
}

.btn.primary:hover {
  background: var(--primary-dark);
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text);
  border: 1px solid var(--border);
}

.btn.secondary:hover {
  background: var(--hover-bg);
}

.btn.success {
  background: #22c55e;
  color: white;
}

.btn.success:hover {
  background: #16a34a;
}

.btn.danger {
  background: #ef4444;
  color: white;
}

.btn.danger:hover {
  background: #dc2626;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .admin-subscriptions {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filters-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .filter-group {
    min-width: auto;
  }
  
  .subscriptions-table {
    font-size: 0.9rem;
  }
  
  .subscriptions-table th,
  .subscriptions-table td {
    padding: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .detail-modal {
    width: 95%;
    margin: 20px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .detail-value {
    text-align: left;
    margin-left: 0;
  }
}

/* 浅色主题适配 */
[data-theme="light"] .admin-subscriptions {
  background: var(--bg);
}

[data-theme="light"] .filters-section,
[data-theme="light"] .subscriptions-section,
[data-theme="light"] .detail-modal {
  background: var(--card-bg);
  border-color: var(--border);
}

[data-theme="light"] .subscriptions-table th {
  background: var(--bg-secondary);
}
</style>
