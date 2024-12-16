import Conversation from "../mongoose/schemas/conversation.mjs";
import Message from "../mongoose/schemas/message.mjs";

export function socketHandlers(socket, socketUsers) {
  socket.on('register', (data) => onRegister(data, socket, socketUsers));

  socket.on('message', (data) => onMessage(data, socket, socketUsers));

  socket.on('mark-as-read', (data) => onReadAll(data, socket, socketUsers));

  socket.on('disconnect', () => onDisconnect(socket, socketUsers));
}

function onRegister({ userId }, socket, socketUsers) {
  socketUsers.push({ userId, socketId: socket.id });
}

async function onReadAll({ conversationId }) {
  try {
    await Conversation.findByIdAndUpdate(conversationId, {
      user1UnreadMessageCount: 0,
      user2UnreadMessageCount: 0,
    });
  } catch (error) {
    console.log(error);

  }
}

async function onMessage({ to, from, message, conversationId }, socket, socketUsers) {
  try {
    const toSocketId = socketUsers.find((user) => user.userId === to)?.socketId;

    const newMessage = await Message.create({ content: message, user: from });

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return;
    conversation.messages.push(newMessage._id);
    if (conversation.user1.toString() === to) {
      conversation.user1UnreadMessageCount += 1;
    } else {
      conversation.user2UnreadMessageCount += 1;
    }
    await conversation.save();

    const unreadCount = conversation.user1.toString() === to ?
      conversation.user1UnreadMessageCount :
      conversation.user2UnreadMessageCount;

    if (toSocketId) {
      socket.to(toSocketId).emit('message', { message, from, conversationId: conversation._id, unreadCount });
    }
  } catch (error) {
    console.log(error);
  }
}

function onDisconnect(socket, socketUsers) {
  console.log('user disconnected', socket.id);
  const userIdx = socketUsers.findIndex((user) => user.socketId === socket.id);
  socketUsers.splice(userIdx, 1);
}