import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  isAuthenticated: false,
  providerId: String,
  providerType: String
});

userSchema.pre('save', (next) => {
  const user = this;
  mongoose.models['User'].findOne({ email: user.email }, 'email', (err, results) => {
    if (results) {
      user.invalidate('email');
      next(new Error('User Email must be unique, another one take this email'));
    } else {
      next();
    }
  });
});
const User = mongoose.model('User', userSchema);

export default User;
