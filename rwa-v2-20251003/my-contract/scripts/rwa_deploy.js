import 'dotenv/config';
import { ethers } from 'hardhat';

async function main() {
  console.log('开始部署 CertificateToken / LoanIssuer 到 Sepolia ...');

  const [deployer] = await ethers.getSigners();
  const bal = await ethers.provider.getBalance(deployer.address);
  console.log(`部署者: ${deployer.address}`);
  console.log(`余额: ${ethers.formatEther(bal)} ETH`);

  // 1) 部署 KYCRegistry（构造函数参数：EIP-712 域名）
  const kyc = await ethers.deployContract('KYCRegistry', ['KYC-Registry']);
  console.log('======= KYCRegistry 参数传入成功 =======');
  await kyc.waitForDeployment();
  const kycAddr = await kyc.getAddress();
  console.log('✔ KYCRegistry:', kycAddr);

  // 2) 部署本金币 LPT  (name, symbol, kycAddr)
  const lpt = await ethers.deployContract('CertificateToken', [
    'Loan-Principal-Token',
    'LPT',
    kycAddr,
  ]);
  console.log('======= LPT 参数传入成功 =======');
  await lpt.waitForDeployment();
  const lptAddr = await lpt.getAddress();
  console.log('✔ 本金币(LPT) 地址:', lptAddr);

  // 3) 部署利息币 LIT  (⚠ 你的原脚本把 LIT 也写成了 LPT，这里修正)
  const lit = await ethers.deployContract('CertificateToken', [
    'Loan-Interest-Token',
    'LIT',
    kycAddr,
  ]);
  console.log('======= LIT 参数传入成功 =======');
  await lit.waitForDeployment();
  const litAddr = await lit.getAddress();
  console.log('✔ 利息币(LIT) 地址:', litAddr);

  // 4) 部署 LoanIssuer 并接线
  const issuer = await ethers.deployContract('LoanIssuer', [kycAddr, lptAddr, litAddr]);
  console.log('======= LoanIssuer 参数传入成功 =======');
  await issuer.waitForDeployment();
  const issuerAddr = await issuer.getAddress();
  console.log('✔ LoanIssuer:', issuerAddr);

  // 5) 把两枚代币的所有权转给 LoanIssuer
  await (await lpt.transferOwnership(issuerAddr)).wait();
  await (await lit.transferOwnership(issuerAddr)).wait();
  console.log('✔ 代币所有权已转移到 LoanIssuer');

  // 6) 让 LoanIssuer 完成内部控制器接线
  await (await issuer.wireControllers()).wait();
  console.log('✔ 控制器接线完成');

  // 7) 输出总结（也可写入文件给前端用）
  console.log('✅ 全部部署完成');
  console.log(JSON.stringify({ kycAddr, lptAddr, litAddr, issuerAddr }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
