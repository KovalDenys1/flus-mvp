
export type Conversation = {
  id: string;
  // ID of the user who initiated the chat (e.g., employer)
  initiatorId: string;
  // ID of the user who responded (e.g., job seeker)
  participantId: string;
  // ID of the job posting related to this chat
  jobId: string;
  createdAt: string;
};

// Temporary in-memory storage. Will be replaced by a database in production.
const conversations: Conversation[] = [];

// Demo job ids used for synthetic demo conversations shown to users.
export const DEMO_CONVERSATION_JOB_IDS = ["j1", "j2", "j21", "j24"];

export function makeDemoConversationsForUser(userId: string): Conversation[] {
  return [
    {
      id: `demo_conv_${userId}_1`,
      jobId: "j1", // Gressklipping
      initiatorId: "u_employer_1",
      participantId: userId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    },
    {
      id: `demo_conv_${userId}_2`,
      jobId: "j2", // IT-hjelp
      initiatorId: "u_employer_2",
      participantId: userId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
    {
      id: `demo_conv_${userId}_3`,
      jobId: "j21", // Vaske sykkel
      initiatorId: "u_employer_3",
      participantId: userId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    },
    {
      id: `demo_conv_${userId}_4`,
      jobId: "j24", // Rydde løv i hage
      initiatorId: "u_employer_5",
      participantId: userId,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
  ];
}

/**
 * Finds or creates a new conversation between two users regarding a specific job posting.
 * This ensures that there is only one conversation per job between the same two users.
 */
export function findOrCreateConversation(jobId: string, initiatorId: string, participantId: string): Conversation {
  let conversation = conversations.find(c => 
    c.jobId === jobId &&
    ((c.initiatorId === initiatorId && c.participantId === participantId) ||
     (c.initiatorId === participantId && c.participantId === initiatorId))
  );

  if (!conversation) {
    conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      jobId,
      initiatorId,
      participantId,
      createdAt: new Date().toISOString(),
    };
    conversations.push(conversation);
  }

  return conversation;
}

/**
 * Finds all conversations for a specific user.
 */
export function getConversationsForUser(userId: string): Conversation[] {
  const res = conversations.filter(c => c.initiatorId === userId || c.participantId === userId);
  // Always include demo conversations for the user (if not already present).
  const existingJobIds = new Set(res.map(c => c.jobId));
  const demoConvs = makeDemoConversationsForUser(userId).filter(dc => !existingJobIds.has(dc.jobId));
  return [...demoConvs, ...res];
}

/**
 * Finds a conversation by its ID.
 */
export function getConversationById(conversationId: string): Conversation | undefined {
  return conversations.find(c => c.id === conversationId);
}
