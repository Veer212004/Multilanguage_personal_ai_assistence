import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [50, "Name cannot exceed 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser;
    },
    minlength: [6, "Password must be at least 6 characters"],
  },
  picture: {
    type: String,
    default: "",
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{
  timestamps: true,
});

// Index for faster email lookups
userSchema.index({ email: 1 });

// ✅ Add pre-save middleware for additional validation
userSchema.pre("save", function (next) {
  // Additional validation can go here
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.name) {
    this.name = this.name.trim();
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
