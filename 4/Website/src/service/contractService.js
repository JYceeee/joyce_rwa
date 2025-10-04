// 合约服务 - 提供合约部署相关的API调用
import axios from 'axios'

// API基础URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://13.239.255.133:10559'

// 创建axios实例
const contractAPI = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
contractAPI.interceptors.request.use(
  config => {
    console.log(`📤 合约API请求: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  error => {
    console.error('❌ 合约API请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
contractAPI.interceptors.response.use(
  response => {
    console.log(`📥 合约API响应: ${response.status} ${response.config.url}`)
    return response
  },
  error => {
    console.error('❌ 合约API响应错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 获取合约ABI和bytecode
 * @param {string} contractName - 合约名称
 * @returns {Promise<Object>} 合约信息
 */
export async function getContractInfo(contractName) {
  try {
    console.log(`🔍 获取合约信息: ${contractName}`)
    
    const response = await contractAPI.get(`/contract/${contractName}`)
    
    if (response.data.status === 0) {
      console.log(`✅ 成功获取合约信息: ${contractName}`)
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取合约信息失败')
    }
  } catch (error) {
    console.error(`❌ 获取合约信息失败: ${contractName}`, error)
    throw error
  }
}

/**
 * 获取合约部署信息
 * @param {string} contractName - 合约名称
 * @returns {Promise<Object>} 合约部署信息
 */
export async function getContractDeploymentInfo(contractName) {
  try {
    console.log(`🔍 获取合约部署信息: ${contractName}`)
    
    const response = await contractAPI.get(`/contract/${contractName}/deployment`)
    
    if (response.data.status === 0) {
      console.log(`✅ 成功获取合约部署信息: ${contractName}`)
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取合约部署信息失败')
    }
  } catch (error) {
    console.error(`❌ 获取合约部署信息失败: ${contractName}`, error)
    throw error
  }
}

/**
 * 获取所有可用合约列表
 * @returns {Promise<Array>} 合约列表
 */
export async function getContractList() {
  try {
    console.log('🔍 获取合约列表')
    
    const response = await contractAPI.get('/contract')
    
    if (response.data.status === 0) {
      console.log(`✅ 成功获取合约列表，共 ${response.data.data.total} 个合约`)
      return response.data.data.contracts
    } else {
      throw new Error(response.data.message || '获取合约列表失败')
    }
  } catch (error) {
    console.error('❌ 获取合约列表失败', error)
    throw error
  }
}

/**
 * 批量获取多个合约信息
 * @param {Array<string>} contractNames - 合约名称数组
 * @returns {Promise<Object>} 合约信息对象
 */
export async function getMultipleContractInfo(contractNames) {
  try {
    console.log(`🔍 批量获取合约信息:`, contractNames)
    
    const promises = contractNames.map(name => getContractInfo(name))
    const results = await Promise.all(promises)
    
    const contractInfoMap = {}
    contractNames.forEach((name, index) => {
      contractInfoMap[name] = results[index]
    })
    
    console.log(`✅ 成功批量获取 ${contractNames.length} 个合约信息`)
    return contractInfoMap
  } catch (error) {
    console.error('❌ 批量获取合约信息失败', error)
    throw error
  }
}

/**
 * 验证合约信息
 * @param {Object} contractInfo - 合约信息
 * @returns {boolean} 是否有效
 */
export function validateContractInfo(contractInfo) {
  if (!contractInfo) {
    console.error('❌ 合约信息为空')
    return false
  }
  
  if (!contractInfo.abi || !Array.isArray(contractInfo.abi)) {
    console.error('❌ 合约ABI无效')
    return false
  }
  
  if (!contractInfo.bytecode || typeof contractInfo.bytecode !== 'string') {
    console.error('❌ 合约bytecode无效')
    return false
  }
  
  console.log('✅ 合约信息验证通过')
  return true
}

/**
 * 获取合约构造函数参数
 * @param {Object} contractInfo - 合约信息
 * @returns {Array} 构造函数参数
 */
export function getConstructorParams(contractInfo) {
  if (!contractInfo || !contractInfo.abi) {
    return []
  }
  
  const constructor = contractInfo.abi.find(method => method.type === 'constructor')
  return constructor ? constructor.inputs : []
}

/**
 * 合约服务对象
 */
export const contractService = {
  getContractInfo,
  getContractDeploymentInfo,
  getContractList,
  getMultipleContractInfo,
  validateContractInfo,
  getConstructorParams
}

export default contractService