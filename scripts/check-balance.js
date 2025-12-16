const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📍 Network:", hre.network.name);
  console.log("💼 Address:", deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  if (parseFloat(hre.ethers.formatEther(balance)) < 0.01) {
    console.log("\n⚠️  Balance quá thấp để deploy!");
    console.log("🔗 Lấy testnet ETH tại:");
    console.log("   - https://sepoliafaucet.com");
    console.log("   - https://faucet.quicknode.com/ethereum/sepolia");
    console.log("   - https://www.alchemy.com/faucets/ethereum-sepolia");
  } else {
    console.log("\n✅ Balance đủ để deploy!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
