import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  messageId: {
    type: String,
    unique: true
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // null for anonymous users
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userEmail: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  messages: [messageSchema],
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String
  }],
  metadata: {
    type: Map,
    of: String,
    default: {}
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ userId: 1 });
conversationSchema.index({ userEmail: 1 });
conversationSchema.index({ startedAt: -1 });

export default mongoose.model('Conversation', conversationSchema);