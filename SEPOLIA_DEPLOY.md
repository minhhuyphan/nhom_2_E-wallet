# 🚀 Hướng dẫn Deploy lên Sepolia Testnet

## ❓ Tại sao dùng Sepolia thay vì Hoodi?

**Hoodi network không tồn tại hoặc không public.** Sepolia là Ethereum testnet chính thức, stable và được support tốt.

## 📋 Các bước Deploy

### **Bước 1: Chuẩn bị**

#### 1.1. Cài đặt dependencies (nếu chưa có)
```bash
npm install
```

#### 1.2. Lấy Sepolia ETH miễn phí
Truy cập một trong các faucet sau và nhập địa chỉ ví của bạn:
- https://sepoliafaucet.com
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

**Lưu ý:** Bạn cần ~0.1 ETH để deploy

#### 1.3. Lấy RPC URL từ Alchemy (Miễn phí)
1. Đăng ký tại: https://alchemy.com
2. Tạo app mới → Chọn **Ethereum** → Chọn **Sepolia**
3. Copy API Key
4. RPC URL sẽ có dạng: `https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY`

#### 1.4. Cấu hình file .env
Mở file `.env` và update:
```env
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
```

**⚠️ Cách lấy Private Key:**
- MetaMask → 3 chấm → Account details → Show private key
- Copy (64 ký tự hex, không cần 0x)

### **Bước 2: Deploy Contract**

```bash
npm run compile
npm run deploy
```

**Kết quả sẽ như:**
```
🚀 Deploying Lottery contract to Sepolia testnet...
📝 Deploying with account: 0xYourAddress...
💰 Account balance: 0.1 ETH
⏳ Deploying contract...
✅ Lottery deployed to: 0xContractAddress123...
🎫 Entrance fee: 0.001 ETH

📄 Deployment info saved to deployments/sepolia.json
```

### **Bước 3: Copy Contract Address**

Sau khi deploy thành công, copy contract address và update vào:

**File:** `frontend/js/lottery.js` (dòng 8)
```javascript
const CONTRACT_ADDRESS = "0xYourContractAddressHere";
```

### **Bước 4: Test trên Frontend**

```bash
npm run frontend
```

Mở: http://localhost:5500/html/index.html

**MetaMask sẽ tự động:**
1. Chuyển sang Sepolia Testnet
2. Yêu cầu kết nối ví
3. Sẵn sàng để chơi!

## 🎮 Cách sử dụng

### User (Người chơi)
1. Kết nối MetaMask
2. Click "Tham gia ngay" → Trả 0.001 ETH
3. Chờ admin rút thăm
4. Nếu trúng → Nhận toàn bộ prize pool!

### Admin (Người deploy)
1. Kết nối với ví đã deploy
2. Click "Rút thăm" (chỉ admin thấy button này)
3. Contract tự động chọn người thắng ngẫu nhiên
4. Tiền gửi tự động cho winner

## 🔍 Verify Contract trên Etherscan

Để verify contract:
1. Lấy Etherscan API key: https://etherscan.io/myapikey
2. Thêm vào `.env`:
   ```env
   ETHERSCAN_API_KEY=your_api_key
   ```
3. Chạy:
   ```bash
   npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS
   ```

## 📱 View Contract trên Etherscan

https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

## 🛠️ Troubleshooting

### Lỗi: "insufficient funds"
→ Lấy thêm Sepolia ETH từ faucet

### Lỗi: "nonce too high"  
→ Reset MetaMask: Settings → Advanced → Clear activity tab data

### Lỗi: "network not found"
→ Kiểm tra `SEPOLIA_RPC_URL` trong file `.env`

### Contract không kết nối
→ Đảm bảo đã update `CONTRACT_ADDRESS` trong `lottery.js`

## 🎉 Xong!

Deploy thành công! Giờ bạn có thể:
- ✅ Mời người dùng tham gia xổ số
- ✅ Rút thăm người thắng (admin)
- ✅ Xem history trên Etherscan
- ✅ Play slot machine (frontend feature)

**Chúc may mắn!** 🍀
