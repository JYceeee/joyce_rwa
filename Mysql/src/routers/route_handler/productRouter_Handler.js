const db = require('../../database/dbConfig');

// 获取所有产品列表
const getAllProducts = async (req, res) => {
  try {
    const sql = `
      SELECT 
        product_id,
        name,
        code,
        subtitle,
        image,
        type,
        region,
        risk,
        target_yield,
        current_price,
        collateral_property_value,
        loan_amount,
        target_loan_yield,
        rental_income,
        status,
        created_at,
        updated_at
      FROM rwa_loan_product 
      WHERE status = 'active'
      ORDER BY created_at DESC
    `;
    
    const [rows] = await db.execute(sql);
    
    // 格式化数据以匹配前端字段名
    const formattedProducts = rows.map(product => ({
      id: product.product_id,
      code: product.code,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      type: product.type,
      region: product.region,
      risk: product.risk,
      targetYield: product.target_yield,
      metrics: {
        currentElaraPrice: product.current_price ? `A$${product.current_price.toFixed(2)}` : '-',
        collateralPropertyValue: product.collateral_property_value ? `A$${product.collateral_property_value.toLocaleString()}` : '-',
        loanAmount: product.loan_amount ? `A$${product.loan_amount.toLocaleString()}` : '-',
        targetLoanYield: product.target_loan_yield || '-',
        rentalIncome: product.rental_income || '-'
      },
      status: product.status,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    
    res.cc('获取产品列表成功', 0, formattedProducts);
  } catch (error) {
    console.error('获取产品列表失败:', error);
    res.cc('获取产品列表失败', 1);
  }
};

// 根据产品ID获取产品详情
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const sql = `
      SELECT 
        product_id,
        name,
        code,
        subtitle,
        image,
        type,
        region,
        risk,
        target_yield,
        current_price,
        collateral_property_value,
        loan_amount,
        target_loan_yield,
        rental_income,
        status,
        created_at,
        updated_at
      FROM rwa_loan_product 
      WHERE product_id = ? AND status = 'active'
    `;
    
    const [rows] = await db.execute(sql, [productId]);
    
    if (rows.length === 0) {
      return res.cc('产品不存在或已下架', 1);
    }
    
    // 格式化数据以匹配前端字段名
    const product = rows[0];
    const formattedProduct = {
      id: product.product_id,
      code: product.code,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      type: product.type,
      region: product.region,
      risk: product.risk,
      targetYield: product.target_yield,
      metrics: {
        currentElaraPrice: product.current_price ? `A$${product.current_price.toFixed(2)}` : '-',
        collateralPropertyValue: product.collateral_property_value ? `A$${product.collateral_property_value.toLocaleString()}` : '-',
        loanAmount: product.loan_amount ? `A$${product.loan_amount.toLocaleString()}` : '-',
        targetLoanYield: product.target_loan_yield || '-',
        rentalIncome: product.rental_income || '-'
      },
      status: product.status,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
    
    res.cc('获取产品详情成功', 0, formattedProduct);
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.cc('获取产品详情失败', 1);
  }
};

// 根据产品代码获取产品详情
const getProductByCode = async (req, res) => {
  try {
    const { code } = req.params;
    
    const sql = `
      SELECT 
        product_id,
        name,
        code,
        subtitle,
        image,
        type,
        region,
        risk,
        target_yield,
        current_price,
        collateral_property_value,
        loan_amount,
        target_loan_yield,
        rental_income,
        status,
        created_at,
        updated_at
      FROM rwa_loan_product 
      WHERE code = ? AND status = 'active'
    `;
    
    const [rows] = await db.execute(sql, [code]);
    
    if (rows.length === 0) {
      return res.cc('产品不存在或已下架', 1);
    }
    
    // 格式化数据以匹配前端字段名
    const product = rows[0];
    const formattedProduct = {
      id: product.product_id,
      code: product.code,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      type: product.type,
      region: product.region,
      risk: product.risk,
      targetYield: product.target_yield,
      metrics: {
        currentElaraPrice: product.current_price ? `A$${product.current_price.toFixed(2)}` : '-',
        collateralPropertyValue: product.collateral_property_value ? `A$${product.collateral_property_value.toLocaleString()}` : '-',
        loanAmount: product.loan_amount ? `A$${product.loan_amount.toLocaleString()}` : '-',
        targetLoanYield: product.target_loan_yield || '-',
        rentalIncome: product.rental_income || '-'
      },
      status: product.status,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
    
    res.cc('获取产品详情成功', 0, formattedProduct);
  } catch (error) {
    console.error('获取产品详情失败:', error);
    res.cc('获取产品详情失败', 1);
  }
};

// 创建新产品
const createProduct = async (req, res) => {
  try {
    const {
      product_id,
      name,
      code,
      subtitle,
      image,
      type,
      region,
      risk,
      target_yield,
      current_price,
      collateral_property_value,
      loan_amount,
      target_loan_yield,
      rental_income,
      status = 'active'
    } = req.body;
    
    const sql = `
      INSERT INTO rwa_loan_product (
        product_id, name, code, subtitle, image, type, region, risk,
        target_yield, current_price, collateral_property_value, loan_amount,
        target_loan_yield, rental_income, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      product_id, name, code, subtitle, image, type, region, risk,
      target_yield, current_price, collateral_property_value, loan_amount,
      target_loan_yield, rental_income, status
    ];
    
    const [result] = await db.execute(sql, values);
    
    res.cc('创建产品成功', 0, { id: result.insertId, product_id });
  } catch (error) {
    console.error('创建产品失败:', error);
    res.cc('创建产品失败', 1);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductByCode,
  createProduct
};
