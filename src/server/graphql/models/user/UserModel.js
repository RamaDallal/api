import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  username: String,
  password: String,
  isAuthenticated: false
});

const User = mongoose.model('User', userSchema);

export default User;
