/**
 * 支付交易核查服务
 * 用于验证用户提交的链上交易是否有效
 */

const { ethers } = require('ethers');
const db = require('../database/index');
const { promisify } = require('util');
const query = promisify(db.query).bind(db);

// 配置不同网络的RPC提供者
const NETWORKS = {
  SEPOLIA: {
    name: 'Sepolia',
    rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 11155111
  },
  MAINNET: {
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.MAINNET_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    chainId: 1
  }
};

/**
 * 获取指定网络的Provider
 */
function getProvider(network) {
  const networkConfig = NETWORKS[network];
  if (!networkConfig) {
    throw new Error(`不支持的网络: ${network}`);
  }
  return new ethers.JsonRpcProvider(networkConfig.rpcUrl);
}

/**
 * 验证单个交易
 * @param {string} txHash - 交易哈希
 * @param {string} network - 网络名称
 * @param {object} expectedData - 预期的交易数据
 * @returns {object} 验证结果
 */
async function verifyTransaction(txHash, network, expectedData) {
  try {
    console.log(`🔍 开始验证交易: ${txHash} on ${network}`);

    const provider = getProvider(network);

    // 获取交易详情
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      return {
        success: false,
        error: '交易不存在或尚未被矿工打包'
      };
    }

    // 获取交易收据（确认交易是否成功）
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      return {
        success: false,
        error: '交易尚未被确认'
      };
    }

    // 检查交易是否成功
    if (receipt.status !== 1) {
      return {
        success: false,
        error: '交易执行失败'
      };
    }

    // 验证发送方地址
    if (expectedData.from_address && tx.from.toLowerCase() !== expectedData.from_address.toLowerCase()) {
      return {
        success: false,
        error: `发送方地址不匹配。期望: ${expectedData.from_address}, 实际: ${tx.from}`
      };
    }

    // 验证接收方地址
    if (expectedData.to_address && tx.to && tx.to.toLowerCase() !== expectedData.to_address.toLowerCase()) {
      return {
        success: false,
        error: `接收方地址不匹配。期望: ${expectedData.to_address}, 实际: ${tx.to}`
      };
    }

    // 如果是ERC20代币转账，需要解析交易数据
    let tokenTransfer = null;
    if (expectedData.token_address && tx.data && tx.data !== '0x') {
      try {
        tokenTransfer = await verifyERC20Transfer(tx, receipt, expectedData);
        if (!tokenTransfer.success) {
          return tokenTransfer;
        }
      } catch (error) {
        return {
          success: false,
          error: `解析ERC20转账失败: ${error.message}`
        };
      }
    }

    // 验证金额（如果是原生代币）
    if (expectedData.amount && !expectedData.token_address) {
      const txValue = ethers.formatEther(tx.value);
      const expectedValue = parseFloat(expectedData.amount);
      if (Math.abs(parseFloat(txValue) - expectedValue) > 0.0001) {
        return {
          success: false,
          error: `转账金额不匹配。期望: ${expectedValue}, 实际: ${txValue}`
        };
      }
    }

    console.log(`✅ 交易验证成功: ${txHash}`);

    return {
      success: true,
      blockNumber: receipt.blockNumber,
      confirmations: await provider.getBlockNumber() - receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.effectiveGasPrice ? receipt.effectiveGasPrice.toString() : '0',
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      tokenTransfer: tokenTransfer ? tokenTransfer.data : null
    };

  } catch (error) {
    console.error(`❌ 验证交易失败: ${txHash}`, error);
    return {
      success: false,
      error: `验证失败: ${error.message}`
    };
  }
}

/**
 * 验证ERC20代币转账
 */
