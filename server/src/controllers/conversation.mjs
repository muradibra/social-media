import Conversation from "../mongoose/schemas/conversation.mjs";
import User from "../mongoose/schemas/user.mjs";

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      $or: [{ user1: userId }, { user2: userId }],
    }).populate('user1 user2', 'name email username')
      .populate('messages');

    res.status(200).json({ message: 'Conversations found', items: conversations });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserConversation = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const userId = req.user.id;

    if (userId === receiverId) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const userExists = await User.findById(receiverId);

    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    let conversation = await Conversation.findOne({
      $or: [
        { user1: userId, user2: receiverId },
        { user1: receiverId, user2: userId },
      ]
    }).populate('user1 user2', 'name email username')
      .populate('messages');

    if (conversation) {
      if (conversation.user1._id.toString() === userId.toString()) {
        conversation.user1UnreadMessageCount = 0;
      } else {
        conversation.user2UnreadMessageCount = 0;
      }
      await conversation.save();

      return res.status(200).json({ message: 'Conversation found', item: conversation });
    }

    conversation = await Conversation.create({
      user1: userId,
      user2: receiverId,
    });

    res.status(200).json({ message: 'Conversation created', item: conversation });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const conversationController = {
  getAll,
  getUserConversation,
};

export default conversationController;
