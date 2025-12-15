# Ether Lottery Backend API

Backend server cho dự án Ether Lottery với Node.js, Express và MongoDB.

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình môi trường

Mở file `.env` và thay thế `<db_password>` bằng mật khẩu MongoDB thực của bạn:

```env
MONGODB_URI=mongodb+srv://nguyentrivinhntv_db_user:YOUR_PASSWORD@cluster0.d7mbobc.mongodb.net/ether_lottery?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=ether_lottery_super_secret_key_2024
PORT=5000
```

### 3. Chạy server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|---------------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại | ✅ |
| PUT | `/api/auth/change-password` | Đổi mật khẩu | ✅ |
| POST | `/api/auth/logout` | Đăng xuất | ✅ |

### Health Check

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server status |

## 📝 Request/Response Examples

### Đăng ký
```json
POST /api/auth/register
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

### Đăng nhập
```json
POST /api/auth/login
{
  "username": "user123",
  "password": "password123"
}
```

## 🔒 Authentication

API sử dụng JWT (JSON Web Token). Thêm token vào header:

```
Authorization: Bearer <your_token>
```