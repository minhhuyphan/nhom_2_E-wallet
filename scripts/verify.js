const hre = require("hardhat");

async function main() {
  const deploymentFile = require(`../deployments/${hre.network.name}.json`);
  const contractAddress = deploymentFile.contractAddress;
  
  console.log("🔍 Verifying contract at:", contractAddress);
  
  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("✅ Contract verified!");
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
