const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log(`🚀 Deploying Lottery contract to ${hre.network.name} network...`);
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy contract
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  console.log("⏳ Deploying contract...");
  
  const lottery = await Lottery.deploy();
  await lottery.waitForDeployment();
  
  const contractAddress = await lottery.getAddress();
  console.log("✅ Lottery deployed to:", contractAddress);
  
  // Get entrance fee
  const entranceFee = await lottery.entranceFee();
  console.log("🎫 Entrance fee:", hre.ethers.formatEther(entranceFee), "ETH");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    entranceFee: hre.ethers.formatEther(entranceFee),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };
  
  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📄 Deployment info saved to deployments/" + hre.network.name + ".json");
  
  // Generate ABI for frontend
  const artifact = await hre.artifacts.readArtifact("Lottery");
  fs.writeFileSync(
    path.join(deploymentsDir, "Lottery.json"),
    JSON.stringify(artifact, null, 2)
  );
  
  console.log("📄 Contract ABI saved to deployments/Lottery.json");
  
  console.log("\n✨ Deployment complete!");
  console.log("\n📋 Next steps:");
  console.log("1. Update CONTRACT_ADDRESS in frontend/js/lottery.js");
  console.log("2. Update CONTRACT_ABI in frontend/js/lottery.js");
  console.log("3. Make sure MetaMask is connected to Hoodi testnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
