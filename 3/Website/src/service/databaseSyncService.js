// 数据库同步服务
// 用于管理所有页面的数据同步和实时更新

class DatabaseSyncService {
  constructor() {
    this.subscribers = new Map() // 存储订阅者
    this.refreshInterval = null
    this.isRefreshing = false
    this.lastRefreshTime = null
    this.cache = new Map() // 数据缓存
  }

  // 订阅数据更新
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set())
    }
    this.subscribers.get(key).add(callback)
    
    // 如果已有缓存数据，立即返回
    if (this.cache.has(key)) {
      callback(this.cache.get(key))
    }
    
    return () => this.unsubscribe(key, callback)
  }

  // 取消订阅
  unsubscribe(key, callback) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).delete(callback)
      if (this.subscribers.get(key).size === 0) {
        this.subscribers.delete(key)
      }
    }
  }

  // 通知所有订阅者
  notify(key, data) {
    if (this.subscribers.has(key)) {
      this.subscribers.get(key).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('通知订阅者失败:', error)
        }
      })
    }
  }

  // 设置缓存数据
  setCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  // 获取缓存数据
  getCache(key) {
    const cached = this.cache.get(key)
    if (cached) {
      // 检查缓存是否过期（5分钟）
      const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000
      if (!isExpired) {
        return cached.data
      }
    }
    return null
  }

  // 开始自动刷新
  startAutoRefresh(interval = 30000) {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
    
    this.refreshInterval = setInterval(() => {
      this.refreshAllData()
    }, interval)
    
    console.log('🔄 数据库同步服务: 开始自动刷新，间隔', interval / 1000, '秒')
  }

  // 停止自动刷新
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
      this.refreshInterval = null
      console.log('⏹️ 数据库同步服务: 停止自动刷新')
    }
  }

  // 刷新所有数据
  async refreshAllData() {
    if (this.isRefreshing) {
      console.log('🔄 数据库同步服务: 正在刷新中，跳过本次刷新')
      return
    }

    this.isRefreshing = true
    this.lastRefreshTime = new Date()
    
    try {
      console.log('🔄 数据库同步服务: 开始刷新所有数据...')
      
      // 刷新产品列表数据
      await this.refreshProductsData()
      
      console.log('✅ 数据库同步服务: 所有数据刷新完成')
    } catch (error) {
      console.error('❌ 数据库同步服务: 刷新数据失败:', error)
    } finally {
      this.isRefreshing = false
    }
  }

  // 刷新产品数据
  async refreshProductsData() {
    try {
      const { productAPI } = await import('./api')
      const response = await productAPI.getAllProducts()
      
      if (response.status === 0) {
        const products = response.data || []
        this.setCache('products', products)
        this.notify('products', products)
        console.log('✅ 数据库同步服务: 产品数据刷新成功，共', products.length, '个项目')
      } else {
        console.error('❌ 数据库同步服务: 获取产品数据失败:', response.message)
      }
    } catch (error) {
      console.error('❌ 数据库同步服务: 刷新产品数据失败:', error)
    }
  }

  // 刷新单个产品数据
  async refreshProductData(code) {
    try {
      const { productAPI } = await import('./api')
      const response = await productAPI.getProductByCode(code)
      
      if (response.status === 0) {
        const product = response.data
        this.setCache(`product_${code}`, product)
        this.notify(`product_${code}`, product)
        console.log('✅ 数据库同步服务: 产品', code, '数据刷新成功')
        return product
      } else {
        console.error('❌ 数据库同步服务: 获取产品', code, '数据失败:', response.message)
        return null
      }
    } catch (error) {
      console.error('❌ 数据库同步服务: 刷新产品', code, '数据失败:', error)
      return null
    }
  }

  // 手动刷新
  async refresh() {
    console.log('🔄 数据库同步服务: 手动刷新...')
    await this.refreshAllData()
  }

  // 获取最后刷新时间
  getLastRefreshTime() {
    return this.lastRefreshTime
  }

  // 检查是否有新数据
  async checkForUpdates() {
    try {
      const { productAPI } = await import('./api')
      const response = await productAPI.getAllProducts()
      
      if (response.status === 0) {
        const newProducts = response.data || []
        const cachedProducts = this.getCache('products') || []
        
        // 检查是否有新项目
        const newProjects = newProducts.filter(newProduct => 
          !cachedProducts.some(cached => cached.code === newProduct.code)
        )
        
        if (newProjects.length > 0) {
          console.log('🆕 数据库同步服务: 发现', newProjects.length, '个新项目:', newProjects.map(p => p.code))
          this.setCache('products', newProducts)
          this.notify('products', newProducts)
          this.notify('new_projects', newProjects)
        }
        
        return newProjects
      }
    } catch (error) {
      console.error('❌ 数据库同步服务: 检查更新失败:', error)
    }
    return []
  }

  // 销毁服务
  destroy() {
    this.stopAutoRefresh()
    this.subscribers.clear()
    this.cache.clear()
    console.log('🗑️ 数据库同步服务: 已销毁')
  }
}

// 创建单例实例
const databaseSyncService = new DatabaseSyncService()

// 导出服务实例和工具函数
export default databaseSyncService

// 工具函数
export const useDatabaseSync = () => {
  return {
    // 订阅产品列表更新
    subscribeProducts: (callback) => databaseSyncService.subscribe('products', callback),
    
    // 订阅单个产品更新
    subscribeProduct: (code, callback) => databaseSyncService.subscribe(`product_${code}`, callback),
    
    // 订阅新项目通知
    subscribeNewProjects: (callback) => databaseSyncService.subscribe('new_projects', callback),
    
    // 手动刷新
    refresh: () => databaseSyncService.refresh(),
    
    // 获取最后刷新时间
    getLastRefreshTime: () => databaseSyncService.getLastRefreshTime(),
    
    // 检查更新
    checkForUpdates: () => databaseSyncService.checkForUpdates(),
    
    // 开始自动刷新
    startAutoRefresh: (interval) => databaseSyncService.startAutoRefresh(interval),
    
    // 停止自动刷新
    stopAutoRefresh: () => databaseSyncService.stopAutoRefresh()
  }
}

// 自动启动服务
if (typeof window !== 'undefined') {
  // 在浏览器环境中自动启动
  databaseSyncService.startAutoRefresh()
  
  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    databaseSyncService.destroy()
  })
}