async function verifyERC20Transfer(tx, receipt, expectedData) {
  try {
    // ERC20 transfer事件的签名
    const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

    // 查找Transfer事件
    const transferLog = receipt.logs.find(log => 
      log.topics[0] === TRANSFER_EVENT_SIGNATURE &&
      log.address.toLowerCase() === expectedData.token_address.toLowerCase()
    );

    if (!transferLog) {
      return {
        success: false,
        error: 'ERC20转账事件未找到'
      };
    }

    // 解析Transfer事件
    const fromAddress = '0x' + transferLog.topics[1].slice(26);
    const toAddress = '0x' + transferLog.topics[2].slice(26);
    const amount = BigInt(transferLog.data);

    // 验证地址
    if (fromAddress.toLowerCase() !== expectedData.from_address.toLowerCase()) {
      return {
        success: false,
        error: `ERC20发送方不匹配。期望: ${expectedData.from_address}, 实际: ${fromAddress}`
      };
    }

    if (toAddress.toLowerCase() !== expectedData.to_address.toLowerCase()) {
      return {
        success: false,
        error: `ERC20接收方不匹配。期望: ${expectedData.to_address}, 实际: ${toAddress}`
      };
    }

    // 验证金额（假设18位小数）
    const actualAmount = parseFloat(ethers.formatUnits(amount, 18));
    const expectedAmount = parseFloat(expectedData.amount);
    
    if (Math.abs(actualAmount - expectedAmount) > 0.0001) {
      return {
        success: false,
        error: `ERC20转账金额不匹配。期望: ${expectedAmount}, 实际: ${actualAmount}`
      };
    }

    return {
      success: true,
      data: {
        from: fromAddress,
        to: toAddress,
        amount: actualAmount,
        tokenAddress: expectedData.token_address
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `解析ERC20转账失败: ${error.message}`
    };
  }
}

/**
 * 处理待验证的支付记录
 */
async function processPendingPayments() {
  try {
    console.log('🔄 开始处理待验证的支付记录...');

    // 查询所有待验证的支付记录
    const sql = `
      SELECT 
        sp.*,
        s.project_code,
        s.project_name,
        s.user_id,
        s.user_wallet_address
      FROM subscription_payments sp
      JOIN subscriptions s ON sp.subscription_id = s.id
      WHERE sp.status = 'PENDING'
      ORDER BY sp.created_at ASC
    `;

    const pendingPayments = await query(sql);

    console.log(`📋 找到 ${pendingPayments.length} 条待验证的支付记录`);

    for (const payment of pendingPayments) {
      try {
        // 验证交易
        const verificationResult = await verifyTransaction(
          payment.tx_hash,
          payment.network,
          {
            from_address: payment.from_address,
            to_address: payment.to_address,
            token_address: payment.token_address,
            amount: payment.amount
          }
        );

        if (verificationResult.success) {
          // 更新支付记录为已确认
          await query(
            `UPDATE subscription_payments 
             SET status = 'CONFIRMED', 
                 block_number = ?,
                 checked_at = NOW()
             WHERE id = ?`,
            [verificationResult.blockNumber, payment.id]
          );

          // 更新认购申请状态为支付已确认
          await query(
            `UPDATE subscriptions 
             SET status = 'PAYMENT_CONFIRMED', 
                 updated_at = NOW()
             WHERE id = ?`,
            [payment.subscription_id]
          );

          // 创建通知
          await createNotification({
            user_id: payment.user_id,
            user_wallet_address: payment.user_wallet_address,
            subscription_id: payment.subscription_id,
            type: 'PAYMENT_CONFIRMED',
            title: '支付已确认',
            body: `您的支付已确认成功！交易已在区块链上完成。区块号：${verificationResult.blockNumber}`,
            payload: JSON.stringify({
              subscription_id: payment.subscription_id,
              tx_hash: payment.tx_hash,
              block_number: verificationResult.blockNumber
            })
          });

          console.log(`✅ 支付验证成功: ${payment.tx_hash}`);

        } else {
          // 如果是临时性错误（如交易未确认），保持PENDING状态
          // 如果是永久性错误（如地址不匹配），更新为FAILED
          const permanentErrors = ['不匹配', '执行失败'];
          const isPermanentError = permanentErrors.some(err => verificationResult.error.includes(err));

          if (isPermanentError) {
            await query(
              `UPDATE subscription_payments 
               SET status = 'FAILED', 
                   error_message = ?,
                   checked_at = NOW()
               WHERE id = ?`,
              [verificationResult.error, payment.id]
            );

            // 创建通知
            await createNotification({
              user_id: payment.user_id,
              user_wallet_address: payment.user_wallet_address,
              subscription_id: payment.subscription_id,
              type: 'STATUS_CHANGED',
              title: '支付验证失败',
              body: `您的支付交易验证失败：${verificationResult.error}。请重新提交正确的交易。`,
              payload: JSON.stringify({
                subscription_id: payment.subscription_id,
                error: verificationResult.error
              })
            });

            console.log(`❌ 支付验证失败（永久性错误）: ${payment.tx_hash} - ${verificationResult.error}`);
          } else {
            console.log(`⏳ 支付验证暂时失败（将重试）: ${payment.tx_hash} - ${verificationResult.error}`);
          }
        }

      } catch (error) {
        console.error(`❌ 处理支付记录失败 (ID: ${payment.id}):`, error);
      }
    }

    console.log('✅ 支付记录处理完成');

  } catch (error) {
    console.error('❌ 处理待验证支付记录失败:', error);
  }
}

/**
 * 创建通知
 */
async function createNotification({ user_id, user_wallet_address, subscription_id, type, title, body, payload }) {
  try {
    const sql = `
      INSERT INTO user_notifications 
      (user_id, user_wallet_address, subscription_id, type, title, body, payload) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await query(sql, [
      user_id || null,
      user_wallet_address,
      subscription_id || null,
      type,
      title,
      body,
      typeof payload === 'string' ? payload : JSON.stringify(payload)
    ]);
    console.log('📨 通知已创建:', title);
  } catch (error) {
    console.error('❌ 创建通知失败:', error);
  }
}

/**
 * 启动定时任务
 */
function startPaymentVerificationScheduler(intervalMinutes = 5) {
  console.log(`🚀 启动支付验证调度器，间隔: ${intervalMinutes} 分钟`);

  // 立即执行一次
  processPendingPayments();

  // 设置定时任务
  const intervalMs = intervalMinutes * 60 * 1000;
  setInterval(() => {
    processPendingPayments();
  }, intervalMs);
}

module.exports = {
  verifyTransaction,
  processPendingPayments,
  startPaymentVerificationScheduler
};

