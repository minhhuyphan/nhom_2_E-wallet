// Script tạo tài khoản Admin
// Chạy: node scripts/createAdmin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// User Schema (copy từ models/User.js)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  walletAddress: { type: String, default: null },
  avatar: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Tạo Admin
const createAdmin = async () => {
  try {
    await connectDB();

    // Thông tin admin
    const adminData = {
      username: 'admin',
      email: 'admin@etherlottery.com',
      password: 'admin123', // Đổi password này!
      role: 'admin',
      balance: 1000000,
      isActive: true
    };

    // Kiểm tra admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ username: adminData.username });
    
    if (existingAdmin) {
      console.log('⚠️  Admin đã tồn tại!');
      console.log('📧 Username:', existingAdmin.username);
      console.log('👤 Role:', existingAdmin.role);
      
      // Update role thành admin nếu chưa phải
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Đã cập nhật role thành admin');
      }
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Tạo admin mới
      const admin = await User.create({
        ...adminData,
        password: hashedPassword
      });

      console.log('✅ Tạo tài khoản Admin thành công!');
      console.log('═══════════════════════════════════');
      console.log('👤 Username: admin');
      console.log('🔑 Password: admin123');
      console.log('📧 Email: admin@etherlottery.com');
      console.log('🎭 Role: admin');
      console.log('═══════════════════════════════════');
      console.log('⚠️  Hãy đổi password sau khi đăng nhập!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();
