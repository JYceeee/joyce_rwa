import 'dotenv/config';
import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('🚀 开始部署到 Sepolia 测试网...\n');

  // ========== 获取部署者 ==========
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`部署者地址: ${deployer.address}`);
  console.log(`部署者余额: ${ethers.formatEther(balance)} ETH\n`);

  // ========== 1. 部署 KYCRegistry ==========
  const kyc = await ethers.deployContract('KYCRegistry', ['KYC-Registry']);
  console.log('📌 正在部署 KYCRegistry...');
  await kyc.waitForDeployment();
  const kycAddr = await kyc.getAddress();
  console.log(`✅ KYCRegistry 部署成功: ${kycAddr}\n`);

  // ========== 2. 部署本金币 (LPT) ==========
  const lpt = await ethers.deployContract('CertificateToken', [
    'Loan-Principal-Token',
    'LPT',
    kycAddr,
  ]);
  console.log('📌 正在部署 LPT...');
  await lpt.waitForDeployment();
  const lptAddr = await lpt.getAddress();
  console.log(`✅ LPT 部署成功: ${lptAddr}\n`);

  // ========== 3. 部署利息币 (LIT) ==========
  const lit = await ethers.deployContract('CertificateToken', [
    'Loan-Interest-Token',
    'LIT',
    kycAddr,
  ]);
  console.log('📌 正在部署 LIT...');
  await lit.waitForDeployment();
  const litAddr = await lit.getAddress();
  console.log(`✅ LIT 部署成功: ${litAddr}\n`);

  // ========== 4. 部署 LoanIssuer ==========
  const issuer = await ethers.deployContract('LoanIssuer', [
    kycAddr,
    lptAddr,
    litAddr,
  ]);
  console.log('📌 正在部署 LoanIssuer...');
  await issuer.waitForDeployment();
  const issuerAddr = await issuer.getAddress();
  console.log(`✅ LoanIssuer 部署成功: ${issuerAddr}\n`);

  // ========== 5. 所有权转移 ==========
  console.log('📌 正在转移代币所有权...');
  await (await lpt.transferOwnership(issuerAddr)).wait();
  await (await lit.transferOwnership(issuerAddr)).wait();
  console.log('✅ LPT 与 LIT 所有权已转移给 LoanIssuer\n');

  // ========== 6. 控制器接线 ==========
  console.log('📌 正在执行 LoanIssuer.wireControllers()...');
  await (await issuer.wireControllers()).wait();
  console.log('✅ 控制器接线完成\n');

  // ========== 7. 写入前端 JSON ==========
  const addresses = {
    KYCRegistry: kycAddr,
    LPT: lptAddr,
    LIT: litAddr,
    LoanIssuer: issuerAddr,
    network: 'sepolia',
    deployer: deployer.address,
  };

  const outputPath = path.resolve('../Website/public/contracts/addresses.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(addresses, null, 2));
  console.log(`📝 地址已写入: ${outputPath}\n`);

  console.log('🎉 部署流程全部完成！');
  console.table(addresses);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
