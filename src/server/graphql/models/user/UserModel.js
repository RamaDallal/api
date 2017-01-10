import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: String,
  password: String,
  isAuthenticated: false
});

const User = mongoose.model('User', userSchema);

export default User;
