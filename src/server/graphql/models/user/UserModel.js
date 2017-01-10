import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {type: String, unique: true},
  password: String,
  isAuthenticated: false
});

userSchema.pre("save", function (next) {
  var user = this;
  mongoose.models["User"].findOne({email: user.email}, 'email', function (err, results) {
    if (results) {
      user.invalidate("email");
      next(new Error("User Email must be unique, another one take this username"))
    } else {
      next()
    }
  })
});
const User = mongoose.model('User', userSchema);

export default User;
