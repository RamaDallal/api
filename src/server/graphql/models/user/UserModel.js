import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  isAuthenticated: false,
  providerId: String,
  providerType: String,
  avatar: String,
  displayName: String
});

const User = mongoose.model('User', userSchema);

export default User;
