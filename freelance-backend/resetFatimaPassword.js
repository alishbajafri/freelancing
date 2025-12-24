import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/User.js'; // Path to your User model

// 1️⃣ Connect to MongoDB
const MONGO_URI = 'mongodb+srv://alishbafatima2018_db_user:FISkPKKZlaRN01Uz@cluster0.ubpz60r.mongodb.net/freelanceDB?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

async function resetPassword(email, newPassword) {
  try {
    // 2️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 3️⃣ Update only the password
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    if (!user) {
      console.log('User not found!');
    } else {
      console.log(`✅ Password for ${email} reset successfully to "${newPassword}"`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

// 4️⃣ Run the reset for Fatima
resetPassword('fatima.dev@example.com', 'FatimaDemo123!');
