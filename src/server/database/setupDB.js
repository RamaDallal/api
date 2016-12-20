import mongoose from 'mongoose';

export default function SetupDB(db) {
  return mongoose.connect(db);
}
