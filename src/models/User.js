import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const LinkSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String }, 
  order: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
});

const UserSchema = new Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  bio: String,
  image: String,
  username: { type: String, unique: true, sparse: true }, 
  theme: { type: String, default: 'minimal' },
  views: { type: Number, default: 0 },
  links: [LinkSchema],
}, { timestamps: true });

// This check is vital for Next.js hot reloading
const User = models.User || model('User', UserSchema);

export default User;