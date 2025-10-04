const express = require('express')
const path = require('path')
const fs = require('fs')
const contractRouter = express.Router()

// 合约artifacts目录路径
const ARTIFACTS_DIR = path.join(__dirname, '../../../my-contract/contracts/artifacts')

// 获取合约ABI和bytecode
contractRouter.get('/:contractName', async (req, res) => {
  try {
    const { contractName } = req.params
    console.log(`📋 请求合约信息: ${contractName}`)
    
    // 构建文件路径
    const artifactPath = path.join(ARTIFACTS_DIR, `${contractName}.json`)
    
    // 检查文件是否存在
    if (!fs.existsSync(artifactPath)) {
      console.error(`❌ 合约文件不存在: ${artifactPath}`)
      return res.status(404).json({
        status: 1,
        message: `合约 ${contractName} 的artifacts文件不存在`,
        data: null
      })
    }
    
    // 读取artifacts文件
    const artifactData = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
    
    // 提取ABI和bytecode
    const response = {
      contractName,
      abi: artifactData.abi,
      bytecode: artifactData.bytecode.object,
      metadata: {
        contractName: artifactData.contractName,
        sourceName: artifactData.sourceName,
        compiler: artifactData.compiler,
        networks: artifactData.networks || {}
      }
    }
    
    console.log(`✅ 成功获取合约信息: ${contractName}`)
    
    res.json({
      status: 0,
      message: '成功获取合约信息',
      data: response
    })
    
  } catch (error) {
    console.error(`❌ 获取合约信息失败: ${contractName}`, error)
    res.status(500).json({
      status: 1,
      message: `获取合约信息失败: ${error.message}`,
      data: null
    })
  }
})

// 获取所有可用合约列表
contractRouter.get('/', async (req, res) => {
  try {
    console.log('📋 请求合约列表')
    
    // 读取artifacts目录
    if (!fs.existsSync(ARTIFACTS_DIR)) {
      console.error(`❌ Artifacts目录不存在: ${ARTIFACTS_DIR}`)
      return res.status(404).json({
        status: 1,
        message: 'Artifacts目录不存在',
        data: null
      })
    }
    
    const files = fs.readdirSync(ARTIFACTS_DIR)
    const contractList = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const contractName = file.replace('.json', '')
        const artifactPath = path.join(ARTIFACTS_DIR, file)
        
        try {
          const artifactData = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
          contractList.push({
            name: contractName,
            contractName: artifactData.contractName,
            sourceName: artifactData.sourceName,
            compiler: artifactData.compiler,
            hasNetworks: !!artifactData.networks && Object.keys(artifactData.networks).length > 0
          })
        } catch (parseError) {
          console.warn(`⚠️ 解析合约文件失败: ${file}`, parseError.message)
        }
      }
    }
    
    console.log(`✅ 成功获取合约列表，共 ${contractList.length} 个合约`)
    
    res.json({
      status: 0,
      message: '成功获取合约列表',
      data: {
        contracts: contractList,
        total: contractList.length
      }
    })
    
  } catch (error) {
    console.error('❌ 获取合约列表失败', error)
    res.status(500).json({
      status: 1,
      message: `获取合约列表失败: ${error.message}`,
      data: null
    })
  }
})

// 获取合约部署信息
contractRouter.get('/:contractName/deployment', async (req, res) => {
  try {
    const { contractName } = req.params
    console.log(`📋 请求合约部署信息: ${contractName}`)
    
    const artifactPath = path.join(ARTIFACTS_DIR, `${contractName}.json`)
    
    if (!fs.existsSync(artifactPath)) {
      return res.status(404).json({
        status: 1,
        message: `合约 ${contractName} 的artifacts文件不存在`,
        data: null
      })
    }
    
    const artifactData = JSON.parse(fs.readFileSync(artifactPath, 'utf8'))
    
    // 提取部署相关信息
    const deploymentInfo = {
      contractName: artifactData.contractName,
      abi: artifactData.abi,
      bytecode: artifactData.bytecode.object,
      constructor: artifactData.abi.find(method => method.type === 'constructor') || null,
      networks: artifactData.networks || {}
    }
    
    console.log(`✅ 成功获取合约部署信息: ${contractName}`)
    
    res.json({
      status: 0,
      message: '成功获取合约部署信息',
      data: deploymentInfo
    })
    
  } catch (error) {
    console.error(`❌ 获取合约部署信息失败: ${contractName}`, error)
    res.status(500).json({
      status: 1,
      message: `获取合约部署信息失败: ${error.message}`,
      data: null
    })
  }
})

module.exports = contractRouter
