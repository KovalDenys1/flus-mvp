
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

// Demo messages for synthetic demo conversations
const demoMessagesMap: Record<string, Omit<Message, "id" | "conversationId">[]> = {
  // Chat 1: Gressklipping (j1) - 5 days ago
  "1": [
    {
      senderId: "u_employer_1",
      text: "Hei! Takk for søknaden. Er du tilgjengelig på lørdag formiddag?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 30).toISOString(),
      isRead: true,
    },
    {
      senderId: "demo_user",
      text: "Hei! Ja, jeg kan være der kl 10. Hvor lang tid tar det?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 90).toISOString(),
      isRead: true,
    },
    {
      senderId: "u_employer_1",
      text: "Ca 1,5 time. Hagen er ikke så stor. Ta med egne hansker hvis du har 👍",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 120).toISOString(),
      isRead: true,
    },
    {
      senderId: "demo_user",
      text: "Perfekt! Jeg tar med hansker. Sees på lørdag!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 135).toISOString(),
      isRead: false,
    },
  ],
  // Chat 2: IT-hjelp (j2) - 3 days ago
  "2": [
    {
      senderId: "u_employer_2",
      text: "Hei! Trenger hjelp med Wi-Fi setup. Kan du komme i kveld?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      isRead: true,
    },
    {
      senderId: "demo_user",
      text: "Hei! Ja, jeg kan komme rundt kl 18. Hva er problemet?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 45).toISOString(),
      isRead: true,
    },
    {
      senderId: "u_employer_2",
      text: "Ny ruter som må konfigureres. Har du erfaring med TP-Link?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 60).toISOString(),
      isRead: false,
    },
  ],
  // Chat 3: Vaske sykkel (j21) - 1 day ago
  "3": [
    {
      senderId: "u_employer_3",
      text: "Hei! Sykkelen trenger grundig vask og litt smøring. Interessert?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      isRead: true,
    },
    {
      senderId: "demo_user",
      text: "Ja, det høres greit ut! Har du alt utstyr?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 20).toISOString(),
      isRead: false,
    },
  ],
  // Chat 4: Rydde løv (j24) - 2 hours ago
  "4": [
    {
      senderId: "u_employer_5",
      text: "Hei! Trenger akutt hjelp i dag. Kan du komme innen 2 timer?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: true,
    },
    {
      senderId: "demo_user",
      text: "Hei! Ja, jeg kan komme med en gang. Send adresse!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 10).toISOString(),
      isRead: true,
    },
    {
      senderId: "u_employer_5",
      text: "Flott! Adressen er Løvveien 12. Se deg der om 30 min? 😊",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 15).toISOString(),
      isRead: true,
    },
    {
      senderId: "demo_user",
      text: "Perfekt! Jeg er på vei 🚴",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 18).toISOString(),
      isRead: false,
    },
  ],
};
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
    // conversationId is demo_conv_<userId>_<chatNumber>
    const parts = conversationId.split("_");
    const chatNumber = parts[parts.length - 1]; // "1", "2", "3", or "4"
    const userId = parts.slice(2, -1).join("_"); // everything between demo_conv_ and _chatNumber
    
    const templateMessages = demoMessagesMap[chatNumber] || [];
    return templateMessages.map((dm, index) => ({
      id: `demo_msg_${conversationId}_${index}`,
      conversationId,
      senderId: dm.senderId === "demo_user" ? userId : dm.senderId,
      text: dm.text,
      createdAt: dm.createdAt,
      isRead: dm.isRead,
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
