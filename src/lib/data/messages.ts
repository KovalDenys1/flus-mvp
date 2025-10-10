
export type Message = {
  id: string;
  conversationId: string;
  // ID of the user who sent the message
  senderId: string;
  // Message text
  text: string;
  createdAt: string;
  // Read status
  isRead: boolean;
};
// Temporary in-memory storage. Replace with a database in production.
const messages: Message[] = [];

// Demo messages for synthetic demo conversation
const demoMessages: Message[] = [
  {
    id: "demo_msg_1",
    conversationId: `demo_conv_demo_user`,
    senderId: "demo_employer",
    text: "Hei! Takk for at du søkte — kan du starte allerede denne uken?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    isRead: true,
  },
  {
    id: "demo_msg_2",
    conversationId: `demo_conv_demo_user`,
    senderId: "demo_user",
    text: "Hei! Ja, jeg kan starte tirsdag. Når vil du at jeg møter opp?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 30).toISOString(),
    isRead: true,
  },
  {
    id: "demo_msg_3",
    conversationId: `demo_conv_demo_user`,
    senderId: "demo_employer",
    text: "Flott — la oss si kl 09:00 ved hovedinngangen. Ta med arbeidskleder.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60).toISOString(),
    isRead: false,
  },
];
/**
 * Adds a new message to a conversation.
 */
export function createMessage(conversationId: string, senderId: string, text: string): Message {
  const message: Message = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    conversationId,
    senderId,
    text,
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  messages.push(message);
  return message;
}

/**
 * Returns all messages for a given conversation.
 */
export function getMessagesForConversation(conversationId: string): Message[] {
  // If this is a demo conversation, return demo messages with the user's id substituted.
  if (conversationId.startsWith("demo_conv_")) {
    // conversationId is demo_conv_<userId>
    const userId = conversationId.replace("demo_conv_", "");
    return demoMessages.map(dm => ({
      ...dm,
      conversationId,
      senderId: dm.senderId === "demo_user" ? userId : dm.senderId,
      id: dm.id + `_${userId}`,
    })).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  return messages.filter(m => m.conversationId === conversationId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/**
 * Marks messages as read for a given user in a conversation.
 */
export function markMessagesAsRead(conversationId: string, userId: string): void {
  messages.forEach(message => {
    if (message.conversationId === conversationId && message.senderId !== userId) {
      message.isRead = true;
    }
  });
}
