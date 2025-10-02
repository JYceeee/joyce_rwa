require('dotenv').config()
const { Web3 } = require('web3');
// 指向真实的以太坊节点 RPC（本地 Ganache 通常 7545；或填你的远端 RPC）
const web3 = new Web3('http://localhost:7545');

// 数据库连接池（按你的路径）
const dbConfig = require('../../database/dbConfig');
const mysql = require('mysql2/promise');
const pool = mysql.createPool(dbConfig.mysql || dbConfig); // 兼容两种导出

// 并发限制
const pLimit = require('p-limit');
const limit = pLimit(5);

async function importBlockTransactions(req, res) {
  try {
    const { blockNumber } = req.body || {};
    if (blockNumber == null) {
      return res.status(400).json({ message: '缺少参数 blockNumber' });
    }

    // true => 带交易列表
    const block = await web3.eth.getBlock(blockNumber, true);
    if (!block) {
      return res.status(404).json({ message: `区块 ${blockNumber} 不存在` });
    }

    const txs = block.transactions || [];
    if (txs.length === 0) {
      return res.status(200).json({ message: `区块 ${blockNumber} 无交易`, count: 0 });
    }

    const ts = new Date(Number(block.timestamp) * 1000);

    const sql = `
      INSERT IGNORE INTO transactions
      (tx_hash, block_number, from_address, to_address, value, gas, gas_price, nonce, input_data, status, timestamp)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const jobs = txs.map(tx => limit(async () => {
      try {
        // receipt.status: true=成功, false=失败
        const receipt = await web3.eth.getTransactionReceipt(tx.hash);
        const status = receipt && receipt.status ? 1 : 0;

        const gasPrice =
          (tx.gasPrice ?? tx.maxFeePerGas ?? '0').toString();

        const params = [
          tx.hash,
          block.number,
          tx.from || null,
          tx.to || null,
          (tx.value ?? '0').toString(),
          tx.gas ?? 0,
          gasPrice,
          tx.nonce ?? 0,
          tx.input ?? null,
          status,
          ts,
        ];

        await pool.execute(sql, params);
      } catch (e) {
        console.error(`导入交易 ${tx.hash} 出错:`, e);
      }
    }));

    await Promise.all(jobs);

    console.log("交易导入完成");

    return res.status(200).json({
      message: `区块 ${blockNumber} 交易导入完成`,
      count: txs.length
    });
  } catch (err) {
    console.error('导入交易出错:', err);
    return res.status(500).json({ message: '导入失败', error: String(err) });
  }
}

// 保存交易历史
async function saveTransactionHistory(req, res) {
  try {
    const {
      projectCode,
      tradeType,
      amount,
      price,
      total,
      userAddress,
      transactionHash,
      blockNumber,
      userId,
      // 添加合约信息字段
      tradeContractABI,
      compliantERC20ABI,
      tokenAddressNative,
      tokenAddressInterest,
      loanIssuerWalletAddress
    } = req.body;

    // 验证必需参数
    if (!projectCode || !tradeType || !amount || !userAddress || !transactionHash) {
      return res.status(400).json({ 
        status: 1, 
        message: '缺少必需参数' 
      });
    }

    console.log('💾 保存交易历史:', {
      projectCode,
      tradeType,
      amount,
      price,
      total,
      userAddress,
      transactionHash,
      blockNumber,
      userId,
      tradeContractABI: tradeContractABI ? 'provided' : 'not provided',
      compliantERC20ABI: compliantERC20ABI ? 'provided' : 'not provided',
      tokenAddressNative: tokenAddressNative || 'not provided',
      tokenAddressInterest: tokenAddressInterest || 'not provided',
      loanIssuerWalletAddress: loanIssuerWalletAddress || 'not provided'
    });

    // 准备插入数据
    const transactionData = {
      user_id: userId || null, // 使用传入的userId，如果没有则为null
      network_type: 'TESTNET', // 使用枚举值
      user_wallet_address: userAddress,
      project_code: projectCode,
      purchase_amount: parseFloat(amount),
      trade_type: tradeType === 'buy' ? 'BUY_TOKEN' : 'SELL_INTEREST', // 转换为枚举值
      transaction_hash: transactionHash,
      block_number: blockNumber || 0,
      trade_timestamp: Math.floor(Date.now() / 1000), // 使用Unix时间戳
      trade_contract_abi: tradeContractABI || '', // 使用传入的合约ABI
      compliant_erc20_abi: compliantERC20ABI || '', // 使用传入的ERC20 ABI
      token_address_native: tokenAddressNative || '', // 使用传入的原生代币地址
      token_address_interest: tokenAddressInterest || '', // 使用传入的利息代币地址
      loan_issuer_wallet_address: loanIssuerWalletAddress || '', // 使用传入的贷款发行者地址
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 插入交易记录
    const sql = `
      INSERT INTO transaction (
        user_id, network_type, user_wallet_address, project_code,
        purchase_amount, trade_type, transaction_hash, block_number,
        trade_timestamp, trade_contract_abi, compliant_erc20_abi,
        token_address_native, token_address_interest, loan_issuer_wallet_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      transactionData.user_id,
      transactionData.network_type,
      transactionData.user_wallet_address,
      transactionData.project_code,
      transactionData.purchase_amount,
      transactionData.trade_type,
      transactionData.transaction_hash,
      transactionData.block_number,
      transactionData.trade_timestamp,
      transactionData.trade_contract_abi,
      transactionData.compliant_erc20_abi,
      transactionData.token_address_native,
      transactionData.token_address_interest,
      transactionData.loan_issuer_wallet_address
    ];

    const [result] = await pool.execute(sql, params);
    
    console.log('✅ 交易历史保存成功，ID:', result.insertId);

    return res.status(200).json({
      status: 0,
      message: '交易历史保存成功',
      data: {
        id: result.insertId,
        ...transactionData
      }
    });

  } catch (error) {
    console.error('❌ 保存交易历史失败:', error);
    return res.status(500).json({
      status: 1,
      message: '保存交易历史失败: ' + error.message
    });
  }
}

// 获取交易历史
async function getTransactionHistory(req, res) {
  try {
    const { userAddress, projectCode, limit = 50, offset = 0 } = req.query;
    
    console.log('📊 获取交易历史参数:', { userAddress, projectCode, limit, offset });
    
    // 构建查询条件
    let whereConditions = [];
    let queryParams = [];
    
    if (userAddress) {
      whereConditions.push('user_wallet_address = ?');
      queryParams.push(userAddress);
    }
    
    if (projectCode) {
      whereConditions.push('project_code = ?');
      queryParams.push(projectCode);
    }
    
    // 构建SQL查询
    let sql = `
      SELECT 
        project_code,
        purchase_amount,
        trade_type,
        created_at
      FROM transaction
    `;
    
    if (whereConditions.length > 0) {
      sql += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(parseInt(limit), parseInt(offset));
    
    console.log('💾 执行SQL查询:', sql);
    console.log('💾 查询参数:', queryParams);
    
    const [results] = await pool.execute(sql, queryParams);
    
    console.log('✅ 获取交易历史成功，共', results.length, '条记录');
    
    return res.status(200).json({
      status: 0,
      message: '获取交易历史成功',
      data: results
    });
    
  } catch (error) {
    console.error('❌ 获取交易历史失败:', error);
    return res.status(500).json({
      status: 1,
      message: '获取交易历史失败: ' + error.message
    });
  }
}

module.exports = { 
  importBlockTransactions,
  saveTransactionHistory,
  getTransactionHistory
};
