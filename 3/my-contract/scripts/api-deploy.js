import 'dotenv/config';
import { ethers } from 'hardhat';

/**
 * API部署脚本 - 用于后端API调用
 * 部署所有合约并返回完整的合约信息
 */
async function deployContractsForAPI(projectCode, tradeType, amount, userAddress) {
  try {
    console.log('🚀 开始API合约部署...');
    console.log('项目代码:', projectCode);
    console.log('交易类型:', tradeType);
    console.log('数量:', amount);
    console.log('用户地址:', userAddress);

    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log(`部署者: ${deployer.address}`);
    console.log(`余额: ${ethers.formatEther(balance)} ETH`);

    if (balance < ethers.parseEther('0.01')) {
      throw new Error('部署者余额不足，需要至少0.01 ETH');
    }

    // 1) 部署 KYCRegistry
    console.log('📝 部署 KYCRegistry...');
    const kyc = await ethers.deployContract('KYCRegistry', ['KYC-Registry']);
    await kyc.waitForDeployment();
    const kycAddr = await kyc.getAddress();
    console.log('✅ KYCRegistry:', kycAddr);

    // 2) 部署本金币 LPT
    console.log('📝 部署本金币 LPT...');
    const lpt = await ethers.deployContract('CertificateToken', [
      'Loan-Principal-Token',
      'LPT',
      kycAddr,
    ]);
    await lpt.waitForDeployment();
    const lptAddr = await lpt.getAddress();
    console.log('✅ 本金币(LPT) 地址:', lptAddr);

    // 3) 部署利息币 LIT
    console.log('📝 部署利息币 LIT...');
    const lit = await ethers.deployContract('CertificateToken', [
      'Loan-Interest-Token',
      'LIT',
      kycAddr,
    ]);
    await lit.waitForDeployment();
    const litAddr = await lit.getAddress();
    console.log('✅ 利息币(LIT) 地址:', litAddr);

    // 4) 部署 LoanIssuer
    console.log('📝 部署 LoanIssuer...');
    const issuer = await ethers.deployContract('LoanIssuer', [kycAddr, lptAddr, litAddr]);
    await issuer.waitForDeployment();
    const issuerAddr = await issuer.getAddress();
    console.log('✅ LoanIssuer:', issuerAddr);

    // 5) 转移代币所有权
    console.log('📝 转移代币所有权...');
    await (await lpt.transferOwnership(issuerAddr)).wait();
    await (await lit.transferOwnership(issuerAddr)).wait();
    console.log('✅ 代币所有权已转移');

    // 6) 完成控制器接线
    console.log('📝 完成控制器接线...');
    await (await issuer.wireControllers()).wait();
    console.log('✅ 控制器接线完成');

    // 7) 获取合约ABI
    const kycABI = kyc.interface.format('json');
    const lptABI = lpt.interface.format('json');
    const litABI = lit.interface.format('json');
    const issuerABI = issuer.interface.format('json');

    // 8) 获取交易信息
    const kycDeployTx = kyc.deploymentTransaction();
    const lptDeployTx = lpt.deploymentTransaction();
    const litDeployTx = lit.deploymentTransaction();
    const issuerDeployTx = issuer.deploymentTransaction();

    // 使用LoanIssuer的部署交易作为主要交易
    const mainTx = issuerDeployTx;
    const transactionHash = mainTx.hash;
    const blockNumber = await mainTx.wait().then(receipt => receipt.blockNumber);

    console.log('✅ 所有合约部署完成');
    console.log('交易哈希:', transactionHash);
    console.log('区块号:', blockNumber);

    // 返回完整的合约信息
    const result = {
      // 交易信息
      transactionHash: transactionHash,
      blockNumber: blockNumber,
      
      // 合约地址
      contractAddress: issuerAddr, // 主要合约地址
      trade_contract_abi: JSON.stringify(JSON.parse(issuerABI)),
      
      // 代币地址和ABI
      principalTokenAddress: lptAddr,
      interestTokenAddress: litAddr,
      compliant_erc20_abi: JSON.stringify(JSON.parse(lptABI)), // 使用LPT的ABI作为ERC20 ABI
      
      // 其他地址
      loanIssuerAddress: issuerAddr,
      kycRegistryAddress: kycAddr,
      
      // 额外的合约信息
      kycABI: JSON.stringify(JSON.parse(kycABI)),
      lptABI: JSON.stringify(JSON.parse(lptABI)),
      litABI: JSON.stringify(JSON.parse(litABI)),
      issuerABI: JSON.stringify(JSON.parse(issuerABI))
    };

    // 输出格式化的JSON结果，便于后端解析
    console.log('📊 部署结果:');
    console.log(JSON.stringify(result, null, 2));
    
    // 输出单行JSON，便于解析
    console.log('🎯 JSON_START');
    console.log(JSON.stringify(result));
    console.log('🎯 JSON_END');
    
    return result;

  } catch (error) {
    console.error('❌ 合约部署失败:', error);
    throw error;
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  const projectCode = process.argv[2] || 'RWA001';
  const tradeType = process.argv[3] || 'buy';
  const amount = process.argv[4] || '1';
  const userAddress = process.argv[5] || '0x0000000000000000000000000000000000000000';
  
  deployContractsForAPI(projectCode, tradeType, amount, userAddress)
    .then(result => {
      console.log('✅ 部署成功');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ 部署失败:', error);
      process.exit(1);
    });
}

export { deployContractsForAPI };
