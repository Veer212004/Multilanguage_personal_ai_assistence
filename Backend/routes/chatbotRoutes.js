import express from 'express';
import Conversation from '../models/Conversation.js';  // ✅ Use existing file
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Create or get conversation session
router.post('/conversation/start', optionalAuth, async (req, res) => {
  try {
    const { sessionId, userEmail, userAgent, ipAddress } = req.body;
    
    console.log('🤖 Starting conversation:', { sessionId, userEmail });

    // Check if conversation already exists
    let conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        sessionId,
        userEmail: userEmail || null,
        userId: req.user?.userId || null, // If user is authenticated
        userAgent: userAgent || req.headers['user-agent'],
        ipAddress: ipAddress || req.ip,
        messages: []
      });
      
      await conversation.save();
      console.log('✅ New conversation created:', conversation._id);
    } else {
      // Update last activity
      conversation.lastActivity = new Date();
      await conversation.save();
      console.log('🔄 Existing conversation updated:', conversation._id);
    }

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      sessionId: conversation.sessionId
    });

  } catch (error) {
    console.error('❌ Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation'
    });
  }
});

// Store message
router.post('/conversation/message', async (req, res) => {
  try {
    const { sessionId, message, messageType, messageId } = req.body;
    
    console.log('💬 Storing message:', { sessionId, messageType, messageId });

    const conversation = await Conversation.findOne({ sessionId });
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Add message to conversation
    const newMessage = {
      type: messageType, // 'user' or 'bot'
      content: message,
      messageId: messageId || Date.now().toString(),
      timestamp: new Date()
    };

    conversation.messages.push(newMessage);
    conversation.lastActivity = new Date();
    
    await conversation.save();

    console.log('✅ Message stored:', newMessage.messageId);

    res.status(200).json({
      success: true,
      messageId: newMessage.messageId
    });

  } catch (error) {
    console.error('❌ Error storing message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to store message'
    });
  }
});

// Get conversation history
router.get('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const conversation = await Conversation.findOne({ sessionId })
      .populate('userId', 'name email')
      .lean();
    
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.status(200).json({
      success: true,
      conversation
    });

  } catch (error) {
    console.error('❌ Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
});

// Get user's conversations (for authenticated users)
router.get('/conversations/user', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const conversations = await Conversation.find({ userId })
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('sessionId startedAt lastActivity messages isActive')
      .lean();

    const total = await Conversation.countDocuments({ userId });

    res.status(200).json({
      success: true,
      conversations,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: conversations.length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching user conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// Get all conversations (for admin)
router.get('/conversations/all', async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    const query = search 
      ? { 
          $or: [
            { sessionId: { $regex: search, $options: 'i' } },
            { userEmail: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const conversations = await Conversation.find(query)
      .populate('userId', 'name email')
      .sort({ lastActivity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Conversation.countDocuments(query);

    res.status(200).json({
      success: true,
      conversations,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: conversations.length
      }
    });

  } catch (error) {
    console.error('❌ Error fetching all conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// End conversation
router.post('/conversation/end', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    const conversation = await Conversation.findOneAndUpdate(
      { sessionId },
      { 
        isActive: false,
        lastActivity: new Date()
      },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    console.log('🔚 Conversation ended:', sessionId);

    res.status(200).json({
      success: true,
      message: 'Conversation ended successfully'
    });

  } catch (error) {
    console.error('❌ Error ending conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to end conversation'
    });
  }
});

// Delete conversation (admin only)
router.delete('/conversation/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const conversation = await Conversation.findOneAndDelete({ sessionId });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    console.log('🗑️ Conversation deleted:', sessionId);

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation'
    });
  }
});

export default router;