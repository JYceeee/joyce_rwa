// api.ts - API服务接口
import { products } from '../data/ProductDetailsInfo.js'

// 模拟API响应结构
interface ApiResponse<T = any> {
  status: number
  message?: string
  data?: T
}

// 产品API接口
export const productAPI = {
  /**
   * 获取所有产品
   * @returns {Promise<ApiResponse>} 产品列表
   */
  async getAllProducts(): Promise<ApiResponse> {
    try {
      console.log('📊 API: 获取所有产品数据')
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 100))
      
      return {
        status: 0,
        message: 'Success',
        data: products
      }
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
      console.log('📊 API: 根据代码获取产品:', code)
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const product = products.find(p => p.code === code)
      
      if (product) {
        return {
          status: 0,
          message: 'Success',
          data: product
        }
      } else {
        return {
          status: 1,
          message: 'Product not found',
          data: null
        }
      }
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
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 100))
      
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
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 50))
      
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
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 50))
      
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
