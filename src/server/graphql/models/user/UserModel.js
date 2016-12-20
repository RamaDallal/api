import mongoose, {Schema} from 'mongoose';

const userSchema = new Schema({
  username: String,
  password: String
});

var User = mongoose.model('User', userSchema);

export default User;