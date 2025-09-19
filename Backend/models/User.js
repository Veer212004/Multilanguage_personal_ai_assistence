import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Optional: Track when password was last changed
  passwordChangedAt: {
    type: Date,
    default: Date.now
  },
  // ... other fields
}, { timestamps: true });

export default mongoose.model("User", userSchema);
