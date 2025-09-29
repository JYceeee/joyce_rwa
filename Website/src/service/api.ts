// api.ts - API服务接口

// API响应结构
interface ApiResponse<T = any> {
  status: number
  message?: string
  data?: T
}

// 后端API基础URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 产品API接口
export const productAPI = {
  /**
   * 获取所有产品
   * @returns {Promise<ApiResponse>} 产品列表
   */
  async getAllProducts(): Promise<ApiResponse> {
    try {
      console.log('📊 API: 从数据库获取所有产品数据')
      
      const response = await fetch(`${API_BASE_URL}/product_details`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📊 API: 数据库返回数据:', result)
      
      return result
    } catch (error) {
      console.error('❌ API: 获取产品数据失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      }
    }
  },

  /**
   * 根据代码获取产品
   * @param {string} code - 产品代码
   * @returns {Promise<ApiResponse>} 产品详情
   */
  async getProductByCode(code: string): Promise<ApiResponse> {
    try {
      console.log('📊 API: 从数据库根据代码获取产品:', code)
      
      const response = await fetch(`${API_BASE_URL}/product_details/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📊 API: 数据库返回产品详情:', result)
      
      return result
    } catch (error) {
      console.error('❌ API: 获取产品详情失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }
    }
  },

  /**
   * 搜索产品
   * @param {string} query - 搜索关键词
   * @returns {Promise<ApiResponse>} 搜索结果
   */
  async searchProducts(query: string): Promise<ApiResponse> {
    try {
      console.log('📊 API: 搜索产品:', query)
      
      // 先获取所有产品，然后在前端进行搜索过滤
      const allProductsResponse = await this.getAllProducts()
      
      if (allProductsResponse.status !== 0) {
        return allProductsResponse
      }
      
      const products = allProductsResponse.data || []
      
      if (!query || query.trim() === '') {
        return {
          status: 0,
          message: 'Success',
          data: products
        }
      }
      
      const filteredProducts = products.filter(product => {
        const searchTerm = query.toLowerCase()
        return (
          product.code.toLowerCase().includes(searchTerm) ||
          product.name.toLowerCase().includes(searchTerm) ||
          product.subtitle.toLowerCase().includes(searchTerm) ||
          product.region.toLowerCase().includes(searchTerm)
        )
      })
      
      return {
        status: 0,
        message: 'Success',
        data: filteredProducts
      }
    } catch (error) {
      console.error('❌ API: 搜索产品失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      }
    }
  },

  /**
   * 根据类型过滤产品
   * @param {string} type - 产品类型
   * @returns {Promise<ApiResponse>} 过滤结果
   */
  async getProductsByType(type: string): Promise<ApiResponse> {
    try {
      console.log('📊 API: 根据类型获取产品:', type)
      
      // 先获取所有产品，然后在前端进行类型过滤
      const allProductsResponse = await this.getAllProducts()
      
      if (allProductsResponse.status !== 0) {
        return allProductsResponse
      }
      
      const products = allProductsResponse.data || []
      
      if (!type || type === 'all') {
        return {
          status: 0,
          message: 'Success',
          data: products
        }
      }
      
      const filteredProducts = products.filter(product => product.type === type)
      
      return {
        status: 0,
        message: 'Success',
        data: filteredProducts
      }
    } catch (error) {
      console.error('❌ API: 根据类型获取产品失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      }
    }
  },

  /**
   * 根据风险等级过滤产品
   * @param {string} risk - 风险等级
   * @returns {Promise<ApiResponse>} 过滤结果
   */
  async getProductsByRisk(risk: string): Promise<ApiResponse> {
    try {
      console.log('📊 API: 根据风险等级获取产品:', risk)
      
      // 先获取所有产品，然后在前端进行风险等级过滤
      const allProductsResponse = await this.getAllProducts()
      
      if (allProductsResponse.status !== 0) {
        return allProductsResponse
      }
      
      const products = allProductsResponse.data || []
      
      if (!risk || risk === 'all') {
        return {
          status: 0,
          message: 'Success',
          data: products
        }
      }
      
      const filteredProducts = products.filter(product => product.risk === risk)
      
      return {
        status: 0,
        message: 'Success',
        data: filteredProducts
      }
    } catch (error) {
      console.error('❌ API: 根据风险等级获取产品失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: []
      }
    }
  },

  /**
   * 更新产品订阅信息
   * @param {string} code - 产品代码
   * @param {object} subscriptionData - 订阅数据
   * @returns {Promise<ApiResponse>} 更新结果
   */
  async updateProductSubscription(code: string, subscriptionData: any): Promise<ApiResponse> {
    try {
      console.log('📊 API: 更新产品订阅信息:', code, subscriptionData)
      
      // 转换字段名以匹配后端API
      const apiData = {
        current_subscribed_token: subscriptionData.subscribed || subscriptionData.current_subscribed_token
      }
      
      const response = await fetch(`${API_BASE_URL}/product_details/${code}/subscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('📊 API: 数据库更新订阅信息结果:', result)
      
      return result
    } catch (error) {
      console.error('❌ API: 更新产品订阅信息失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }
    }
  }
}

// 用户API接口
export const userAPI = {
  /**
   * 获取用户信息
   * @returns {Promise<ApiResponse>} 用户信息
   */
  async getUserInfo(): Promise<ApiResponse> {
    try {
      console.log('📊 API: 获取用户信息')
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 50))
      
      // 从localStorage获取用户信息
      const userInfo = localStorage.getItem('userInfo')
      const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null
      
      return {
        status: 0,
        message: 'Success',
        data: parsedUserInfo
      }
    } catch (error) {
      console.error('❌ API: 获取用户信息失败:', error)
      return {
        status: 1,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: null
      }
    }
  }
}

// 认证API接口
export const login = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    console.log('🔐 API: 用户登录:', email)
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 模拟登录逻辑（实际项目中应该调用真实的API）
    if (email && password) {
      const mockUser = {
        id: '1',
        email: email,
        name: email.split('@')[0],
        token: 'mock-jwt-token-' + Date.now()
      }
      
      // 存储到localStorage
      localStorage.setItem('userInfo', JSON.stringify(mockUser))
      localStorage.setItem('authToken', mockUser.token)
      
      return {
        status: 0,
        message: 'Login successful',
        data: mockUser
      }
    } else {
      return {
        status: 1,
        message: 'Email and password are required',
        data: null
      }
    }
  } catch (error) {
    console.error('❌ API: 登录失败:', error)
    return {
      status: 1,
      message: error instanceof Error ? error.message : 'Login failed',
      data: null
    }
  }
}

export const signup = async (userData: any): Promise<ApiResponse> => {
  try {
    console.log('📝 API: 用户注册:', userData)
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 模拟注册逻辑
    const newUser = {
      id: Date.now().toString(),
      email: userData.email || '',
      name: userData.name || '',
      phone: userData.phone || '',
      token: 'mock-jwt-token-' + Date.now()
    }
    
    // 存储到localStorage
    localStorage.setItem('userInfo', JSON.stringify(newUser))
    localStorage.setItem('authToken', newUser.token)
    
    return {
      status: 0,
      message: 'Registration successful',
      data: newUser
    }
  } catch (error) {
    console.error('❌ API: 注册失败:', error)
    return {
      status: 1,
      message: error instanceof Error ? error.message : 'Registration failed',
      data: null
    }
  }
}

// 默认导出
export default {
  productAPI,
  userAPI
}
