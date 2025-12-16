// Hoodi Testnet Configuration
const HOODI_CONFIG = {
  chainId: "0xF1BFB", // 990011 in hex
  chainName: "Hoodi Testnet",
  nativeCurrency: {
    name: "Hoodi",
    symbol: "HODI",
    decimals: 18
  },
  rpcUrls: ["https://rpc-testnet.hoodi.network"],
  blockExplorerUrls: ["https://testnet.hoodi.network"]
};

// Function to add Hoodi network to MetaMask
async function addHoodiNetwork() {
  if (!window.ethereum) {
    console.error("MetaMask not installed");
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [HOODI_CONFIG]
    });
    console.log("✅ Hoodi network added to MetaMask");
    return true;
  } catch (error) {
    console.error("Error adding Hoodi network:", error);
    return false;
  }
}

// Function to switch to Hoodi network
async function switchToHoodi() {
  if (!window.ethereum) {
    console.error("MetaMask not installed");
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: HOODI_CONFIG.chainId }]
    });
    console.log("✅ Switched to Hoodi testnet");
    return true;
  } catch (error) {
    // If network not added yet, add it
    if (error.code === 4902) {
      return await addHoodiNetwork();
    }
    console.error("Error switching to Hoodi:", error);
    return false;
  }
}

// Check if connected to Hoodi
async function isHoodiNetwork() {
  if (!window.ethereum) return false;
  
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  return chainId === HOODI_CONFIG.chainId;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HOODI_CONFIG, addHoodiNetwork, switchToHoodi, isHoodiNetwork };
}
