# 🎰 Ether Lottery - Deploy lên Hoodi Testnet

## 📋 Hướng dẫn Deploy Smart Contract

### 1️⃣ Chuẩn bị

#### Cài đặt dependencies
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox dotenv
```

#### Tạo file .env
Copy file `.env.example` thành `.env` và điền thông tin:
```bash
cp .env.example .env
```

Mở `.env` và thêm private key của bạn:
```env
PRIVATE_KEY=your_metamask_private_key_here
```

**⚠️ Lưu ý:** 
- Không commit file `.env` lên Git
- Để lấy private key: MetaMask → Account details → Export private key
- Đảm bảo ví có đủ HODI testnet token để deploy

#### Lấy Hoodi testnet token
1. Truy cập faucet: https://faucet.hoodi.network
2. Nhập địa chỉ ví của bạn
3. Nhận token miễn phí để test

### 2️⃣ Compile Smart Contract

```bash
npx hardhat compile
```

Kết quả: Contract sẽ được compile và lưu trong `artifacts/`

### 3️⃣ Deploy lên Hoodi Testnet

```bash
npx hardhat run scripts/deploy.js --network hoodi
```

**Output sẽ như:**
```
🚀 Deploying Lottery contract to Hoodi testnet...
📝 Deploying with account: 0xYourAddress...
💰 Account balance: 10.0 ETH
⏳ Deploying contract...
✅ Lottery deployed to: 0xContractAddress123...
🎫 Entrance fee: 0.001 ETH

📄 Deployment info saved to deployments/hoodi.json
📄 Contract ABI saved to deployments/Lottery.json

✨ Deployment complete!

📋 Next steps:
1. Update CONTRACT_ADDRESS in frontend/js/lottery.js
2. Update CONTRACT_ABI in frontend/js/lottery.js
3. Make sure MetaMask is connected to Hoodi testnet
```

### 4️⃣ Cập nhật Frontend

Mở file `frontend/js/lottery.js` và update:

```javascript
const CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; // Địa chỉ contract vừa deploy
```

ABI đã được thêm sẵn trong code rồi.

### 5️⃣ Test Contract

Chạy frontend:
```bash
cd frontend
npx http-server -p 5500
```

Mở browser: `http://localhost:5500/html/index.html`

**Các bước test:**
1. ✅ Kết nối MetaMask
2. ✅ MetaMask sẽ tự động chuyển sang Hoodi Testnet
3. ✅ Click "Tham gia ngay" để mua vé (0.001 HODI)
4. ✅ Admin có thể click "Rút thăm" để chọn người thắng

## 🔧 Cấu hình Hoodi Testnet

**Network Details:**
- Chain ID: `990011` (0xF1BFB)
- RPC URL: `https://rpc-testnet.hoodi.network`
- Currency: HODI
- Explorer: `https://testnet.hoodi.network`

Code đã tự động thêm network vào MetaMask khi bạn kết nối!

## 📁 Cấu trúc Project

```
nhom_2_Ether_Lottery/
├── contracts/
│   └── Lottery.sol           # Smart contract xổ số
├── scripts/
│   ├── deploy.js             # Script deploy
│   └── verify.js             # Script verify (optional)
├── deployments/              # Thông tin deploy (tự tạo)
│   ├── hoodi.json           # Contract address, deployer...
│   └── Lottery.json         # Contract ABI
├── frontend/
│   └── js/
│       ├── lottery.js        # Main logic
│       └── hoodi-config.js   # Hoodi network config
├── hardhat.config.js         # Hardhat config
└── .env                      # Private key (GIT IGNORE!)
```

## 🎮 Functions trong Contract

| Function | Mô tả | Ai có thể gọi |
|----------|-------|---------------|
| `enter()` | Tham gia xổ số (phí: 0.001 ETH) | Ai cũng được |
| `pickWinner()` | Chọn người thắng ngẫu nhiên | Chỉ manager |
| `getPlayers()` | Xem danh sách người chơi | Ai cũng được |
| `getBalance()` | Xem số dư contract | Ai cũng được |
| `setEntranceFee()` | Đổi phí vào | Chỉ manager |

## 🔥 Lệnh hữu ích

```bash
# Compile contract
npx hardhat compile

# Deploy
npx hardhat run scripts/deploy.js --network hoodi

# Run tests (nếu có)
npx hardhat test

# Clean artifacts
npx hardhat clean

# Console (interact với contract)
npx hardhat console --network hoodi
```

## ❓ Troubleshooting

### Lỗi: "insufficient funds"
→ Cần thêm HODI token từ faucet

### Lỗi: "nonce too high"
→ Reset MetaMask: Settings → Advanced → Clear activity tab data

### Lỗi: "network not found"
→ Kiểm tra file `.env` và `hardhat.config.js`

### Contract không hiển thị trên frontend
→ Kiểm tra `CONTRACT_ADDRESS` đã update đúng chưa

## 🎉 Xong rồi!

Deploy thành công! Giờ bạn có thể:
- ✅ Cho người dùng tham gia xổ số
- ✅ Rút thăm người thắng
- ✅ Xem lịch sử giao dịch trên Hoodi Explorer
- ✅ Chơi slot machine (frontend feature)

**Contract Explorer:** https://testnet.hoodi.network/address/YOUR_CONTRACT_ADDRESS

Good luck! 🚀
