// 部署腳本
const hre = require("hardhat");

async function main() {
  console.log("開始部署投票合約...");

  // 獲取合約工廠
  const Voting = await hre.ethers.getContractFactory("Voting");
  
  // 部署合約
  const voting = await Voting.deploy();
  
  // 等待合約部署完成
  await voting.waitForDeployment();
  
  // 獲取合約地址
  const votingAddress = await voting.getAddress();
  
  console.log(`投票合約已部署到地址: ${votingAddress}`);
}

// 執行部署
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署過程中發生錯誤:", error);
    process.exit(1);
  });
