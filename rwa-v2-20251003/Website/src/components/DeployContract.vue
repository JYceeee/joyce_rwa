<template>
    <div class="p-6 max-w-xl mx-auto">
      <h2 class="text-xl font-bold mb-4">部署智能合约</h2>
  
      <div class="space-y-3">
        <button
          class="px-4 py-2 rounded bg-indigo-600 text-white"
          @click="connectWallet"
          :disabled="connecting || !!account"
        >
          {{ account ? '已连接：' + short(account) : (connecting ? '连接中...' : '连接 MetaMask') }}
        </button>
  
        <!-- 如果合约构造函数需要参数，请在这里添加输入框 -->
        <!-- 示例：<input v-model="args.someParam" placeholder="构造函数参数 someParam" class="border px-3 py-2 rounded w-full" /> -->
  
        <button
          class="px-4 py-2 rounded bg-emerald-600 text-white"
          @click="deploy"
          :disabled="!account || deploying"
        >
          {{ deploying ? '部署中...' : '部署合约' }}
        </button>
  
        <div v-if="txHash" class="mt-2">
          <div>部署交易哈希：</div>
          <a class="text-blue-600 underline break-all" :href="explorerTx(txHash)" target="_blank">{{ txHash }}</a>
        </div>
  
        <div v-if="contractAddress" class="mt-2">
          <div>合约地址：</div>
          <a class="text-blue-600 underline break-all" :href="explorerAddress(contractAddress)" target="_blank">{{ contractAddress }}</a>
        </div>
  
        <div v-if="error" class="mt-2 text-red-600 whitespace-pre-wrap">{{ error }}</div>
        <div v-if="note" class="mt-2 text-gray-600 whitespace-pre-wrap">{{ note }}</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { BrowserProvider, ContractFactory } from 'ethers'
  
  const account = ref('')
  const connecting = ref(false)
  const deploying = ref(false)
  const txHash = ref('')
  const contractAddress = ref('')
  const error = ref('')
  const note = ref('')
  
  // 如果你只针对 Sepolia，可填入浏览器链上区块浏览器前缀；也可以根据 chainId 动态切换
  const chainExplorer = 'https://sepolia.etherscan.io' // 更换为你的目标链浏览器
  const explorerTx = (hash) => `${chainExplorer}/tx/${hash}`
  const explorerAddress = (addr) => `${chainExplorer}/address/${addr}`
  
  const short = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : ''
  
  async function connectWallet() {
    error.value = ''
    note.value = ''
    try {
      if (!window.ethereum) {
        error.value = '未检测到 MetaMask，请先安装浏览器钱包插件。'
        return
      }
      connecting.value = true
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      account.value = accounts[0]
  
      // 可选：强制要求测试网/主网，举例要求 Sepolia
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== 11155111) {
        note.value = `当前链ID为 ${network.chainId}。建议切换到 Sepolia (11155111) 再部署。`
      }
    } catch (e) {
      error.value = e?.message || String(e)
    } finally {
      connecting.value = false
    }
  }
  
  async function deploy() {
    error.value = ''
    note.value = ''
    txHash.value = ''
    contractAddress.value = ''
    try {
      if (!window.ethereum) throw new Error('未连接钱包')
      deploying.value = true
  
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
  
      // 读取导出的 ABI & bytecode
      const artifact = await fetch('/contracts/MyContract.json').then(r => r.json())
  
      // 如果你的构造函数有参数，在这里准备：
      // 例如：const constructorArgs = [args.someParam]
      const constructorArgs = []
  
      // 部署
      const factory = new ContractFactory(artifact.abi, artifact.bytecode, signer)
      const contract = await factory.deploy(...constructorArgs)
      const deploymentTx = contract.deploymentTransaction()
      txHash.value = deploymentTx?.hash || ''
  
      // 等待上链
      await contract.waitForDeployment()
      contractAddress.value = await contract.getAddress()
      note.value = '部署完成 ✅'
    } catch (e) {
      error.value = e?.info?.error?.message || e?.message || String(e)
    } finally {
      deploying.value = false
    }
  }
  </script>
