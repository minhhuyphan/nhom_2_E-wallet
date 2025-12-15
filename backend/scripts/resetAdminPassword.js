// Script reset password Admin
// Chạy: node scripts/resetAdminPassword.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  balance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const resetPassword = async () => {
  try {
    await connectDB();

    const newPassword = 'admin123';
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const result = await User.findOneAndUpdate(
      { username: 'admin' },
      { password: hashedPassword, role: 'admin' },
      { new: true }
    );

    if (result) {
      console.log('✅ Reset password thành công!');
      console.log('═══════════════════════════════════');
      console.log('👤 Username: admin');
      console.log('🔑 Password: admin123');
      console.log('🎭 Role: admin');
      console.log('═══════════════════════════════════');
    } else {
      console.log('❌ Không tìm thấy admin');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetPassword();
